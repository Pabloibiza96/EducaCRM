import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { NotificationService } from './notification.service';
import { Role } from '../auth/auth.service';

export interface Usuario {
  id: number;
  username: string;
  rol: Role;
  nombre?: string;
  email?: string;
  activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService extends BaseCrudService<Usuario> {

  constructor(
    private http: HttpClient,
    private notifications: NotificationService
  ) {
    super();
  }

  /**
   * Carga los usuarios desde el backend.
   * Usa el proxy de Angular para redirigir a http://localhost:3000/api/usuarios.
   */
  load() {
    this.http.get<Usuario[]>('/api/usuarios').pipe(
      catchError(err => {
        console.error('❌ Error cargando usuarios:', err);
        this.notifications.error('Error al cargar los usuarios. Intenta de nuevo.');
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        this.setAll(data);
        if (data.length > 0) {
          this.notifications.success(`${data.length} usuarios cargados correctamente`);
        }
      }
    });
  }

  // Alias para mantener compatibilidad con código existente
  get usuarios() {
    return this.items;
  }

  // Método específico para toggle de estado activo
  toggleActivo(id: number) {
    this.items.update(list => list.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  }
}
