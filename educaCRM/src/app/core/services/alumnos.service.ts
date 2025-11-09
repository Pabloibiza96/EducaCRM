import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';

export interface Alumno {
  id: number; nombre: string; apellidos: string; email: string; grupo: string;
}

@Injectable({ providedIn: 'root' })
export class AlumnosService extends BaseCrudService<Alumno> {
  loadMock() {
    this.setAll([
      { id: 1, nombre: 'María', apellidos: 'Gómez López', email: 'maria@escuela.com', grupo: '1ºA' },
      { id: 2, nombre: 'Luis', apellidos: 'Martín Pérez', email: 'luis@escuela.com', grupo: '1ºB' },
      { id: 3, nombre: 'Carla', apellidos: 'Ruiz Sánchez', email: 'carla@escuela.com', grupo: '2ºA' },
    ]);
  }
}