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
  constructor(private http: HttpClient) {
    super();
  }

  load() {
    this.http.get<Departamento[]>('/api/departamentos').subscribe({
      next: (data) => this.setAll(data),
      error: (err) => console.error('Error cargando departamentos', err),
    });
  }

  createDepartamento(payload: DepartamentoPayload) {
    this.http.post<Departamento>('/api/departamentos', payload).subscribe({
      next: (d) => this.add(d),
      error: (err) => console.error('Error creando departamento', err),
    });
  }

  updateDepartamento(id: number, payload: DepartamentoPayload) {
    this.http.put<Departamento>(`/api/departamentos/${id}`, payload).subscribe({
      next: (d) => this.update(id, d),
      error: (err) => console.error('Error actualizando departamento', err),
    });
  }

  deleteDepartamento(id: number) {
    this.http.delete<void>(`/api/departamentos/${id}`).subscribe({
      next: () => this.delete(id),
      error: (err) => console.error('Error eliminando departamento', err),
    });
  }
}