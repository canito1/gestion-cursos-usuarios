export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'profesor' | 'estudiante';
}
