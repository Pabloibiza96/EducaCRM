import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as Role[] | undefined;

  // Si no está logueado, se comporta como el authGuard
  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Si no hay roles definidos, dejamos pasar 
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Si su rol está entre los permitidos, ok
  if (auth.hasRole(...allowedRoles)) {
    return true;
  }

  // Si no tiene permiso, lo mandamos a inicio
  router.navigate(['/']);
  return false;
};