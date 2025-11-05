import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  // simulamos usuario logueado
  user = signal<{ name: string; role: string } | null>({
    name: 'Pablo Ibiza',
    role: 'admin'
  });

  // rutas del menú
  links = signal([
    { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'jefatura', 'profesor', 'alumno'] },
    { label: 'Alumnos', path: '/alumnos', roles: ['admin', 'jefatura'] },
    { label: 'Profesores', path: '/profesores', roles: ['admin', 'jefatura'] },
    { label: 'Departamentos', path: '/departamentos', roles: ['admin', 'direccion'] },
    { label: 'Calificaciones', path: '/calificaciones', roles: ['admin', 'profesor'] }
  ]);

  // método logout (simulado)
  logout() {
    this.user.set(null);
  }
}