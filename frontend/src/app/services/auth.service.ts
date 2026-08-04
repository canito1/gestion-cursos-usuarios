import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../core/models/login-request.model';
import { LoginResponse, UserInfo } from '../core/models/login-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'gestion-cursos-token';
  private readonly userKey = 'gestion-cursos-user';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { username, password };
    return this.http.post<LoginResponse>('http://localhost:4000/api/auth/login', body).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): UserInfo | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) as UserInfo : null;
  }

  getUserRole(): string | null {
    return this.getUser()?.role ?? null;
  }
}
