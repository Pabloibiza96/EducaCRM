import { Component, signal, computed } from '@angular/core';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';

type Calificacion = { alumno: string; asignatura: string; evaluacion: string; nota: number };

@Component({
  standalone: true,
  imports: [SearchBarComponent, DataTableComponent],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Calificaciones</h4>
    <app-search-bar [(query)]="q" [placeholder]="'Buscar calificación...'"></app-search-bar>
  </div>

  <app-data-table
    [data]="filtrados()"
    [columns]="columns"
    [trackBy]="trackByIndex"
    (onView)="verCalificacion($event)"
    (onEdit)="editarCalificacion($event)"
    (onDelete)="eliminarCalificacion($event)">
  </app-data-table>
  `
})
export class CalificacionesListComponent {
  q = signal('');
  calificaciones = signal<Calificacion[]>([
    { alumno: 'Ana García', asignatura: 'Matemáticas', evaluacion: '1ª Evaluación', nota: 8.5 },
    { alumno: 'Luis Pérez', asignatura: 'Lengua', evaluacion: '1ª Evaluación', nota: 7.0 },
    { alumno: 'María Ruiz', asignatura: 'Ciencias', evaluacion: '2ª Evaluación', nota: 9.0 },
  ]);

  columns: TableColumn<Calificacion>[] = [
    { key: 'alumno', label: 'Alumno' },
    { key: 'asignatura', label: 'Asignatura' },
    { key: 'evaluacion', label: 'Evaluación' },
    { key: 'nota', label: 'Nota' }
  ];

  filtrados = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.calificaciones();
    return this.calificaciones().filter(c =>
      c.alumno.toLowerCase().includes(t) ||
      c.asignatura.toLowerCase().includes(t) ||
      c.evaluacion.toLowerCase().includes(t)
    );
  });

  trackByIndex = (item: Calificacion) => `${item.alumno}-${item.asignatura}-${item.evaluacion}`;

  verCalificacion(calificacion: Calificacion) {
    console.log('Ver:', calificacion);
  }

  editarCalificacion(calificacion: Calificacion) {
    console.log('Editar:', calificacion);
  }

  eliminarCalificacion(calificacion: Calificacion) {
    console.log('Eliminar:', calificacion);
  }
}
