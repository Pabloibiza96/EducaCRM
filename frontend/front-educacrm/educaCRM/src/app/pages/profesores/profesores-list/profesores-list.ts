import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfesoresService, Profesor, ProfesorPayload } from '../../../core/services/profesores.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { CrudTableComponent, TableColumn, ActionButton } from '../../../shared/components/crud-table/crud-table.component';
import { RoleService } from '../../../core/auth/role.service';

@Component({
  selector: 'app-profesores-list',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericModalComponent, CrudTableComponent],
  templateUrl: './profesores-list.html'
})
export class ProfesoresListComponent extends BaseCrudListComponent<Profesor> {
  @ViewChild('modalProfesor') modalProfesor!: GenericModalComponent;

  protected get modal(): GenericModalComponent {
    return this.modalProfesor;
  }

  columns: TableColumn<Profesor>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { 
      header: 'Nombre',
      valueGetter: (p) => `${p.nombre} ${p.apellidos}`
    },
    { key: 'departamento', header: 'Departamento' },
    { key: 'email', header: 'Email' },
  ];

  actions: ActionButton<Profesor>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      tooltip: 'Editar',
      onClick: (p) => this.abrirModal(false, p)
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      tooltip: 'Eliminar',
      onClick: (p) => this.eliminar(p.id)
    }
  ];

  constructor(
    public profesoresService: ProfesoresService,
    public roleService: RoleService
  ) {
    super(profesoresService, {
      id: 0,
      nombre: '',
      apellidos: '',
      email: null,
      departamento: null,
    });
  }

  override ngOnInit(): void {
    this.profesoresService.load();
  }

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

  private buildPayload(): ProfesorPayload {
    return {
      nombre: this.actual.nombre,
      apellidos: this.actual.apellidos,
      email: this.actual.email,
      departamento: this.actual.departamento,
    };
  }

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
}