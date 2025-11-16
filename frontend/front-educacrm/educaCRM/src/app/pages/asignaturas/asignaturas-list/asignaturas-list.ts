import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AsignaturasService,
  Asignatura,
  AsignaturaPayload,
} from '../../../core/services/asignaturas.service';
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
  selector: 'app-asignaturas-list',
  imports: [
    CommonModule,
    FormsModule,
    GenericModalComponent,
    CrudTableComponent,
  ],
  templateUrl: './asignaturas-list.html',
})
export class AsignaturasListComponent extends BaseCrudListComponent<Asignatura> {
  @ViewChild('modalAsignatura') modalAsignatura!: GenericModalComponent;

  protected get modal(): GenericModalComponent {
    return this.modalAsignatura;
  }

  // Columnas de la tabla
  columns: TableColumn<Asignatura>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'codigo', header: 'Código' },
    { key: 'curso', header: 'Curso' },
  ];

  // Botones de acción
  actions: ActionButton<Asignatura>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar',
      onClick: (asig) => this.abrirModal(false, asig),
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar',
      onClick: (asig) => this.eliminar(asig.id),
    },
  ];

  constructor(
    public asignaturasSrv: AsignaturasService,
    public roleService: RoleService
  ) {
    super(asignaturasSrv, {
      id: 0,
      nombre: '',
      codigo: '',
      curso: null,
    });
  }

  override ngOnInit(): void {
    this.asignaturasSrv.load();
  }

  protected override getSearchFields(a: Asignatura): string[] {
    return [a.nombre ?? '', a.codigo ?? '', a.curso ?? ''];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar asignatura?';
  }

  /** Construye el payload que espera la API */
  private buildPayload(): AsignaturaPayload {
    return {
      nombre: this.actual.nombre,
      codigo: this.actual.codigo,
      curso: this.actual.curso,
    };
  }

  override guardar(): void {
    const payload = this.buildPayload();

    if (this.modoEdicion) {
      this.asignaturasSrv.updateAsignatura(this.actual.id, payload);
    } else {
      this.asignaturasSrv.createAsignatura(payload);
    }

    this.modalAsignatura.close();
  }

  override eliminar(id: number): void {
    if (!confirm(this.getDeleteConfirmMessage())) return;
    this.asignaturasSrv.deleteAsignatura(id);
  }
}
