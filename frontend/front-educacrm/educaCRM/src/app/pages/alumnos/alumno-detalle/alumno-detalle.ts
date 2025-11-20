// src/app/pages/alumnos/alumno-detalle/alumno-detalle.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  AlumnosService,
  Alumno,
} from '../../../core/services/alumnos.service';

@Component({
  standalone: true,
  selector: 'app-alumno-detalle',
  imports: [CommonModule, RouterLink],
  templateUrl: './alumno-detalle.html',
})
export class AlumnoDetalleComponent {
  alumnoId!: number;

  constructor(
    private route: ActivatedRoute,
    public alumnosSrv: AlumnosService
  ) {}

  ngOnInit(): void {
    this.alumnoId = Number(this.route.snapshot.paramMap.get('id'));
    // Aseguramos que la lista de alumnos está cargada
    this.alumnosSrv.load();
  }

  /** Busca el alumno en la lista cargada en el servicio */
  get alumno(): Alumno | undefined {
    return this.alumnosSrv
      .items()
      .find((a) => a.id === this.alumnoId);
  }
}