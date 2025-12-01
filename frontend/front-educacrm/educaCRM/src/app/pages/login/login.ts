import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
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
