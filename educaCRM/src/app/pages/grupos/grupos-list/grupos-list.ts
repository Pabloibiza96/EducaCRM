import { Component, signal, computed } from '@angular/core';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';

type Grupo = { nombre: string; curso: string; tutor: string };

@Component({
  standalone: true,
  imports: [SearchBarComponent, DataTableComponent],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Grupos</h4>
    <app-search-bar [(query)]="q" [placeholder]="'Buscar grupo...'"></app-search-bar>
  </div>

  <app-data-table
    [data]="filtrados()"
    [columns]="columns"
    [trackBy]="trackByNombre"
    (onView)="verGrupo($event)"
    (onEdit)="editarGrupo($event)"
    (onDelete)="eliminarGrupo($event)">
  </app-data-table>
  `
})
export class GruposListComponent {
  q = signal('');
  grupos = signal<Grupo[]>([
    { nombre: '1º ESO A', curso: '2024-2025', tutor: 'Carlos Martínez' },
    { nombre: '1º ESO B', curso: '2024-2025', tutor: 'Laura Sánchez' },
    { nombre: '2º ESO A', curso: '2024-2025', tutor: 'Pedro Gómez' },
  ]);

  columns: TableColumn<Grupo>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'curso', label: 'Curso' },
    { key: 'tutor', label: 'Tutor' }
  ];

  filtrados = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.grupos();
    return this.grupos().filter(g =>
      g.nombre.toLowerCase().includes(t) ||
      g.curso.toLowerCase().includes(t) ||
      g.tutor.toLowerCase().includes(t)
    );
  });

  trackByNombre = (item: Grupo) => item.nombre;

  verGrupo(grupo: Grupo) {
    console.log('Ver:', grupo);
  }

  editarGrupo(grupo: Grupo) {
    console.log('Editar:', grupo);
  }

  eliminarGrupo(grupo: Grupo) {
    console.log('Eliminar:', grupo);
  }
}
