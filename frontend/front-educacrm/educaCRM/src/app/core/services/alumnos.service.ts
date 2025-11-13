import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { NotificationService } from './notification.service';

export interface Alumno {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  grupo: string;
}

@Injectable({ providedIn: 'root' })
export class AlumnosService extends BaseCrudService<Alumno> {

  constructor(
    private http: HttpClient,
    private notifications: NotificationService
  ) {
    super();
  }

  /**
   * Carga los alumnos desde el backend.
   * Usa el proxy de Angular para redirigir a http://localhost:3000/api/alumnos.
   */
  load() {
    this.http.get<Alumno[]>('/api/alumnos').pipe(
      catchError(err => {
        console.error('❌ Error cargando alumnos:', err);
        this.notifications.error('Error al cargar los alumnos. Intenta de nuevo.');
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        this.setAll(data);
        if (data.length > 0) {
          this.notifications.success(`${data.length} alumnos cargados correctamente`);
        }
      }
    });
  }
}