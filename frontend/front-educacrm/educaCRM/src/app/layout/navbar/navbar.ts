import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, Role } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  // Menú filtrado por rol
  links = [
    { label: 'Inicio',        path: '/',            roles: ['alumno','profesor','jefatura','direccion','administrador'] as Role[] },
    { label: 'Alumnos',       path: '/alumnos',     roles: ['administrador','jefatura'] as Role[] },
    { label: 'Profesores',    path: '/profesores',  roles: ['administrador','jefatura'] as Role[] },
    { label: 'Grupos',        path: '/grupos',      roles: ['alumno','profesor','jefatura','direccion','administrador'] as Role[] },
    { label: 'Asignaturas',   path: '/asignaturas', roles: ['alumno','profesor','jefatura','direccion','administrador'] as Role[] },
    { label: 'Calificaciones',path: '/calificaciones', roles: ['administrador','profesor'] as Role[] },
    { label: 'Admin',         path: '/admin',       roles: ['administrador','direccion'] as Role[] },
  ];

  canSee = (roles: Role[]) => {
    const u = this.auth.currentUser(); return !!u && roles.includes(u.rol);
  };

  logout() { this.auth.logout(); this.router.navigateByUrl('/login'); }
}