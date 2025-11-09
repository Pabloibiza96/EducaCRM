import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';

export interface Grupo {
  id: number;
  nombre: string;
  curso: string;
  tutor: string;
  numAlumnos?: number;
}

@Injectable({ providedIn: 'root' })
export class GruposService extends BaseCrudService<Grupo> {
  
  loadMock() {
    this.setAll([
      { id: 1, nombre: '1º ESO A', curso: '2024-2025', tutor: 'Carlos Martínez', numAlumnos: 25 },
      { id: 2, nombre: '1º ESO B', curso: '2024-2025', tutor: 'Laura Sánchez', numAlumnos: 23 },
      { id: 3, nombre: '2º ESO A', curso: '2024-2025', tutor: 'Pedro Gómez', numAlumnos: 27 },
      { id: 4, nombre: '2º ESO B', curso: '2024-2025', tutor: 'Ana López', numAlumnos: 24 },
    ]);
  }

  // Alias para mantener compatibilidad con código existente
  get grupos() {
    return this.items;
  }
}
