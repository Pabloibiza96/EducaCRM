import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnosService, Alumno } from '../../../core/services/alumnos.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { CrudTableComponent, TableColumn, ActionButton } from '../../../shared/components/crud-table/crud-table.component';
import { RoleService } from '../../../core/auth/role.service';

@Component({
  standalone: true,
  selector: 'app-alumnos-list',
  imports: [CommonModule, FormsModule, GenericModalComponent, CrudTableComponent],
  templateUrl: './alumnos-list.html',
})
export class AlumnosListComponent extends BaseCrudListComponent<Alumno> {
  @ViewChild('modalAlumno') modalAlumno!: GenericModalComponent;

  protected get modal(): GenericModalComponent {
    return this.modalAlumno;
  }

  // Configuración de columnas
  columns: TableColumn<Alumno>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'apellidos', header: 'Apellidos' },
    { key: 'email', header: 'Email' },
    { key: 'grupo', header: 'Grupo' }
  ];

  // Configuración de acciones con permisos
  actions: ActionButton<Alumno>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar',
      onClick: (alumno) => this.abrirModal(false, alumno),
      hidden: () => !this.roleService.canEdit('alumnos')
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar',
      onClick: (alumno) => this.eliminar(alumno.id),
      hidden: () => !this.roleService.canDelete('alumnos')
    }
  ];

  constructor(
    public alumnosSrv: AlumnosService,
    public roleService: RoleService
  ) {
    super(alumnosSrv, { id: 0, nombre: '', apellidos: '', email: '', grupo: '' });
  }

  override ngOnInit(): void {
    this.alumnosSrv.loadMock();
  }

  protected override getSearchFields(alumno: Alumno): string[] {
    return [alumno.nombre, alumno.apellidos, alumno.email, alumno.grupo];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar alumno?';
  }
}
