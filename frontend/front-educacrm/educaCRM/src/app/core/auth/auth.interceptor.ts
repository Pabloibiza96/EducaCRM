import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';

import { AuthService } from './auth.service';
import { API_URL } from '../tokens/api-url.token';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authSrv = inject(AuthService);
  const apiUrl = inject(API_URL);

  // Detecta si la URL ya es absoluta (http:// o https://)
  const isAbsolute = /^https?:\/\//i.test(req.url);

  // Si es relativa, se le antepone apiUrl
 const apiReq = isAbsolute
  ? req
  : req.clone({
      url: `${apiUrl}/${req.url}`,
    });

  const token = authSrv.token();
  // Si hay token, lo añadimos
  if (token) {
    return next(
      apiReq.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    );
  }

  return next(apiReq);
};
