import { Component, signal, computed } from '@angular/core';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';

type Alumno = { nombre: string; grupo: string; nia: string };

@Component({
  standalone: true,
  imports: [SearchBarComponent, DataTableComponent],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Alumnos</h4>
    <app-search-bar [(query)]="q" [placeholder]="'Buscar alumno...'"></app-search-bar>
  </div>

  <app-data-table
    [data]="filtrados()"
    [columns]="columns"
    [trackBy]="trackByNia"
    (onView)="verAlumno($event)"
    (onEdit)="editarAlumno($event)"
    (onDelete)="eliminarAlumno($event)">
  </app-data-table>
  `
})
export class AlumnosListComponent {
  q = signal('');
  alumnos = signal<Alumno[]>([
    { nombre: 'Ana García', grupo: '1º ESO A', nia: 'ALU-0001' },
    { nombre: 'Luis Pérez', grupo: '1º ESO B', nia: 'ALU-0002' },
    { nombre: 'María Ruiz', grupo: '2º ESO A', nia: 'ALU-0003' },
  ]);

  columns: TableColumn<Alumno>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'grupo', label: 'Grupo' },
    { key: 'nia', label: 'NIA' }
  ];

  filtrados = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.alumnos();
    return this.alumnos().filter(a =>
      a.nombre.toLowerCase().includes(t) ||
      a.grupo.toLowerCase().includes(t) ||
      a.nia.toLowerCase().includes(t)
    );
  });

  trackByNia = (item: Alumno) => item.nia;

  verAlumno(alumno: Alumno) {
    console.log('Ver:', alumno);
  }

  editarAlumno(alumno: Alumno) {
    console.log('Editar:', alumno);
  }

  eliminarAlumno(alumno: Alumno) {
    console.log('Eliminar:', alumno);
  }
}