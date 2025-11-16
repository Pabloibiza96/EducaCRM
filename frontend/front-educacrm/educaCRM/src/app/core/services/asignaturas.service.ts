import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';

export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  curso: string | null;
}

export interface AsignaturaPayload {
  nombre: string;
  codigo: string;
  curso?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AsignaturasService extends BaseCrudService<Asignatura> {
  constructor(private http: HttpClient) {
    super();
  }

  /** Cargar todas las asignaturas desde el backend */
  load(): void {
    this.http.get<Asignatura[]>('/api/asignaturas').subscribe({
      next: (data) => this.setAll(data),
      error: (err) => console.error('Error cargando asignaturas', err),
    });
  }

  /** Crear una nueva asignatura */
  createAsignatura(payload: AsignaturaPayload): void {
    this.http.post<Asignatura>('/api/asignaturas', payload).subscribe({
      next: (created) => this.add(created),
      error: (err) => console.error('Error creando asignatura', err),
    });
  }

  /** Actualizar asignatura existente */
  updateAsignatura(id: number, payload: AsignaturaPayload): void {
    this.http.put<Asignatura>(`/api/asignaturas/${id}`, payload).subscribe({
      next: (updated) => this.update(id, updated),
      error: (err) => console.error('Error actualizando asignatura', err),
    });
  }

  /** Eliminar asignatura */
  deleteAsignatura(id: number): void {
    this.http.delete<void>(`/api/asignaturas/${id}`).subscribe({
      next: () => this.delete(id),
      error: (err) => console.error('Error eliminando asignatura', err),
    });
  }
}