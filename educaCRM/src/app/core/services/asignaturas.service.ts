import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';

export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  curso: string;
  profesor?: string;
}

@Injectable({ providedIn: 'root' })
export class AsignaturasService extends BaseCrudService<Asignatura> {
  loadMock() {
    this.setAll([
      { id: 1, nombre: 'Matemáticas', codigo: 'MAT101', curso: '1º ESO', profesor: 'Laura Gómez' },
      { id: 2, nombre: 'Lengua Castellana', codigo: 'LEN102', curso: '1º ESO', profesor: 'Carlos Ruiz' },
      { id: 3, nombre: 'Inglés', codigo: 'ING103', curso: '1º ESO', profesor: 'Ana Martín' },
    ]);
  }
}
