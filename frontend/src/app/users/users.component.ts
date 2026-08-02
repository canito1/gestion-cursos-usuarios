import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-users',
  template: `
    <div>
      <h2>Gestión de Usuarios</h2>
      <button (click)="showCreate = !showCreate">{{ showCreate ? 'Cerrar' : 'Nuevo usuario' }}</button>

      <div *ngIf="showCreate" class="form-panel">
        <form (ngSubmit)="createUser()">
          <label>Nombre<input [(ngModel)]="newUser.name" name="name" required /></label>
          <label>Usuario<input [(ngModel)]="newUser.username" name="username" required /></label>
          <label>Contraseña<input type="password" [(ngModel)]="newUser.password" name="password" required /></label>
          <label>Rol
            <select [(ngModel)]="newUser.role" name="role" required>
              <option value="admin">Admin</option>
              <option value="profesor">Profesor</option>
              <option value="estudiante">Estudiante</option>
            </select>
          </label>
          <button type="submit">Crear</button>
        </form>
      </div>

      <table class="data-table">
        <thead>
          <tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{ user.name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button (click)="deleteUser(user.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    "h2 { margin-bottom: 12px; }",
    ".form-panel { margin: 16px 0; padding: 16px; border: 1px solid #d1d5db; border-radius: 8px; background: #f8fafc; }",
    "label { display: block; margin-bottom: 12px; }",
    "input, select { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #cbd5e1; border-radius: 4px; }",
    "button { margin-top: 8px; padding: 10px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }",
    ".data-table { width: 100%; border-collapse: collapse; margin-top: 16px; }",
    ".data-table th, .data-table td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }"
  ]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  showCreate = false;
  newUser = { name: '', username: '', password: '', role: 'estudiante' };
  loadingUsers = false;
  usersError = false;

  constructor(private userService: UserService, private auth: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    // Only load users for authenticated admins
    if (this.auth.isAuthenticated() && this.auth.getUserRole() === 'admin') {
      this.loadUsers();
    }
  }

  loadUsers() {
    this.loadingUsers = true;
    this.usersError = false;
    console.log('UsersComponent: loading users via service');
    this.userService.getUsers().subscribe({
      next: data => {
        this.users = data;
        this.loadingUsers = false;
        try { this.cd.detectChanges(); } catch {}
      },
      error: err => {
        console.error('UsersComponent: error loading users', err);
        this.users = [];
        this.loadingUsers = false;
        try { this.cd.detectChanges(); } catch {}
        this.usersError = true;
      }
    });

    // diagnostic fetch fallback (requires admin token for /api/users)
    try {
      const url = 'http://localhost:4000/api/users';
      console.log('UsersComponent: fallback fetch ->', url);
      const token = this.auth.getToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      window.fetch(url, { headers })
        .then(async res => {
          console.log('UsersComponent: fetch status', res.status);
          const text = await res.text();
          try { console.log('UsersComponent: fetch body JSON', JSON.parse(text)); } catch { console.log('UsersComponent: fetch body (text)', text); }
        })
        .catch(err => console.error('UsersComponent: fetch error', err));
    } catch (e) {
      console.error('UsersComponent: fetch fallback not available', e);
    }
  }

  createUser() {
    this.userService.createUser(this.newUser).subscribe(() => {
      this.newUser = { name: '', username: '', password: '', role: 'estudiante' };
      this.showCreate = false;
      // Refresh list only if admin
      if (this.auth.isAuthenticated() && this.auth.getUserRole() === 'admin') {
        this.loadUsers();
      }
    });
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }
}
