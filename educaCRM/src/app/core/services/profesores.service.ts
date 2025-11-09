import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';

export interface Profesor {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  departamento: string;
  asignaturas?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfesoresService extends BaseCrudService<Profesor> {
  loadMock() {
    this.setAll([
      { id: 1, nombre: 'Laura', apellidos: 'Gómez Pérez', email: 'laura@educa.com', departamento: 'Matemáticas', asignaturas: 'Matemáticas, Álgebra' },
      { id: 2, nombre: 'Carlos', apellidos: 'Ruiz Torres', email: 'carlos@educa.com', departamento: 'Lengua', asignaturas: 'Lengua, Literatura' },
      { id: 3, nombre: 'Ana', apellidos: 'Martín López', email: 'ana@educa.com', departamento: 'Inglés', asignaturas: 'Inglés' },
    ]);
  }
}
