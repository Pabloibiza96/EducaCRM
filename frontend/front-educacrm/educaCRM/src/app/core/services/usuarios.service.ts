import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';
import { Role } from '../auth/auth.service';

export interface Usuario {
  id: number;
  username: string;
  rol: Role;
  personaId: number;
  nombre: string;
  apellidos: string;
  email: string | null;
  password?: string;
}

export interface UsuarioPayload {
  username: string;
  password?: string;
  rol: Role;
  nombre: string;
  apellidos: string;
  email?: string | null;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService extends BaseCrudService<Usuario> {
  private baseUrl = 'usuarios';

  constructor(private http: HttpClient) {
    super();
  }

  load(): void {
    this.http.get<Usuario[]>(this.baseUrl).subscribe({
      next: (data) => this.setAll(data),
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  createUsuario(payload: UsuarioPayload): void {
    this.http.post<Usuario>(this.baseUrl, payload).subscribe({
      next: (created) => this.add(created),
      error: (err) => console.error('Error creando usuario', err),
    });
  }

  updateUsuario(id: number, payload: UsuarioPayload): void {
    this.http.put<Usuario>(`${this.baseUrl}/${id}`, payload).subscribe({
      next: (updated) => this.update(id, updated),
      error: (err) => console.error('Error actualizando usuario', err),
    });
  }

  deleteUsuario(id: number): void {
    this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe({
      next: () => this.delete(id),
      error: (err) => console.error('Error eliminando usuario', err),
    });
  }
}
