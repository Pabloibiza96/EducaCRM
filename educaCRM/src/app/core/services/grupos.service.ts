import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { NotificationService } from './notification.service';

export interface Grupo {
  id: number;
  nombre: string;
  curso: string;
  tutor: string;
  numAlumnos?: number;
}

@Injectable({ providedIn: 'root' })
export class GruposService extends BaseCrudService<Grupo> {

  constructor(
    private http: HttpClient,
    private notifications: NotificationService
  ) {
    super();
  }

  /**
   * Carga los grupos desde el backend.
   * Usa el proxy de Angular para redirigir a http://localhost:3000/api/grupos.
   */
  load() {
    this.http.get<Grupo[]>('/api/grupos').pipe(
      catchError(err => {
        console.error('❌ Error cargando grupos:', err);
        this.notifications.error('Error al cargar los grupos. Intenta de nuevo.');
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        this.setAll(data);
        if (data.length > 0) {
          this.notifications.success(`${data.length} grupos cargados correctamente`);
        }
      }
    });
  }

  // Alias para mantener compatibilidad con código existente
  get grupos() {
    return this.items;
  }
}
