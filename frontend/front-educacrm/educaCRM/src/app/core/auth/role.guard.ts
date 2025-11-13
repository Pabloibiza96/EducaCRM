import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { RoleService, Permission } from './role.service';
import { Role } from './auth.service';

/**
 * Guard funcional para proteger rutas basándose en roles.
 * 
 * @example
 * ```typescript
 * // En app.routes.ts con data
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [roleGuard],
 *   data: { roles: ['administrador'] }
 * }
 * ```
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const roleService = inject(RoleService);
  const router = inject(Router);
  
  const allowedRoles: Role[] = route.data['roles'] ?? [];
  
  if (!allowedRoles.length) return true;
  
  const hasAccess = roleService.hasRole(...allowedRoles);

  if (!hasAccess) {
    console.warn(`Acceso denegado. Se requiere uno de los roles: ${allowedRoles.join(', ')}`);
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

/**
 * Guard funcional para proteger rutas basándose en permisos específicos.
 * 
 * @example
 * ```typescript
 * {
 *   path: 'alumnos/nuevo',
 *   component: AlumnoFormComponent,
 *   canActivate: [permissionGuard],
 *   data: { permissions: ['create_alumnos'] }
 * }
 * ```
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  const requiredPermissions: Permission[] = route.data['permissions'] ?? [];
  
  if (!requiredPermissions.length) return true;

  const hasAccess = requiredPermissions.every(permission => 
    roleService.hasPermission(permission)
  );

  if (!hasAccess) {
    console.warn(`Acceso denegado. Se requieren permisos: ${requiredPermissions.join(', ')}`);
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
