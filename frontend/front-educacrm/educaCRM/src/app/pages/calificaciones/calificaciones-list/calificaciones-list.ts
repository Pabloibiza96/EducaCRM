import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  CalificacionesService,
  Calificacion,
  CalificacionPayload,
  Evaluacion,
} from '../../../core/services/calificaciones.service';
import { AlumnosService } from '../../../core/services/alumnos.service';
import { AsignaturasService } from '../../../core/services/asignaturas.service';

import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import {
  CrudTableComponent,
  TableColumn,
  ActionButton,
} from '../../../shared/components/crud-table/crud-table.component';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { RoleService } from '../../../core/auth/role.service';

@Component({
  standalone: true,
  selector: 'app-calificaciones-list',
  imports: [
    CommonModule,
    FormsModule,
    GenericModalComponent,
    CrudTableComponent,
  ],
  templateUrl: './calificaciones-list.html',
})
export class CalificacionesListComponent extends BaseCrudListComponent<Calificacion> {
  @ViewChild('modalCalificacion') modalCalificacion!: GenericModalComponent;

  get soloLectura(): boolean {
    return (
      !this.roleService.canCreate('calificaciones') &&
      !this.roleService.canEdit('calificaciones') &&
      !this.roleService.canDelete('calificaciones')
    );
  }

  protected get modal(): GenericModalComponent {
    return this.modalCalificacion;
  }

  evaluaciones: Evaluacion[] = ['1ª', '2ª', '3ª', 'Final'];

  columns: TableColumn<Calificacion>[] = [
    { key: 'id', header: 'ID', width: '60px' },
    { key: 'alumnoNombre', header: 'Alumno' },
    { key: 'asignaturaNombre', header: 'Asignatura' },
    { key: 'evaluacion', header: 'Evaluación', width: '100px' },
    {
      header: 'Nota',
      width: '80px',
      valueGetter: (c) => (c.nota != null ? c.nota.toFixed(2) : '—'),
    },
  ];

  actions: ActionButton<Calificacion>[];

  constructor(
    public calificacionesSrv: CalificacionesService,
    public alumnosSrv: AlumnosService,
    public asignaturasSrv: AsignaturasService,
    public roleService: RoleService
  ) {
    super(calificacionesSrv, {
      id: 0,
      alumnoId: 0,
      asignaturaId: 0,
      alumnoNombre: '',
      asignaturaNombre: '',
      evaluacion: '1ª',
      nota: null,
      fecha: null,
    });

    this.actions = this.buildActions();
  }

  override ngOnInit(): void {
    this.calificacionesSrv.load();
    if (!this.roleService.isAlumno()) {
      this.alumnosSrv.load();
      this.asignaturasSrv.load();
    }
  }

  private buildActions(): ActionButton<Calificacion>[] {
    const actions: ActionButton<Calificacion>[] = [];

    if (this.roleService.canEdit('calificaciones')) {
      actions.push({
        icon: 'pencil',
        btnClass: 'btn-sm btn-outline-primary',
        tooltip: 'Editar',
        onClick: (c) => this.abrirModal(false, c),
      });
    }

    if (this.roleService.canDelete('calificaciones')) {
      actions.push({
        icon: 'trash',
        btnClass: 'btn-sm btn-outline-danger',
        tooltip: 'Eliminar',
        onClick: (c) => this.eliminar(c.id),
      });
    }

    return actions;
  }

  protected override getSearchFields(c: Calificacion): string[] {
    return [
      c.alumnoNombre ?? '',
      c.asignaturaNombre ?? '',
      c.evaluacion ?? '',
      c.nota != null ? c.nota.toString() : '',
    ];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar calificación?';
  }

  /** Mapea los datos del formulario al payload de la API */
  private buildPayload(): CalificacionPayload {
    const notaNum =
      this.actual.nota !== null && this.actual.nota !== undefined
        ? Number(this.actual.nota)
        : null;

    return {
      alumnoId: this.actual.alumnoId,
      asignaturaId: this.actual.asignaturaId,
      evaluacion: this.actual.evaluacion,
      nota: notaNum,
      fecha: this.actual.fecha,
    };
  }

  override guardar(): void {
    if (
      (this.modoEdicion && !this.roleService.canEdit('calificaciones')) ||
      (!this.modoEdicion && !this.roleService.canCreate('calificaciones'))
    ) {
      return;
    }

    const payload = this.buildPayload();

    if (this.modoEdicion) {
      this.calificacionesSrv.updateCalificacion(this.actual.id, payload);
    } else {
      this.calificacionesSrv.createCalificacion(payload);
    }

    this.modalCalificacion.close();
  }

  override eliminar(id: number): void {
    if (!this.roleService.canDelete('calificaciones')) return;
    if (!confirm(this.getDeleteConfirmMessage())) return;
    this.calificacionesSrv.deleteCalificacion(id);
  }

  override abrirModal(nuevo = true, item?: Calificacion): void {
    if (
      (nuevo && !this.roleService.canCreate('calificaciones')) ||
      (!nuevo && !this.roleService.canEdit('calificaciones'))
    ) {
      return;
    }

    this.modoEdicion = !nuevo;
    if (nuevo) {
      this.actual = { ...this.emptyEntity };
    } else if (item) {
      this.actual = { ...item };
    }
    this.modal.open();
  }
}
