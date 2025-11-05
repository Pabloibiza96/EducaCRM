import { Component, signal, computed } from '@angular/core';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';

type Usuario = { username: string; rol: 'alumno'|'profesor'|'jefatura'|'direccion'|'administrador' };

@Component({
  standalone: true,
  imports: [SearchBarComponent, DataTableComponent],
  template: `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Administración de Usuarios</h4>
    <app-search-bar [(query)]="q" [placeholder]="'Buscar usuario...'"></app-search-bar>
  </div>

  <app-data-table
    [data]="filtrados()"
    [columns]="columns"
    [trackBy]="trackByUsername"
    (onView)="verUsuario($event)"
    (onEdit)="editarUsuario($event)"
    (onDelete)="eliminarUsuario($event)">
  </app-data-table>
  `
})
export class AdminUsersComponent {
  q = signal('');
  usuarios = signal<Usuario[]>([
    { username: 'admin', rol: 'administrador' },
    { username: 'director1', rol: 'direccion' },
    { username: 'jefe.estudios', rol: 'jefatura' },
    { username: 'carlos.martinez', rol: 'profesor' },
    { username: 'ana.garcia', rol: 'alumno' },
  ]);

  columns: TableColumn<Usuario>[] = [
    { key: 'username', label: 'Username' },
    { key: 'rol', label: 'Rol' }
  ];

  filtrados = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.usuarios();
    return this.usuarios().filter(u =>
      u.username.toLowerCase().includes(t) ||
      u.rol.toLowerCase().includes(t)
    );
  });

  trackByUsername = (item: Usuario) => item.username;

  verUsuario(usuario: Usuario) {
    console.log('Ver:', usuario);
  }

  editarUsuario(usuario: Usuario) {
    console.log('Editar:', usuario);
  }

  eliminarUsuario(usuario: Usuario) {
    console.log('Eliminar:', usuario);
  }
}