import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, Role } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expected: Role[] = route.data?.['roles'] ?? [];
  if (!expected.length) return true;
  if (auth.hasRole(...expected)) return true;
  router.navigateByUrl('/'); // o página 403 si la creas
  return false;
};