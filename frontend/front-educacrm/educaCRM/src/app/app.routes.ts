import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { Role } from './core/auth/auth.service';

export const routes: Routes = [
  // Pública
  { path: 'login', component: LoginComponent },

  // Todo lo demás requiere login
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        title: 'Inicio | EducaCRM',
      },

      {
        path: 'alumnos',
        loadComponent: () =>
          import('./pages/alumnos/alumnos-list/alumnos-list').then(
            (m) => m.AlumnosListComponent
          ),
        title: 'Alumnos | EducaCRM',
        canActivate: [roleGuard],
        data: {
          roles: [
            'profesor',
            'jefatura',
            'direccion',
            'administrador',
          ] as Role[],
        },
      },

      {
        path: 'profesores',
        loadComponent: () =>
          import('./pages/profesores/profesores-list/profesores-list').then(
            (m) => m.ProfesoresListComponent
          ),
        title: 'Profesores | EducaCRM',
        canActivate: [roleGuard],
        data: { roles: ['jefatura', 'direccion', 'administrador'] as Role[] },
      },

      {
        path: 'grupos',
        loadComponent: () =>
          import('./pages/grupos/grupos-list/grupos-list').then(
            (m) => m.GruposListComponent
          ),
        title: 'Grupos | EducaCRM',
        canActivate: [roleGuard],
        data: {
          roles: [
            'profesor',
            'jefatura',
            'direccion',
            'administrador',
          ] as Role[],
        },
      },

      {
        path: 'asignaturas',
        loadComponent: () =>
          import('./pages/asignaturas/asignaturas-list/asignaturas-list').then(
            (m) => m.AsignaturasListComponent
          ),
        title: 'Asignaturas | EducaCRM',
        canActivate: [roleGuard],
        data: { roles: ['jefatura', 'direccion', 'administrador'] as Role[] },
      },

      {
        path: 'calificaciones',
        loadComponent: () =>
          import(
            './pages/calificaciones/calificaciones-list/calificaciones-list'
          ).then((m) => m.CalificacionesListComponent),
        title: 'Calificaciones | EducaCRM',
        canActivate: [roleGuard],
        data: {
          roles: [
            'profesor',
            'jefatura',
            'direccion',
            'administrador',
          ] as Role[],
        },
      },
      {
        path: 'departamentos',
        loadComponent: () =>
          import(
            './pages/departamentos/departamentos-list/departamentos-list'
          ).then((m) => m.DepartamentosListComponent),
        title: 'Departamentos | EducaCRM',
        canActivate: [roleGuard],
        data: { roles: ['jefatura', 'direccion', 'administrador'] as Role[] },
      },

      {
        path: 'admin',
        loadComponent: () =>
          import('./pages/admin/admin-users/admin-users').then(
            (m) => m.AdminUsersComponent
          ),
        title: 'Admin | EducaCRM',
        canActivate: [roleGuard],
        data: { roles: ['administrador'] as Role[] },
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
