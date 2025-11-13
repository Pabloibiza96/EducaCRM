import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { NotificationService } from './notification.service';

export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  curso: string;
  profesor?: string;
  horas?: number;
}

@Injectable({ providedIn: 'root' })
export class AsignaturasService extends BaseCrudService<Asignatura> {

  constructor(
    private http: HttpClient,
    private notifications: NotificationService
  ) {
    super();
  }

  /**
   * Carga las asignaturas desde el backend.
   * Usa el proxy de Angular para redirigir a http://localhost:3000/api/asignaturas.
   */
  load() {
    this.http.get<Asignatura[]>('/api/asignaturas').pipe(
      catchError(err => {
        console.error('❌ Error cargando asignaturas:', err);
        this.notifications.error('Error al cargar las asignaturas. Intenta de nuevo.');
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        this.setAll(data);
        if (data.length > 0) {
          this.notifications.success(`${data.length} asignaturas cargadas correctamente`);
        }
      }
    });
  }
}
