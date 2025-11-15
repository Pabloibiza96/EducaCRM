import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // Si no está logueado, lo mandamos a /login y guardamos la URL a la que intentaba ir
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};