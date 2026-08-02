import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  selector: 'app-root',
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div class="brand">Gestión de Cursos y Usuarios</div>
        <nav *ngIf="auth.isAuthenticated()">
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/cursos">Cursos</a>
          <a routerLink="/usuarios" *ngIf="auth.getUserRole() === 'admin'">Usuarios</a>
          <button (click)="logout()">Cerrar sesión</button>
        </nav>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    ".app-shell { font-family: Arial, sans-serif; max-width: 960px; margin: 0 auto; padding: 16px; }",
    ".app-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid #ccc; }",
    ".brand { font-size: 1.4rem; font-weight: 700; }",
    "nav a { margin-right: 14px; text-decoration: none; color: #1f2937; }",
    "nav button { background: #ef4444; border: none; color: white; padding: 8px 12px; cursor: pointer; border-radius: 4px; }",
    "main { padding-top: 24px; }"
  ]
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
