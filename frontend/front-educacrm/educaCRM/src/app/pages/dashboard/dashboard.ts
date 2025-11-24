import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Role } from '../../core/auth/auth.service';
import { RoleService } from '../../core/auth/role.service';

type StatCard = { title: string; desc: string; link: string; roles: Role[] };

const ALL_CARDS: StatCard[] = [
  { title: 'Alumnos',       desc: 'Gestión de alumnos y matrículas.',           link: '/alumnos',        roles: ['administrador', 'jefatura'] },
  { title: 'Profesores',    desc: 'Asignación de profesores a grupos.',         link: '/profesores',     roles: ['administrador', 'jefatura', 'direccion'] },
  { title: 'Grupos',        desc: 'Cursos, clases y relaciones.',               link: '/grupos',         roles: ['profesor', 'jefatura', 'direccion', 'administrador'] },
  { title: 'Asignaturas',   desc: 'Materias impartidas por curso.',             link: '/asignaturas',    roles: ['jefatura', 'direccion', 'administrador'] },
  { title: 'Calificaciones',desc: 'Notas por asignatura y evaluación.',         link: '/calificaciones', roles: ['alumno', 'profesor', 'jefatura', 'direccion', 'administrador'] },
  { title: 'Admin',         desc: 'Usuarios y permisos (solo roles altos).',    link: '/admin',          roles: ['administrador'] },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  // Tarjetas filtradas según rol del usuario
  cards = signal<StatCard[]>([]);

  // Ejemplo de métricas (mock) por si quieres mostrarlas luego
  totalAlumnos   = signal<number>(0);
  totalProfes    = signal<number>(0);
  totalGrupos    = signal<number>(0);

  // Método de ejemplo para refrescar métricas (lo conectaremos a la API)
  refreshStats(): void {
    // TODO: sustituir por llamadas HttpClient a la API
    this.totalAlumnos.set(120);
    this.totalProfes.set(18);
    this.totalGrupos.set(12);
  }

  constructor(private roleService: RoleService) {
    // Mostramos solo las tarjetas que el rol puede ver
    this.cards.set(
      ALL_CARDS.filter((c) => this.roleService.hasRole(...c.roles))
    );
  }
}
