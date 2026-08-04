export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'profesor' | 'estudiante';
}

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'profesor' | 'estudiante';
}
