import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from '../../../core/services/usuarios.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { CrudTableComponent, TableColumn, ActionButton } from '../../../shared/components/crud-table/crud-table.component';
import { Role } from '../../../core/auth/auth.service';
import { RoleService } from '../../../core/auth/role.service';

@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule, GenericModalComponent, CrudTableComponent],
  templateUrl: './admin-users.html',
})
export class AdminUsersComponent extends BaseCrudListComponent<Usuario> {
  @ViewChild('modalUsuario') modalUsuario!: GenericModalComponent;
  @ViewChild('rolBadgeTpl', { static: true }) rolBadgeTpl!: TemplateRef<any>;
  @ViewChild('activoBadgeTpl', { static: true }) activoBadgeTpl!: TemplateRef<any>;
  
  protected get modal(): GenericModalComponent {
    return this.modalUsuario;
  }

  roles: Role[] = ['alumno', 'profesor', 'jefatura', 'direccion', 'administrador'];

  columns!: TableColumn<Usuario>[];

  actions: ActionButton<Usuario>[] = [
    {
      label: 'Editar',
      btnClass: 'btn-sm btn-outline-primary',
      onClick: (u) => this.editar(u),
      hidden: () => !this.roleService.canEdit('usuarios')
    },
    {
      icon: 'power',
      btnClass: 'btn-sm btn-outline-warning',
      tooltip: 'Toggle activo/inactivo',
      onClick: (u) => this.toggleActivo(u.id),
      hidden: () => !this.roleService.canEdit('usuarios')
    },
    {
      label: 'Eliminar',
      btnClass: 'btn-sm btn-outline-danger',
      onClick: (u) => this.eliminar(u.id),
      hidden: () => !this.roleService.canDelete('usuarios')
    }
  ];

  constructor(
    public srv: UsuariosService,
    public roleService: RoleService
  ) {
    super(srv, { id: 0, username: '', rol: 'alumno', nombre: '', email: '', activo: true });
  }

  override ngOnInit(): void {
    this.srv.load();
    
    // Inicializar columnas después de que los templates estén disponibles
    this.columns = [
      { key: 'id', header: 'ID', width: '80px' },
      { 
        key: 'username',
        header: 'Usuario',
        formatter: (val) => val,
        cellClass: 'fw-bold'
      },
      { 
        key: 'nombre',
        header: 'Nombre',
        formatter: (val) => val || '-'
      },
      { 
        key: 'email',
        header: 'Email',
        formatter: (val) => val || '-'
      },
      {
        key: 'rol',
        header: 'Rol',
        template: this.rolBadgeTpl
      },
      {
        key: 'activo',
        header: 'Estado',
        template: this.activoBadgeTpl
      }
    ];
  }

  get usuarios() {
    return () => this.srv.items();
  }

  protected override getSearchFields(usuario: Usuario): string[] {
    return [
      usuario.username,
      usuario.rol,
      usuario.nombre || '',
      usuario.email || ''
    ];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar usuario?';
  }

  toggleActivo(id: number) {
    this.srv.toggleActivo(id);
  }

  getRolBadgeClass(rol: Role): string {
    const classes: Record<Role, string> = {
      'administrador': 'bg-danger',
      'direccion': 'bg-primary',
      'jefatura': 'bg-info',
      'profesor': 'bg-success',
      'alumno': 'bg-secondary'
    };
    return classes[rol] || 'bg-secondary';
  }
}
