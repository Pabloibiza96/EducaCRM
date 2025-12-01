import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import {
  UsuariosService,
  Usuario,
  UsuarioPayload,
} from '../../../core/services/usuarios.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import {
  CrudTableComponent,
  TableColumn,
  ActionButton,
} from '../../../shared/components/crud-table/crud-table.component';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { Role, AuthService } from '../../../core/auth/auth.service';
import { RoleService } from '../../../core/auth/role.service';

@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [
    CommonModule,
    FormsModule,
    GenericModalComponent,
    CrudTableComponent,
  ],
  templateUrl: './admin-users.html',
})
export class AdminUsersComponent extends BaseCrudListComponent<Usuario> {
  @ViewChild('modalUsuario') modalUsuario!: GenericModalComponent;
  @ViewChild('formUsuario') formUsuario!: NgForm;

  rolesPosibles: Role[] = [
    'administrador',
    'direccion',
    'jefatura',
    'profesor',
    'alumno',
  ];

  protected get modal(): GenericModalComponent {
    return this.modalUsuario;
  }

  columns: TableColumn<Usuario>[] = [
    { key: 'id', header: 'ID', width: '70px' },
    { key: 'username', header: 'Usuario' },
    { key: 'rol', header: 'Rol' },
    {
      header: 'Nombre completo',
      valueGetter: (u) => `${u.nombre} ${u.apellidos}`,
    },
    { key: 'email', header: 'Email' },
  ];

  actions: ActionButton<Usuario>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar usuario',
      onClick: (u) => {
        if (!this.roleService.canEdit('usuarios')) return;
        this.abrirModal(false, u);
      },
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar usuario',
      onClick: (u) => {
        if (!this.roleService.canDelete('usuarios')) return;
        this.eliminar(u.id);
      },
    },
  ];

  constructor(
    public usuariosSrv: UsuariosService,
    public roleService: RoleService,
    private auth: AuthService
  ) {
    super(usuariosSrv, {
      id: 0,
      username: '',
      rol: 'alumno',
      personaId: 0,
      nombre: '',
      apellidos: '',
      email: null,
      password: '',
    });
  }

  override ngOnInit(): void {
    this.usuariosSrv.load();
  }

  protected override getSearchFields(u: Usuario): string[] {
    return [u.username, u.rol, u.nombre, u.apellidos, u.email ?? ''];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar usuario? Ten en cuenta que esta acción no se puede deshacer.';
  }


  private buildPayload(): UsuarioPayload {
    const base: UsuarioPayload = {
      username: this.actual.username,
      rol: this.actual.rol,
      nombre: this.actual.nombre,
      apellidos: this.actual.apellidos,
      email: this.actual.email ?? undefined,
    };

    // password:
    if (this.actual.password && this.actual.password.trim().length > 0) {
      base.password = this.actual.password.trim();
    }

    return base;
  }

  override abrirModal(nuevo = true, item?: Usuario): void {
    this.modoEdicion = !nuevo;

    if (nuevo) {
      this.actual = {
        id: 0,
        username: '',
        rol: 'alumno',
        personaId: 0,
        nombre: '',
        apellidos: '',
        email: null,
        password: '',
      };
    } else if (item) {
      this.actual = {
        ...item,
        password: '',
      };
    }

    if (this.formUsuario) {
      this.formUsuario.resetForm(this.actual);
    }

    this.modal.open();
  }

  override guardar(): void {
    if (!this.formUsuario?.valid) {
      this.formUsuario.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    if (!this.modoEdicion) {
      if (!payload.password || payload.password.trim().length === 0) {
        alert('La contraseña es obligatoria al crear un usuario');
        return;
      }
      this.usuariosSrv.createUsuario(payload);
    } else {
      this.usuariosSrv.updateUsuario(this.actual.id, payload);
    }

    this.modal.close();
    this.actual.password = '';
  }

  override eliminar(id: number): void {
    if (!confirm(this.getDeleteConfirmMessage())) return;

    const current = this.auth.currentUser();
    if (current && current.id === id) {
      alert('No puedes eliminar tu propio usuario mientras estás logueado.');
      return;
    }

    this.usuariosSrv.deleteUsuario(id);
  }
}
