import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { NotificationService } from './notification.service';

export interface Profesor {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  departamento: string;
  asignaturas?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfesoresService extends BaseCrudService<Profesor> {

  constructor(
    private http: HttpClient,
    private notifications: NotificationService
  ) {
    super();
  }

  /**
   * Carga los profesores desde el backend.
   * Usa el proxy de Angular para redirigir a http://localhost:3000/api/profesores.
   */
  load() {
    this.http.get<Profesor[]>('/api/profesores').pipe(
      catchError(err => {
        console.error('❌ Error cargando profesores:', err);
        this.notifications.error('Error al cargar los profesores. Intenta de nuevo.');
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        this.setAll(data);
        if (data.length > 0) {
          this.notifications.success(`${data.length} profesores cargados correctamente`);
        }
      }
    });
  }
}
