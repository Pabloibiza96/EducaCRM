import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ProfesoresService,
  Profesor,
  ProfesorPayload,
} from '../../../core/services/profesores.service';
import {
  DepartamentosService,
  Departamento,
} from '../../../core/services/departamentos.service';

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
  selector: 'app-profesores-list',
  imports: [
    CommonModule,
    FormsModule,
    GenericModalComponent,
    CrudTableComponent,
  ],
  templateUrl: './profesores-list.html',
})
export class ProfesoresListComponent extends BaseCrudListComponent<Profesor> {
  @ViewChild('modalProfesor') modalProfesor!: GenericModalComponent;

  protected get modal(): GenericModalComponent {
    return this.modalProfesor;
  }

  get departamentos(): Departamento[] {
    return this.deptSrv.items();
  }

  // Columnas de la tabla
  columns: TableColumn<Profesor>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    {
      header: 'Nombre',
      valueGetter: (p) => `${p.nombre} ${p.apellidos}`,
    },
    { key: 'departamento', header: 'Departamento' },
    { key: 'email', header: 'Email' },
  ];

  // Botones de acción
  actions: ActionButton<Profesor>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar',
      onClick: (p) => this.abrirModal(false, p),
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar',
      onClick: (p) => this.eliminar(p.id),
    },
  ];

  constructor(
    public profesoresService: ProfesoresService,
    private deptSrv: DepartamentosService,
    public roleService: RoleService
  ) {
    super(profesoresService, {
      id: 0,
      nombre: '',
      apellidos: '',
      email: '',
      departamento: null,
      departamentoId: null,
    });
  }

  override ngOnInit(): void {
    this.profesoresService.load();
    this.deptSrv.load();
  }

  // Campos usados para el buscador
  protected override getSearchFields(p: Profesor): string[] {
    return [
      p.nombre ?? '',
      p.apellidos ?? '',
      p.email ?? '',
      p.departamento ?? '',
    ];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar profesor?';
  }

  /** Mapea el modelo del formulario al payload que espera la API */
  private buildPayload(): ProfesorPayload {
    return {
      nombre: this.actual.nombre,
      apellidos: this.actual.apellidos,
      email: this.actual.email,
      departamentoId: this.actual.departamentoId ?? null,
    };
  }

  /** Guardar usando la API real (igual que en alumnos-list) */
  override guardar(): void {
    const payload = this.buildPayload();

    if (this.modoEdicion) {
      this.profesoresService.updateProfesor(this.actual.id, payload);
    } else {
      this.profesoresService.createProfesor(payload);
    }

    this.modalProfesor.close();
  }

  override eliminar(id: number): void {
    if (!confirm(this.getDeleteConfirmMessage())) return;
    this.profesoresService.deleteProfesor(id);
  }

  override abrirModal(nuevo: boolean, item?: Profesor | null): void {
    super.abrirModal(nuevo, item);

    if (!nuevo && item) {
      this.actual.departamentoId =
        (item as any).departamentoId ?? this.actual.departamentoId ?? null;
    } else {
      this.actual.departamentoId = null;
    }
  }
}
