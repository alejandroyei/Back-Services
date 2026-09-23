import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';

export interface LoginRequest { correo_user: string; contrasena_user: string; }
export interface TokenResponse { access: string; refresh: string; }
export interface UserRegistration {
  tipo_user: string;
  documento_user: string;
  nombres_user: string;
  apellidos_user: string;
  correo_user: string;
  contrasena_user: string;
  telefono_user: string;
  programa: string;
  semestre: number;
  activo: number;
}

export interface User extends Omit<UserRegistration, 'contrasena_user'> {
  id_user: number;
  fecha_creacion: string;
}

/** Campos que la administración de alumnos puede modificar sin reenviar la contraseña. */
export type UserUpdate = Partial<Omit<UserRegistration, 'contrasena_user'>>;

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_CONFIG.userService}/usuarios/`;

  login(credentials: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${API_CONFIG.userService}/token/`, credentials);
  }

  register(user: UserRegistration): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  list(): Observable<User[]> { return this.http.get<User[]>(this.url); }
  update(id: number, user: UserUpdate): Observable<User> { return this.http.patch<User>(`${this.url}${id}/`, user); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}${id}/`); }
}
