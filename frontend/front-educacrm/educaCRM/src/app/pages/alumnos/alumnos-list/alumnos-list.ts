import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlumnosService, Alumno, AlumnoPayload } from '../../../core/services/alumnos.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import {
  CrudTableComponent,
  TableColumn,
  ActionButton,
} from '../../../shared/components/crud-table/crud-table.component';
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

  // Columnas de la tabla
  columns: TableColumn<Alumno>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'apellidos', header: 'Apellidos' },
    { key: 'email', header: 'Email' },
    { key: 'grupo', header: 'Grupo' },
  ];

  // Botones de acción
  actions: ActionButton<Alumno>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar',
      onClick: (alumno) => this.abrirModal(false, alumno),
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar',
      onClick: (alumno) => this.eliminar(alumno.id),
    },
  ];

  constructor(
    public alumnosSrv: AlumnosService,
    public roleService: RoleService
  ) {
    // Estado inicial del formulario
    super(alumnosSrv, {
      id: 0,
      nia: '',
      fechaAlta: null,
      nombre: '',
      apellidos: '',
      email: null,
      grupo: null,
    });
  }

  override ngOnInit(): void {
    this.alumnosSrv.load();
  }

  // Campos usados para el buscador
  protected override getSearchFields(a: Alumno): string[] {
    return [
      a.nombre ?? '',
      a.apellidos ?? '',
      a.email ?? '',
      a.grupo ?? '',
    ];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar alumno?';
  }

  /** Mapea el modelo del formulario al payload que espera la API */
  private buildPayload(): AlumnoPayload {
    return {
      nombre: this.actual.nombre,
      apellidos: this.actual.apellidos,
      email: this.actual.email,
      grupo: this.actual.grupo,
    };
  }

  /** Sobrescribimos guardar() para usar la API real */
  override guardar(): void {
    const payload = this.buildPayload();

    if (this.modoEdicion) {
      // Editar existente → PUT
      this.alumnosSrv.updateAlumno(this.actual.id, payload);
    } else {
      // Crear nuevo → POST
      this.alumnosSrv.createAlumno(payload);
    }

    this.modalAlumno.close();
  }

  /** Sobrescribimos eliminar() para usar la API real */
  override eliminar(id: number): void {
    if (!confirm(this.getDeleteConfirmMessage())) return;
    this.alumnosSrv.deleteAlumno(id);
  }
}