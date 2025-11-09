import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsignaturasService, Asignatura } from '../../../core/services/asignaturas.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { CrudTableComponent, TableColumn, ActionButton } from '../../../shared/components/crud-table/crud-table.component';
import { RoleService } from '../../../core/auth/role.service';

@Component({
  selector: 'app-asignaturas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericModalComponent, CrudTableComponent],
  templateUrl: './asignaturas-list.html',
})
export class AsignaturasListComponent extends BaseCrudListComponent<Asignatura> {
  @ViewChild('modalAsignatura') modalAsignatura!: GenericModalComponent;

  protected get modal(): GenericModalComponent {
    return this.modalAsignatura;
  }

  columns: TableColumn<Asignatura>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'codigo', header: 'Código', width: '120px' },
    { key: 'nombre', header: 'Asignatura' },
    { key: 'curso', header: 'Curso' },
    { 
      key: 'profesor',
      header: 'Profesor',
      formatter: (val) => val || '—'
    }
  ];

  actions: ActionButton<Asignatura>[] = [
    {
      label: 'Editar',
      btnClass: 'btn-sm btn-outline-primary',
      onClick: (a) => this.editar(a),
      hidden: () => !this.roleService.canEdit('asignaturas')
    },
    {
      label: 'Eliminar',
      btnClass: 'btn-sm btn-outline-danger',
      onClick: (a) => this.eliminar(a.id),
      hidden: () => !this.roleService.canDelete('asignaturas')
    }
  ];

  constructor(
    public asignaturasService: AsignaturasService,
    public roleService: RoleService
  ) {
    super(asignaturasService, { id: 0, nombre: '', codigo: '', curso: '', profesor: '' });
  }

  override ngOnInit(): void {
    this.asignaturasService.loadMock();
  }

  protected override getSearchFields(asignatura: Asignatura): string[] {
    return [
      asignatura.nombre,
      asignatura.codigo,
      asignatura.curso,
      asignatura.profesor || ''
    ];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar esta asignatura?';
  }
}
