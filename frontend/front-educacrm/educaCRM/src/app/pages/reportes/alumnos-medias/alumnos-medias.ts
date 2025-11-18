import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  ReportesService,
  AlumnoMediaRow,
} from '../../../core/services/reportes.service';

@Component({
  standalone: true,
  selector: 'app-alumnos-medias',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './alumnos-medias.html',
})
export class AlumnosMediasComponent {
  q = '';

  filas: AlumnoMediaRow[] = [];

  constructor(private reportesSrv: ReportesService) {
    this.cargar();
  }

  private cargar() {
    this.reportesSrv.getAlumnosMedias().subscribe({
      next: (rows) => (this.filas = rows),
      error: (err) => {
        console.error('Error cargando medias de alumnos', err);
        this.filas = [];
      },
    });
  }

  filtrados(): AlumnoMediaRow[] {
    const t = this.q.trim().toLowerCase();
    if (!t) return this.filas;

    return this.filas.filter((r) => {
      const nombre = `${r.nombre} ${r.apellidos}`.toLowerCase();
      const grupo = (r.grupo || '').toLowerCase();
      return nombre.includes(t) || grupo.includes(t);
    });
  }
}