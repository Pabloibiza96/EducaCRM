import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ReportesService,
  AlumnoResumenDTO
} from '../../../core/services/reportes.service';

@Component({
  standalone: true,
  selector: 'app-alumno-resumen',
  imports: [CommonModule],
  templateUrl: './alumno-resumen.html',
})
export class AlumnoResumenComponent {
  resumen: AlumnoResumenDTO | null = null;
  cargando = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportesSrv: ReportesService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'ID de alumno no válido';
      this.cargando = false;
      return;
    }

    this.reportesSrv.getResumenAlumno(id).subscribe({
      next: (data) => {
        this.resumen = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el resumen del alumno';
        this.cargando = false;
      },
    });
  }

  volverAReportes() {
    this.router.navigate(['/reportes/alumnos-medias']);
  }
}