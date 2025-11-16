import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DepartamentosService, Departamento, DepartamentoPayload } from '../../../core/services/departamentos.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { CrudTableComponent, TableColumn, ActionButton } from '../../../shared/components/crud-table/crud-table.component';
import { RoleService } from '../../../core/auth/role.service';

@Component({
  selector: 'app-departamentos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericModalComponent, CrudTableComponent],
  templateUrl: './departamentos-list.html'
})
export class DepartamentosListComponent extends BaseCrudListComponent<Departamento> {
  @ViewChild('modalDept') modalDept!: GenericModalComponent;

  protected get modal(): GenericModalComponent {
    return this.modalDept;
  }

  columns: TableColumn<Departamento>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'nombre', header: 'Nombre' }
  ];

  actions: ActionButton<Departamento>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar',
      onClick: (d) => this.abrirModal(false, d)
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar',
      onClick: (d) => this.eliminar(d.id)
    }
  ];

  constructor(
    public departamentosService: DepartamentosService,
    public roleService: RoleService
  ) {
    super(departamentosService, {
      id: 0,
      nombre: '',
    });
  }

  override ngOnInit(): void {
    this.departamentosService.load();
  }

  protected override getSearchFields(d: Departamento): string[] {
    return [d.nombre];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar departamento?';
  }

  private buildPayload(): DepartamentoPayload {
    return { nombre: this.actual.nombre };
  }

  override guardar(): void {
    const payload = this.buildPayload();

    if (this.modoEdicion) {
      this.departamentosService.updateDepartamento(this.actual.id, payload);
    } else {
      this.departamentosService.createDepartamento(payload);
    }

    this.modalDept.close();
  }

  override eliminar(id: number): void {
    if (!confirm(this.getDeleteConfirmMessage())) return;
    this.departamentosService.deleteDepartamento(id);
  }
}