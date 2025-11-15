import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type Role = 'alumno' | 'profesor' | 'jefatura' | 'direccion' | 'administrador';

export interface User {
  id: number;
  username: string;
  rol: Role;
  personaId: number;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  currentUser = signal<User | null>(this.restore());

  constructor(private http: HttpClient) {}


  private restore(): User | null {
    const raw = localStorage.getItem('edu_user');
    return raw ? JSON.parse(raw) as User : null;
  }

  private persist(u: User | null) {
    if (u) {
      localStorage.setItem('edu_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('edu_user');
    }
  }


  async login(username: string, password: string): Promise<boolean> {
    try {
      const body = {
        username: username.trim(),
        password,
      };

      const result = await firstValueFrom(
        this.http.post<User>('/api/auth/login', body)
      );

     
      this.currentUser.set(result);
      this.persist(result);
      return true;

    } catch (err) {
      console.error('Error en login (front):', err);
      return false;
    }
  }

  logout() {
    this.currentUser.set(null);
    this.persist(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  hasRole(...roles: Role[]): boolean {
    const u = this.currentUser();
    return !!u && roles.includes(u.rol);
  }

  token(): string | undefined {
    return this.currentUser()?.token;
  }
}