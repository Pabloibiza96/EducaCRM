import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
  <div class="row justify-content-center">
    <div class="col-12 col-md-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-3">Acceso</h5>

          <form (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label">Usuario</label>
              <input class="form-control" [(ngModel)]="username" name="username" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" [(ngModel)]="password" name="password" required>
            </div>
            <button class="btn btn-primary w-100" [disabled]="loading">Entrar</button>
          </form>

            <p class="mt-3 text-muted small">
          Demo: admin/admin123, agarcia/agarcia123, lperez/lperez123
          </p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  constructor(private auth: AuthService, private router: Router) {}
  async submit() {
    this.loading = true;
    const ok = await this.auth.login(this.username, this.password);
    this.loading = false;
    if (ok) this.router.navigateByUrl('/');
    else alert('Credenciales inválidas');
  }
}
