import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';

export interface Profesor {
  id: number;
  nombre: string;
  apellidos: string;
  email: string | null;
  departamento: string | null;
}

export interface ProfesorPayload {
  nombre: string;
  apellidos: string;
  email?: string | null;
  departamento?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProfesoresService extends BaseCrudService<Profesor> {
  constructor(private http: HttpClient) {
    super();
  }

  load() {
    this.http.get<Profesor[]>('/api/profesores').subscribe({
      next: (data) => this.setAll(data),
      error: (err) => console.error('Error cargando profesores', err),
    });
  }

  createProfesor(payload: ProfesorPayload) {
    this.http.post<Profesor>('/api/profesores', payload).subscribe({
      next: (prof) => this.add(prof),
      error: (err) => console.error('Error creando profesor', err),
    });
  }

  updateProfesor(id: number, payload: ProfesorPayload) {
    this.http.put<Profesor>(`/api/profesores/${id}`, payload).subscribe({
      next: (prof) => this.update(id, prof),
      error: (err) => console.error('Error actualizando profesor', err),
    });
  }

  deleteProfesor(id: number) {
    this.http.delete<void>(`/api/profesores/${id}`).subscribe({
      next: () => this.delete(id),
      error: (err) => console.error('Error eliminando profesor', err),
    });
  }
}