import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';
import { AuthService } from '../auth/auth.service';

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
  private auth = inject(AuthService);
  private baseUrl = 'calificaciones';

  load(): void {
    const user = this.auth.currentUser();
    const options =
      user?.rol === 'alumno'
        ? { params: { alumnoId: user.personaId } }
        : {};

    this.http.get<any[]>(this.baseUrl, options).subscribe({
      next: (rawList) => {
        const list: Calificacion[] = rawList.map((r) => ({
          ...r,
          nota: r.nota !== null && r.nota !== undefined ? Number(r.nota) : null,
        }));
        this.setAll(list);
      },
      error: (err) => console.error('Error cargando calificaciones', err),
    });
  }

  createCalificacion(payload: CalificacionPayload): void {
    if (this.auth.currentUser()?.rol === 'alumno') return;
    this.http.post<any>(this.baseUrl, payload).subscribe({
      next: (r) => {
        const cal: Calificacion = {
          ...r,
          nota: r.nota !== null && r.nota !== undefined ? Number(r.nota) : null,
        };
        this.add(cal);
      },
      error: (err) => console.error('Error creando calificación', err),
    });
  }

  updateCalificacion(id: number, payload: CalificacionPayload): void {
    if (this.auth.currentUser()?.rol === 'alumno') return;
    this.http.put<any>(`${this.baseUrl}/${id}`, payload).subscribe({
      next: (r) => {
        const cal: Calificacion = {
          ...r,
          nota: r.nota !== null && r.nota !== undefined ? Number(r.nota) : null,
        };
        this.update(id, cal);
      },
      error: (err) => console.error('Error actualizando calificación', err),
    });
  }

  deleteCalificacion(id: number): void {
    if (this.auth.currentUser()?.rol === 'alumno') return;
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe({
      next: () => this.delete(id),
      error: (err) => console.error('Error eliminando calificación', err),
    });
  }
}
