import { Component, signal, computed } from '@angular/core';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';

type Profe = { nombre: string; departamento: string; email: string };

@Component({
  standalone: true,
  imports: [SearchBarComponent, DataTableComponent],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Profesores</h4>
    <app-search-bar [(query)]="q" [placeholder]="'Buscar profesor...'"></app-search-bar>
  </div>

  <app-data-table
    [data]="filtrados()"
    [columns]="columns"
    [trackBy]="trackByEmail"
    (onView)="verProfesor($event)"
    (onEdit)="editarProfesor($event)"
    (onDelete)="eliminarProfesor($event)">
  </app-data-table>
  `
})
export class ProfesoresListComponent {
  q = signal('');
  profesores = signal<Profe[]>([
    { nombre: 'Carlos Martínez', departamento: 'Matemáticas', email: 'carlos.martinez@educacrm.es' },
    { nombre: 'Laura Sánchez', departamento: 'Lengua', email: 'laura.sanchez@educacrm.es' },
    { nombre: 'Pedro Gómez', departamento: 'Ciencias', email: 'pedro.gomez@educacrm.es' },
  ]);

  columns: TableColumn<Profe>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'email', label: 'Email' }
  ];

  filtrados = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.profesores();
    return this.profesores().filter(p =>
      p.nombre.toLowerCase().includes(t) ||
      p.departamento.toLowerCase().includes(t) ||
      p.email.toLowerCase().includes(t)
    );
  });

  trackByEmail = (item: Profe) => item.email;

  verProfesor(profesor: Profe) {
    console.log('Ver:', profesor);
  }

  editarProfesor(profesor: Profe) {
    console.log('Editar:', profesor);
  }

  eliminarProfesor(profesor: Profe) {
    console.log('Eliminar:', profesor);
  }
}
