import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';

export interface Grupo {
  id: number;
  nombre: string;
  curso: string;
}

export interface GrupoPayload {
  nombre: string;
  curso: string;
}

@Injectable({ providedIn: 'root' })
export class GruposService extends BaseCrudService<Grupo> {
  private baseUrl = '/api/grupos';

  constructor(private http: HttpClient) {
    super();
  }

  load(): void {
    this.http.get<Grupo[]>(this.baseUrl).subscribe({
      next: (data) => this.setAll(data),
      error: (err) => console.error('Error cargando grupos', err),
    });
  }

  createGrupo(payload: GrupoPayload): void {
    this.http.post<Grupo>(this.baseUrl, payload).subscribe({
      next: (created) => {
        this.setAll([...this.items(), created]);
      },
      error: (err) => console.error('Error creando grupo', err),
    });
  }

  updateGrupo(id: number, payload: GrupoPayload): void {
    this.http.put<Grupo>(`${this.baseUrl}/${id}`, payload).subscribe({
      next: (updated) => {
        this.setAll(this.items().map((g) => (g.id === id ? updated : g)));
      },
      error: (err) => console.error('Error actualizando grupo', err),
    });
  }

  deleteGrupo(id: number): void {
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe({
      next: () => {
        this.setAll(this.items().filter((g) => g.id !== id));
      },
      error: (err) => console.error('Error eliminando grupo', err),
    });
  }
}
