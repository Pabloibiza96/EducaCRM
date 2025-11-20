import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AlumnosService,
  Alumno,
  AlumnoPayload,
} from '../../../core/services/alumnos.service';

import {
  CrudTableComponent,
  TableColumn,
  ActionButton,
} from '../../../shared/components/crud-table/crud-table.component';

import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { RoleService } from '../../../core/auth/role.service';

@Component({
  standalone: true,
  selector: 'app-alumnos-list',
  imports: [
    CommonModule,
    FormsModule,
    CrudTableComponent,
    GenericModalComponent,
  ],
  templateUrl: './alumnos-list.html',
})
export class AlumnosListComponent extends BaseCrudListComponent<Alumno> {
  @ViewChild('modalAlumno') modalAlumno!: GenericModalComponent;
  @ViewChild('formAlumno') formAlumno!: NgForm;

  constructor(
    public alumnosSrv: AlumnosService,
    public roleService: RoleService,
    private router: Router
  ) {
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

  /** El modal usado por la clase base */
  protected get modal(): GenericModalComponent {
    return this.modalAlumno;
  }

  override ngOnInit(): void {
    this.alumnosSrv.load();
  }

  // Columnas
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
      icon: 'eye',
      btnClass: 'btn-sm btn-outline-secondary',
      tooltip: 'Ver detalle del alumno',
      onClick: (alumno) => {
        this.router.navigate(['/alumnos', alumno.id]);
      },
    },
    {
      icon: 'bar-chart',
      btnClass: 'btn-sm btn-outline-dark',
      tooltip: 'Ver resumen de notas',
      onClick: (alumno) => {
        if (this.roleService.hasRole('administrador', 'direccion', 'jefatura')) {
          this.router.navigate(['/reportes/alumnos', alumno.id, 'resumen']);
        }
      },
    },
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar alumno',
      onClick: (alumno) => this.abrirModal(false, alumno),
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar alumno',
      onClick: (alumno) => this.eliminar(alumno.id),
    },
  ];

  /** Campos usados para el buscador */
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

  /** Mapea el formulario al payload */
  private buildPayload(): AlumnoPayload {
    return {
      nombre: this.actual.nombre,
      apellidos: this.actual.apellidos,
      email: this.actual.email ?? undefined,
      grupo: this.actual.grupo ?? undefined,
    };
  }

  override abrirModal(nuevo = true, item?: Alumno): void {
    this.modoEdicion = !nuevo;

    if (nuevo) {
      this.actual = {
        id: 0,
        nia: '',
        fechaAlta: null,
        nombre: '',
        apellidos: '',
        email: null,
        grupo: null,
      };
    } else if (item) {
      this.actual = { ...item };
    }

    if (this.formAlumno) {
      this.formAlumno.resetForm(this.actual);
    }

    this.modal.open();
  }

  override guardar(): void {
    if (this.formAlumno && !this.formAlumno.valid) {
      this.formAlumno.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    if (this.modoEdicion) {
      this.alumnosSrv.updateAlumno(this.actual.id, payload);
    } else {
      this.alumnosSrv.createAlumno(payload);
    }

    this.modal.close();
  }

  override eliminar(id: number): void {
    if (!confirm(this.getDeleteConfirmMessage())) return;
    this.alumnosSrv.deleteAlumno(id);
  }
}