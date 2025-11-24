import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseCrudService } from './base-crud.service';

export interface Profesor {
  id: number;
  nombre: string;
  apellidos: string;
  email: string | null;
  departamento: string | null;
  departamentoId: number | null;
}

export interface ProfesorPayload {
  nombre: string;
  apellidos: string;
  email: string | null;
  departamentoId: number | null;
}

@Injectable({ providedIn: 'root' })
export class ProfesoresService extends BaseCrudService<Profesor> {
  private readonly baseUrl = 'profesores';

  constructor(private http: HttpClient) {
    super();
  }

  load(): void {
    this.http.get<Profesor[]>(this.baseUrl).subscribe({
      next: (data) => this.setAll(data),
      error: (err) => console.error('Error cargando profesores', err),
    });
  }

  createProfesor(payload: ProfesorPayload): void {
    this.http.post<Profesor>(this.baseUrl, payload).subscribe({
      next: (prof) => this.add(prof),
      error: (err) => console.error('Error creando profesor', err),
    });
  }

  updateProfesor(id: number, payload: ProfesorPayload): void {
    this.http.put<Profesor>(`${this.baseUrl}/${id}`, payload).subscribe({
      next: (prof) => this.update(id, prof),
      error: (err) => console.error('Error actualizando profesor', err),
    });
  }

  deleteProfesor(id: number): void {
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe({
      next: () => this.delete(id),
      error: (err) => console.error('Error eliminando profesor', err),
    });
  }
}
