import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    children: [
      { path: '', component: DashboardComponent, title: 'Inicio | EducaCRM' },

      // Lazy-load de componentes standalone
      { path: 'alumnos', loadComponent: () => import('./pages/alumnos/alumnos-list/alumnos-list').then(m => m.AlumnosListComponent), title: 'Alumnos | EducaCRM' },
      { path: 'profesores', loadComponent: () => import('./pages/profesores/profesores-list/profesores-list').then(m => m.ProfesoresListComponent), title: 'Profesores | EducaCRM' },
      { path: 'grupos', loadComponent: () => import('./pages/grupos/grupos-list/grupos-list').then(m => m.GruposListComponent), title: 'Grupos | EducaCRM' },
      { path: 'asignaturas', loadComponent: () => import('./pages/asignaturas/asignaturas-list/asignaturas-list').then(m => m.AsignaturasListComponent), title: 'Asignaturas | EducaCRM' },
      { path: 'calificaciones', loadComponent: () => import('./pages/calificaciones/calificaciones-list/calificaciones-list').then(m => m.CalificacionesListComponent), title: 'Calificaciones | EducaCRM' },

      // Admin (luego aplicaremos guards)
      { path: 'admin', loadComponent: () => import('./pages/admin/admin-users/admin-users').then(m => m.AdminUsersComponent), title: 'Admin | EducaCRM' },
    ]
  },

  { path: '**', redirectTo: '' }
];