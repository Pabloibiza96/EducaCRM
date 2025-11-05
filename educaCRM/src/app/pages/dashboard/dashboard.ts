import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type StatCard = { title: string; desc: string; link: string; };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  // Enlaza las tarjetas del panel con sus rutas
  cards = signal<StatCard[]>([
    { title: 'Alumnos',       desc: 'Gestión de alumnos y matrículas.',           link: '/alumnos' },
    { title: 'Profesores',    desc: 'Asignación de profesores a grupos.',         link: '/profesores' },
    { title: 'Grupos',        desc: 'Cursos, clases y relaciones.',               link: '/grupos' },
    { title: 'Asignaturas',   desc: 'Materias impartidas por curso.',             link: '/asignaturas' },
    { title: 'Calificaciones',desc: 'Notas por asignatura y evaluación.',         link: '/calificaciones' },
    { title: 'Admin',         desc: 'Usuarios y permisos (solo roles altos).',    link: '/admin' },
  ]);

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

  constructor() {
    // Carga inicial (opcional)
    // this.refreshStats();
  }
}