import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GruposService, Grupo } from '../../../core/services/grupos.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { CrudTableComponent, TableColumn, ActionButton } from '../../../shared/components/crud-table/crud-table.component';

@Component({
  standalone: true,
  selector: 'app-grupos-list',
  imports: [CommonModule, FormsModule, GenericModalComponent, CrudTableComponent],
  templateUrl: './grupos-list.html',
})
export class GruposListComponent extends BaseCrudListComponent<Grupo> {
  @ViewChild('modalGrupo') modalGrupo!: GenericModalComponent;

  protected get modal(): GenericModalComponent {
    return this.modalGrupo;
  }

  columns: TableColumn<Grupo>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'curso', header: 'Curso' },
    { key: 'tutor', header: 'Tutor' },
    { 
      key: 'numAlumnos',
      header: 'Nº Alumnos',
      width: '120px',
      cellClass: 'text-center'
    }
  ];

  actions: ActionButton<Grupo>[] = [
    {
      label: 'Editar',
      btnClass: 'btn-sm btn-outline-primary',
      onClick: (g) => this.editar(g)
    },
    {
      label: 'Eliminar',
      btnClass: 'btn-sm btn-outline-danger',
      onClick: (g) => this.eliminar(g.id)
    }
  ];

  constructor(public srv: GruposService) {
    super(srv, { id: 0, nombre: '', curso: '', tutor: '', numAlumnos: 0 });
  }

  override ngOnInit(): void {
    this.srv.loadMock();
  }

  get grupos() {
    return () => this.srv.items();
  }

  protected override getSearchFields(grupo: Grupo): string[] {
    return [grupo.nombre, grupo.curso, grupo.tutor];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar grupo?';
  }
}
