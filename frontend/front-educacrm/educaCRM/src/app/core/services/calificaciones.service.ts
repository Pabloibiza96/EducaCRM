import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, forkJoin } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { NotificationService } from './notification.service';

export type Evaluacion = '1ª' | '2ª' | '3ª' | 'Extraordinaria';

export interface Calificacion {
  id: number;
  alumnoId: number;
  asignaturaId: number;
  evaluacion: Evaluacion;
  nota: number; // 0..10
  observaciones?: string;
  // Objetos anidados opcionales que vienen de la API
  alumno?: {
    id: number;
    nia?: string;
    nombre?: string;
    apellidos?: string;
  };
  asignatura?: {
    id: number;
    nombre?: string;
    codigo?: string;
    curso?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CalificacionesService extends BaseCrudService<Calificacion> {

  constructor(
    private http: HttpClient,
    private notifications: NotificationService
  ) {
    super();
  }

  /**
   * Carga las calificaciones desde el backend.
   * Usa el proxy de Angular para redirigir a http://localhost:3000/api/calificaciones.
   */
  load() {
    this.http.get<Calificacion[]>('/api/calificaciones').pipe(
      catchError(err => {
        console.error('❌ Error cargando calificaciones:', err);
        this.notifications.error('Error al cargar las calificaciones. Intenta de nuevo.');
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        this.setAll(data);
        if (data.length > 0) {
          this.notifications.success(`${data.length} calificaciones cargadas correctamente`);
        }
      }
    });
  }

  /**
   * Carga las calificaciones junto con alumnos y asignaturas de forma coordinada.
   * Retorna un Observable que se completa cuando todos los datos están cargados.
   */
  loadWithDependencies() {
    return forkJoin({
      alumnos: this.http.get('/api/alumnos').pipe(catchError(() => of([]))),
      asignaturas: this.http.get('/api/asignaturas').pipe(catchError(() => of([]))),
      calificaciones: this.http.get<Calificacion[]>('/api/calificaciones').pipe(catchError(() => of([])))
    }).pipe(
      catchError(err => {
        console.error('❌ Error cargando datos relacionados:', err);
        this.notifications.error('Error al cargar los datos. Intenta de nuevo.');
        return of({ alumnos: [], asignaturas: [], calificaciones: [] });
      })
    );
  }
}