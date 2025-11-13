import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AlumnosService, Alumno } from '../../../core/services/alumnos.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { CrudTableComponent, TableColumn, ActionButton } from '../../../shared/components/crud-table/crud-table.component';
import { RoleService } from '../../../core/auth/role.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-alumnos-list',
  imports: [CommonModule, FormsModule, GenericModalComponent, CrudTableComponent],
  templateUrl: './alumnos-list.html',
})
export class AlumnosListComponent extends BaseCrudListComponent<Alumno> {
  @ViewChild('modalAlumno') modalAlumno!: GenericModalComponent;
  @ViewChild('formAlumno') formAlumno!: NgForm;

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
    public roleService: RoleService,
    private notifications: NotificationService
  ) {
    super(alumnosSrv, { id: 0, nombre: '', apellidos: '', email: '', grupo: '' });
  }

  override ngOnInit(): void {
    this.alumnosSrv.load();
  }

  override guardar(): void {
    // Validar formulario antes de guardar
    if (this.formAlumno && this.formAlumno.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.formAlumno.controls).forEach(key => {
        this.formAlumno.controls[key].markAsTouched();
      });
      this.notifications.warning('Por favor, completa todos los campos requeridos correctamente');
      return;
    }

    // Validación adicional de datos
    if (!this.actual.nombre?.trim()) {
      this.notifications.error('El nombre es requerido');
      return;
    }
    if (!this.actual.apellidos?.trim()) {
      this.notifications.error('Los apellidos son requeridos');
      return;
    }
    if (!this.actual.email?.trim()) {
      this.notifications.error('El email es requerido');
      return;
    }

    // Llamar al método padre para guardar
    super.guardar();
    this.notifications.success(this.modoEdicion ? 'Alumno actualizado correctamente' : 'Alumno creado correctamente');
  }

  protected override getSearchFields(alumno: Alumno): string[] {
    return [alumno.nombre, alumno.apellidos, alumno.email, alumno.grupo];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar alumno?';
  }
}
