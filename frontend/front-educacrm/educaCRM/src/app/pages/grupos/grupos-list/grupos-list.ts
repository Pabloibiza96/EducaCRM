import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  GruposService,
  Grupo,
  GrupoPayload,
} from '../../../core/services/grupos.service';
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
  selector: 'app-grupos-list',
  imports: [
    CommonModule,
    FormsModule,
    GenericModalComponent,
    CrudTableComponent,
  ],
  templateUrl: './grupos-list.html',
})
export class GruposListComponent extends BaseCrudListComponent<Grupo> {
  @ViewChild('modalGrupo') modalGrupo!: GenericModalComponent;

  protected get modal(): GenericModalComponent {
    return this.modalGrupo;
  }

  columns: TableColumn<Grupo>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'nombre', header: 'Nombre del grupo' },
    { key: 'curso', header: 'Curso' },
  ];

  actions: ActionButton<Grupo>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar',
      onClick: (grupo) => this.abrirModal(false, grupo),
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar',
      onClick: (grupo) => this.eliminar(grupo.id),
    },
  ];

  constructor(
    public gruposSrv: GruposService,
    public roleService: RoleService
  ) {
    super(gruposSrv, {
      id: 0,
      nombre: '',
      curso: '',
    });
  }

  override ngOnInit(): void {
    this.gruposSrv.load();
  }

  protected override getSearchFields(g: Grupo): string[] {
    return [g.nombre, g.curso];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar grupo?';
  }

  private buildPayload(): GrupoPayload {
    return {
      nombre: this.actual.nombre,
      curso: this.actual.curso,
    };
  }

  override guardar(): void {
    const payload = this.buildPayload();

    if (this.modoEdicion) {
      this.gruposSrv.updateGrupo(this.actual.id, payload);
    } else {
      this.gruposSrv.createGrupo(payload);
    }

    this.modalGrupo.close();
  }

  override eliminar(id: number): void {
    if (!confirm(this.getDeleteConfirmMessage())) return;
    this.gruposSrv.deleteGrupo(id);
  }
}
