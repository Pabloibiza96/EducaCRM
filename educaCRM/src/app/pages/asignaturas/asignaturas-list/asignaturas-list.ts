import { Component, signal, computed } from '@angular/core';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';

type Asignatura = { nombre: string; codigo: string; curso: string };

@Component({
  standalone: true,
  imports: [SearchBarComponent, DataTableComponent],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Asignaturas</h4>
    <app-search-bar [(query)]="q" [placeholder]="'Buscar asignatura...'"></app-search-bar>
  </div>

  <app-data-table
    [data]="filtrados()"
    [columns]="columns"
    [trackBy]="trackByCodigo"
    (onView)="verAsignatura($event)"
    (onEdit)="editarAsignatura($event)"
    (onDelete)="eliminarAsignatura($event)">
  </app-data-table>
  `
})
export class AsignaturasListComponent {
  q = signal('');
  asignaturas = signal<Asignatura[]>([
    { nombre: 'Matemáticas', codigo: 'MAT-001', curso: '1º ESO' },
    { nombre: 'Lengua Castellana', codigo: 'LEN-001', curso: '1º ESO' },
    { nombre: 'Ciencias Naturales', codigo: 'CIE-001', curso: '2º ESO' },
  ]);

  columns: TableColumn<Asignatura>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'codigo', label: 'Código' },
    { key: 'curso', label: 'Curso' }
  ];

  filtrados = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.asignaturas();
    return this.asignaturas().filter(a =>
      a.nombre.toLowerCase().includes(t) ||
      a.codigo.toLowerCase().includes(t) ||
      a.curso.toLowerCase().includes(t)
    );
  });

  trackByCodigo = (item: Asignatura) => item.codigo;

  verAsignatura(asignatura: Asignatura) {
    console.log('Ver:', asignatura);
  }

  editarAsignatura(asignatura: Asignatura) {
    console.log('Editar:', asignatura);
  }

  eliminarAsignatura(asignatura: Asignatura) {
    console.log('Eliminar:', asignatura);
  }
}
