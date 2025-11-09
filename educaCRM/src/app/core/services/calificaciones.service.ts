import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';

export type Evaluacion = '1ª' | '2ª' | '3ª' | 'Extraordinaria';

export interface Calificacion {
  id: number;
  alumnoId: number;
  asignaturaId: number;
  evaluacion: Evaluacion;
  nota: number; // 0..10
  observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class CalificacionesService extends BaseCrudService<Calificacion> {
  loadMock() {
    this.setAll([
      { id: 1, alumnoId: 1, asignaturaId: 1, evaluacion: '1ª', nota: 7.5, observaciones: '' },
      { id: 2, alumnoId: 2, asignaturaId: 2, evaluacion: '1ª', nota: 6.0, observaciones: '' },
      { id: 3, alumnoId: 3, asignaturaId: 3, evaluacion: '2ª', nota: 8.0, observaciones: 'Mejora' },
    ]);
  }
}