import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';

export type Evaluacion = '1ª' | '2ª' | '3ª' | 'Final';

export interface Calificacion {
  id: number;

  alumnoId: number;
  asignaturaId: number;

  alumnoNombre: string;
  asignaturaNombre: string;

  evaluacion: Evaluacion;
  nota: number | null;
  fecha: string | null;
}

export interface CalificacionPayload {
  alumnoId: number;
  asignaturaId: number;
  evaluacion: Evaluacion;
  nota: number | null;
  fecha: string | null;
}

@Injectable({ providedIn: 'root' })
export class CalificacionesService extends BaseCrudService<Calificacion> {
  private http = inject(HttpClient);
  private baseUrl = '/api/calificaciones';

  /** Carga todas las calificaciones desde el backend */
  load(): void {
    this.http.get<any[]>(this.baseUrl)
      .subscribe(rawList => {
        const list: Calificacion[] = rawList.map(r => ({
          ...r,
          // en la BD viene como string, la pasamos a number
          nota: r.nota !== null && r.nota !== undefined ? Number(r.nota) : null,
        }));
        this.setAll(list);
      });
  }

  /** Crea una calificación nueva */
  createCalificacion(payload: CalificacionPayload): void {
    this.http.post<any>(this.baseUrl, payload)
      .subscribe(r => {
        const cal: Calificacion = {
          ...r,
          nota: r.nota !== null && r.nota !== undefined ? Number(r.nota) : null,
        };
        this.add(cal);
      });
  }

  /** Actualiza una calificación existente */
  updateCalificacion(id: number, payload: CalificacionPayload): void {
    this.http.put<any>(`${this.baseUrl}/${id}`, payload)
      .subscribe(r => {
        const cal: Calificacion = {
          ...r,
          nota: r.nota !== null && r.nota !== undefined ? Number(r.nota) : null,
        };
        this.update(id, cal);
      });
  }

  /** Elimina una calificación */
  deleteCalificacion(id: number): void {
    this.http.delete<void>(`${this.baseUrl}/${id}`)
      .subscribe(() => this.delete(id));
  }
}