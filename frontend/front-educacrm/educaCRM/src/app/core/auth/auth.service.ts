import { Injectable, signal } from '@angular/core';

export type Role = 'alumno'|'profesor'|'jefatura'|'direccion'|'administrador';
export interface User { id: number; username: string; role: Role; token?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.restore());

  private restore(): User | null {
    const raw = localStorage.getItem('edu_user');
    return raw ? JSON.parse(raw) as User : null;
  }
  private persist(u: User | null) {
    if (u) localStorage.setItem('edu_user', JSON.stringify(u));
    else localStorage.removeItem('edu_user');
  }

  // MOCK de login: acepta usuario si existe en el diccionario y hay password no vacío
  async login(username: string, password: string): Promise<boolean> {
    const demo: Record<string, User> = {
      admin:    { id: 1, username: 'admin',    role: 'administrador', token: 'demo' },
      profe:    { id: 2, username: 'profe',    role: 'profesor',      token: 'demo' },
      alumno:   { id: 3, username: 'alumno',   role: 'alumno',        token: 'demo' },
      jefatura: { id: 4, username: 'jefatura', role: 'jefatura',      token: 'demo' },
      direccion:{ id: 5, username: 'direccion',role: 'direccion',     token: 'demo' },
    };
    const user = demo[username];
    if (user && password.trim().length > 0) {
      this.currentUser.set(user);
      this.persist(user);
      return true;
    }
    return false;
  }

  logout() { this.currentUser.set(null); this.persist(null); }

  isLoggedIn(): boolean { return !!this.currentUser(); }
  hasRole(...roles: Role[]): boolean {
    const u = this.currentUser(); return !!u && roles.includes(u.role);
  }
  token(): string | undefined { return this.currentUser()?.token; }
}