import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';

export interface Departamento {
  id: number;
  nombre: string;
}

export interface DepartamentoPayload {
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class DepartamentosService extends BaseCrudService<Departamento> {
  private baseUrl = 'departamentos';

  constructor(private http: HttpClient) {
    super();
  }

  load(): void {
    this.http.get<Departamento[]>(this.baseUrl).subscribe({
      next: data => this.setAll(data),
      error: err => console.error('Error cargando departamentos', err),
    });
  }

  createDepartamento(payload: DepartamentoPayload): void {
    this.http.post<Departamento>(this.baseUrl, payload).subscribe({
      next: d => this.add(d),
      error: err => console.error('Error creando departamento', err),
    });
  }

  updateDepartamento(id: number, payload: DepartamentoPayload): void {
    this.http.put<Departamento>(`${this.baseUrl}/${id}`, payload).subscribe({
      next: d => this.update(id, d),
      error: err => console.error('Error actualizando departamento', err),
    });
  }

  deleteDepartamento(id: number): void {
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe({
      next: () => this.delete(id),
      error: err => console.error('Error eliminando departamento', err),
    });
  }
}