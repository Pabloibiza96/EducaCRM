// src/app/core/services/profesores.service.ts
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
  private readonly baseUrl = '/api/profesores';

  constructor(private http: HttpClient) {
    super();
  }

  /** Cargar todos los profesores desde el backend */
  load(): void {
    this.http.get<Profesor[]>(this.baseUrl).subscribe({
      next: (data) => this.setAll(data),
      error: (err) => console.error('Error cargando profesores', err),
    });
  }

  /** Crear profesor en backend y actualizar el estado local */
  createProfesor(payload: ProfesorPayload): void {
    this.http.post<Profesor>(this.baseUrl, payload).subscribe({
      next: (prof) => this.add(prof),
      error: (err) => console.error('Error creando profesor', err),
    });
  }

  /** Actualizar profesor en backend y estado local */
  updateProfesor(id: number, payload: ProfesorPayload): void {
    this.http.put<Profesor>(`${this.baseUrl}/${id}`, payload).subscribe({
      next: (prof) => {
        // usamos el update del BaseCrudService para actualizar el array
        this.update(id, prof);
      },
      error: (err) => console.error('Error actualizando profesor', err),
    });
  }

  /** Borrar profesor en backend y estado local */
  deleteProfesor(id: number): void {
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe({
      next: () => this.delete(id),
      error: (err) => console.error('Error eliminando profesor', err),
    });
  }
}