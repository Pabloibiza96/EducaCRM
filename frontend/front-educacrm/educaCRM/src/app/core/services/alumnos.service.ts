import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';

export interface Alumno {
  id: number;
  nia: string;
  fechaAlta: string | null;
  nombre: string;
  apellidos: string;
  email: string | null;
  grupo: string | null;
}

export interface AlumnoPayload {
  nombre: string;
  apellidos: string;
  email?: string | null;
  grupo?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AlumnosService extends BaseCrudService<Alumno> {
  constructor(private http: HttpClient) {
    super();
  }

  /** Carga inicial desde backend */
  load() {
    this.http.get<Alumno[]>('alumnos').subscribe({
      next: (data) => this.setAll(data),
      error: (err) => console.error('Error cargando alumnos', err),
    });
  }

  /** Crear alumno en backend + actualizar estado local */
  createAlumno(payload: AlumnoPayload) {
    return this.http.post<Alumno>('alumnos', payload).subscribe({
      next: (alumno) => {
        this.add(alumno);
      },
      error: (err) => console.error('Error creando alumno', err),
    });
  }

  /** Actualizar alumno en backend + actualizar estado local */
  updateAlumno(id: number, payload: AlumnoPayload) {
    return this.http.put<Alumno>(`alumnos/${id}`, payload).subscribe({
      next: (alumno) => {
        this.update(id, alumno);
      },
      error: (err) => console.error('Error actualizando alumno', err),
    });
  }

  /** Borrar alumno en backend + actualizar estado local */
  deleteAlumno(id: number) {
    return this.http.delete<void>(`alumnos/${id}`).subscribe({
      next: () => {
        this.delete(id);
      },
      error: (err) => console.error('Error eliminando alumno', err),
    });
  }
}
