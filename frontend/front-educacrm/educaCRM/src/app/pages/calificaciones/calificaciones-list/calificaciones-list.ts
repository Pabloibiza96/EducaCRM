import { Component, computed, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CalificacionesService,
  Calificacion,
} from '../../../core/services/calificaciones.service';
import { AlumnosService } from '../../../core/services/alumnos.service';
import { AsignaturasService } from '../../../core/services/asignaturas.service';
import { GenericModalComponent } from '../../../shared/components/generic-modal/generic-modal';
import { BaseCrudListComponent } from '../../../shared/components/base-crud-list/base-crud-list.component';
import { CrudTableComponent, TableColumn, ActionButton } from '../../../shared/components/crud-table/crud-table.component';
import { RoleService } from '../../../core/auth/role.service';
import { AuthService } from '../../../core/auth/auth.service';

interface CalificacionView extends Calificacion {
  alumnoNombre: string;
  asignaturaNombre: string;
}

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
  @ViewChild('evaluacionBadgeTpl', { static: true }) evaluacionBadgeTpl!: TemplateRef<any>;
  @ViewChild('notaTpl', { static: true }) notaTpl!: TemplateRef<any>;

  protected get modal(): GenericModalComponent {
    return this.modalCalificacion;
  }

  evaluaciones = ['1ª', '2ª', '3ª', 'Extraordinaria'];

  view = computed(() => {
    const cals = this.filtrados() as Calificacion[];
    const user = this.authService.currentUser();
    
    // Si es alumno, filtrar solo sus calificaciones
    const filteredCals = this.roleService.isAlumno() 
      ? cals.filter(c => c.alumnoId === user?.id)
      : cals;  // Otros roles ven todas
    
    const alumnos = this.alumnosService.items();
    const asignaturas = this.asignaturasService.items();

    return filteredCals.map((c): CalificacionView => {
      const al = alumnos.find((a) => a.id === c.alumnoId);
      const as = asignaturas.find((x) => x.id === c.asignaturaId);
      return {
        ...c,
        alumnoNombre: al ? `${al.nombre} ${al.apellidos}` : '—',
        asignaturaNombre: as ? as.nombre : '—',
      };
    });
  });

  columns!: TableColumn<CalificacionView>[];

  actions: ActionButton<CalificacionView>[] = [
    {
      icon: 'pencil',
      btnClass: 'btn-sm btn-outline-primary',
      onClick: (c) => this.editar(c),
      hidden: () => !this.roleService.canEdit('calificaciones')
    },
    {
      icon: 'trash',
      btnClass: 'btn-sm btn-outline-danger',
      onClick: (c) => this.eliminar(c.id),
      hidden: () => !this.roleService.canDelete('calificaciones')
    }
  ];

  constructor(
    public srv: CalificacionesService,
    public alumnosService: AlumnosService,
    public asignaturasService: AsignaturasService,
    public roleService: RoleService,
    private authService: AuthService
  ) {
    super(srv, {
      id: 0,
      alumnoId: 0,
      asignaturaId: 0,
      evaluacion: '1ª',
      nota: 5,
    });
  }

  override ngOnInit(): void {
    // Cargar datos de forma coordinada para evitar race conditions
    this.srv.loadWithDependencies().subscribe({
      next: ({ alumnos, asignaturas, calificaciones }) => {
        this.alumnosService.setAll(alumnos as any);
        this.asignaturasService.setAll(asignaturas as any);
        this.srv.setAll(calificaciones);
      }
    });
    
    this.columns = [
      { 
        key: 'alumnoNombre',
        header: 'Alumno'
      },
      { 
        key: 'asignaturaNombre',
        header: 'Asignatura'
      },
      {
        key: 'evaluacion',
        header: 'Evaluación',
        template: this.evaluacionBadgeTpl
      },
      {
        key: 'nota',
        header: 'Nota',
        template: this.notaTpl
      }
    ];
  }

  protected override getSearchFields(cal: Calificacion): string[] {
    const alumnos = this.alumnosService.items();
    const asignaturas = this.asignaturasService.items();
    const al = alumnos.find((a) => a.id === cal.alumnoId);
    const as = asignaturas.find((x) => x.id === cal.asignaturaId);
    return [
      al ? al.nombre : '',
      al ? al.apellidos : '',
      as ? as.nombre : '',
      cal.evaluacion,
      cal.nota.toString(),
    ];
  }

  protected override getDeleteConfirmMessage(): string {
    return '¿Eliminar calificación?';
  }

  getEvaluacionBadgeClass(evaluacion: string): string {
    const classes: Record<string, string> = {
      '1ª': 'bg-primary',
      '2ª': 'bg-info',
      '3ª': 'bg-warning',
      'Extraordinaria': 'bg-dark'
    };
    return classes[evaluacion] || 'bg-secondary';
  }
}
