import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfesoresService, Profesor } from '../../../core/services/profesores.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { CrudTableComponent, TableColumn, ActionButton } from '../../../shared/components/crud-table/crud-table.component';
import { RoleService } from '../../../core/auth/role.service';

@Component({
  selector: 'app-profesores-list',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericModalComponent, CrudTableComponent],
  templateUrl: './profesores-list.html',
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
    { 
      key: 'asignaturas',
      header: 'Asignaturas',
      formatter: (val) => val || '—'
    }
  ];

  actions: ActionButton<Profesor>[] = [
    {
      label: 'Editar',
      btnClass: 'btn-sm btn-outline-primary',
      onClick: (p) => this.editar(p),
      hidden: () => !this.roleService.canEdit('profesores')
    },
    {
      label: 'Eliminar',
      btnClass: 'btn-sm btn-outline-danger',
      onClick: (p) => this.eliminar(p.id),
      hidden: () => !this.roleService.canDelete('profesores')
    }
  ];

  constructor(
    public profesoresService: ProfesoresService,
    public roleService: RoleService
  ) {
    super(profesoresService, { id: 0, nombre: '', apellidos: '', email: '', departamento: '', asignaturas: '' });
  }

  override ngOnInit(): void {
    this.profesoresService.loadMock();
  }

  protected override getSearchFields(profesor: Profesor): string[] {
    return [
      profesor.nombre,
      profesor.apellidos,
      profesor.email,
      profesor.departamento,
      profesor.asignaturas || ''
    ];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar profesor?';
  }
}
