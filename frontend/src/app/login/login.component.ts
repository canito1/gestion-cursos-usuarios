import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  template: `
    <div class="login-card">
      <h2>Iniciar sesión</h2>
      <form (ngSubmit)="login()" #loginForm="ngForm">
        <label>
          Usuario
          <input name="username" [(ngModel)]="username" required />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" [(ngModel)]="password" required />
        </label>
        <div class="actions">
          <button type="submit" [disabled]="loginForm.invalid">Entrar</button>
        </div>
        <div class="error" *ngIf="error">{{ error }}</div>
      </form>
    </div>
  `,
  styles: [
    ".login-card { max-width: 400px; margin: 0 auto; padding: 24px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }",
    "label { display: block; margin-bottom: 16px; font-weight: 600; }",
    "input { width: 100%; padding: 10px; margin-top: 6px; border: 1px solid #ccc; border-radius: 4px; }",
    ".actions { margin-top: 18px; }",
    "button { width: 100%; padding: 12px; background: #2563eb; border: none; color: white; cursor: pointer; border-radius: 4px; }",
    ".error { margin-top: 12px; color: #dc2626; font-weight: 600; }"
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.error = err.error?.message || 'Error al iniciar sesión';
      }
    });
  }
}
