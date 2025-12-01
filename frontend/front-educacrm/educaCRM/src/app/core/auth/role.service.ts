import { Injectable } from '@angular/core';
import { AuthService, Role } from './auth.service';

export type Permission =
  | 'view_alumnos'
  | 'create_alumnos'
  | 'edit_alumnos'
  | 'delete_alumnos'
  | 'view_profesores'
  | 'create_profesores'
  | 'edit_profesores'
  | 'delete_profesores'
  | 'view_asignaturas'
  | 'create_asignaturas'
  | 'edit_asignaturas'
  | 'delete_asignaturas'
  | 'view_grupos'
  | 'create_grupos'
  | 'edit_grupos'
  | 'delete_grupos'
  | 'view_calificaciones'
  | 'create_calificaciones'
  | 'edit_calificaciones'
  | 'delete_calificaciones'
  | 'view_usuarios'
  | 'create_usuarios'
  | 'edit_usuarios'
  | 'delete_usuarios'
  | 'view_departamentos'
  | 'create_departamentos'
  | 'edit_departamentos'
  | 'delete_departamentos'
  | 'view_dashboard'
  | 'view_reports';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  // Administrador: Acceso total
  administrador: [
    'view_alumnos',
    'create_alumnos',
    'edit_alumnos',
    'delete_alumnos',
    'view_profesores',
    'create_profesores',
    'edit_profesores',
    'delete_profesores',
    'view_asignaturas',
    'create_asignaturas',
    'edit_asignaturas',
    'delete_asignaturas',
    'view_grupos',
    'create_grupos',
    'edit_grupos',
    'delete_grupos',
    'view_calificaciones',
    'create_calificaciones',
    'edit_calificaciones',
    'delete_calificaciones',
    'view_usuarios',
    'create_usuarios',
    'edit_usuarios',
    'delete_usuarios',
    'view_departamentos',
    'create_departamentos',
    'edit_departamentos',
    'delete_departamentos',
    'view_dashboard',
    'view_reports',
  ],

  // Dirección: gestión global
  direccion: [
    'view_alumnos',
    'view_profesores',
    'view_asignaturas',
    'view_grupos',
    'view_calificaciones',
    'view_usuarios',
    'view_departamentos',
    'view_dashboard',
    'view_reports',
  ],

  // Jefatura de estudios: gestión académica completa
  jefatura: [
    'view_alumnos',
    'create_alumnos',
    'edit_alumnos',
    'delete_alumnos',
    'view_profesores',
    'create_profesores',
    'edit_profesores',
    'delete_profesores',
    'view_asignaturas',
    'create_asignaturas',
    'edit_asignaturas',
    'delete_asignaturas',
    'view_grupos',
    'create_grupos',
    'edit_grupos',
    'delete_grupos',
    'view_calificaciones',
    'create_calificaciones',
    'edit_calificaciones',
    'delete_calificaciones',
    'view_departamentos',
    'create_departamentos',
    'edit_departamentos',
    'delete_departamentos',
    'view_dashboard',
  ],

  // Profesor: gestión de notas y consulta de alumnos / grupos / departamentos
  profesor: [
    'view_alumnos',
    'view_grupos',
    'view_calificaciones',
    'create_calificaciones',
    'edit_calificaciones',
    'view_asignaturas',
    'view_departamentos',
    'view_dashboard',
  ],

  // Alumno: sólo consulta de sus calificaciones
  alumno: ['view_calificaciones'],
};

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private authService: AuthService) {}

  /** Verifica si el usuario actual tiene un permiso específico. */
  hasPermission(permission: Permission): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.rol] || [];
    return permissions.includes(permission);
  }

  /** Verifica si el usuario actual tiene alguno de los permisos especificados. */
  hasAnyPermission(...permissions: Permission[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  /** Verifica si el usuario actual tiene todos los permisos especificados. */
  hasAllPermissions(...permissions: Permission[]): boolean {
    return permissions.every((p) => this.hasPermission(p));
  }

  /** Verifica si el usuario actual tiene uno de los roles especificados. */
  hasRole(...roles: Role[]): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    return roles.includes(user.rol);
  }

  // Helpers por rol
  isAdmin(): boolean {
    return this.hasRole('administrador');
  }
  isDireccion(): boolean {
    return this.hasRole('direccion');
  }
  isJefatura(): boolean {
    return this.hasRole('jefatura');
  }
  isProfesor(): boolean {
    return this.hasRole('profesor');
  }
  isAlumno(): boolean {
    return this.hasRole('alumno');
  }

  /** Obtiene todos los permisos del usuario actual. */
  getUserPermissions(): Permission[] {
    const user = this.authService.currentUser();
    if (!user) return [];
    return ROLE_PERMISSIONS[user.rol] || [];
  }

  /** Verifica si el usuario puede acceder a un módulo completo. */
  canAccessModule(
    module:
      | 'alumnos'
      | 'profesores'
      | 'asignaturas'
      | 'grupos'
      | 'calificaciones'
      | 'usuarios'
      | 'departamentos'
  ): boolean {
    return this.hasPermission(`view_${module}` as Permission);
  }

  /** Verifica si el usuario puede crear en un módulo. */
  canCreate(
    module:
      | 'alumnos'
      | 'profesores'
      | 'asignaturas'
      | 'grupos'
      | 'calificaciones'
      | 'usuarios'
      | 'departamentos'
  ): boolean {
    return this.hasPermission(`create_${module}` as Permission);
  }

  /** Verifica si el usuario puede editar en un módulo. */
  canEdit(
    module:
      | 'alumnos'
      | 'profesores'
      | 'asignaturas'
      | 'grupos'
      | 'calificaciones'
      | 'usuarios'
      | 'departamentos'
  ): boolean {
    return this.hasPermission(`edit_${module}` as Permission);
  }

  /** Verifica si el usuario puede eliminar en un módulo. */
  canDelete(
    module:
      | 'alumnos'
      | 'profesores'
      | 'asignaturas'
      | 'grupos'
      | 'calificaciones'
      | 'usuarios'
      | 'departamentos'
  ): boolean {
    return this.hasPermission(`delete_${module}` as Permission);
  }
}
