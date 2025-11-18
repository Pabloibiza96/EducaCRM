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
  constructor(private http: HttpClient) {
    super();
  }

  /** Carga todos los usuarios desde la API */
  load(): void {
    this.http.get<Usuario[]>('/api/usuarios').subscribe({
      next: (data) => this.setAll(data),
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  /** Crea un nuevo usuario en backend y actualiza el estado local */
  createUsuario(payload: UsuarioPayload): void {
    this.http.post<Usuario>('/api/usuarios', payload).subscribe({
      next: (created) => {
        this.add(created);
      },
      error: (err) => {
        console.error('Error creando usuario', err);
        alert('Error creando usuario');
      },
    });
  }

  /** Actualiza usuario existente en backend y estado local */
  updateUsuario(id: number, payload: UsuarioPayload): void {
    this.http.put<Usuario>(`/api/usuarios/${id}`, payload).subscribe({
      next: (updated) => {
        this.update(updated.id, updated);
      },
      error: (err) => {
        console.error('Error actualizando usuario', err);
        alert('Error actualizando usuario');
      },
    });
  }

  /** Elimina usuario en backend y del estado local */
  deleteUsuario(id: number): void {
    this.http.delete<void>(`/api/usuarios/${id}`).subscribe({
      next: () => this.delete(id),
      error: (err) => {
        console.error('Error eliminando usuario', err);
        alert('Error eliminando usuario');
      },
    });
  }
}