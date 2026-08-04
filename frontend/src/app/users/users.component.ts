import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User, CreateUserRequest } from '../core/models/user.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  showCreate = false;
  newUser: CreateUserRequest = { name: '', username: '', password: '', role: 'estudiante' };
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
