import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserRequest } from '../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = 'http://localhost:4000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
