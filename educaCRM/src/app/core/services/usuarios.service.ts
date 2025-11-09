import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { Role } from '../auth/auth.service';

export interface Usuario {
  id: number;
  username: string;
  rol: Role;
  nombre?: string;
  email?: string;
  activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService extends BaseCrudService<Usuario> {
  
  loadMock() {
    this.setAll([
      { id: 1, username: 'admin', rol: 'administrador', nombre: 'Administrador', email: 'admin@educacrm.es', activo: true },
      { id: 2, username: 'director1', rol: 'direccion', nombre: 'Director Principal', email: 'director@educacrm.es', activo: true },
      { id: 3, username: 'jefe.estudios', rol: 'jefatura', nombre: 'Jefe de Estudios', email: 'jefe@educacrm.es', activo: true },
      { id: 4, username: 'carlos.martinez', rol: 'profesor', nombre: 'Carlos Martínez', email: 'carlos.martinez@educacrm.es', activo: true },
      { id: 5, username: 'ana.garcia', rol: 'alumno', nombre: 'Ana García', email: 'ana.garcia@educacrm.es', activo: true },
      { id: 6, username: 'laura.sanchez', rol: 'profesor', nombre: 'Laura Sánchez', email: 'laura.sanchez@educacrm.es', activo: true },
    ]);
  }

  // Alias para mantener compatibilidad con código existente
  get usuarios() {
    return this.items;
  }

  // Método específico para toggle de estado activo
  toggleActivo(id: number) {
    this.items.update(list => list.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  }
}
