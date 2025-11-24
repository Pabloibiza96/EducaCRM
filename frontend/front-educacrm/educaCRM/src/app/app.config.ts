import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { API_URL } from './core/tokens/api-url.token';

const API_BASE = isDevMode()
  ? 'http://localhost:3000/api'
  : '/api';

console.log('API_BASE en Angular:', API_BASE);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideHttpClient(withInterceptors([authInterceptor])),

    { provide: API_URL, useValue: API_BASE },
  ],
};
