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

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  login(credentials: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${API_CONFIG.userService}/token/`, credentials);
  }

  register(user: UserRegistration): Observable<UserRegistration> {
    return this.http.post<UserRegistration>(`${API_CONFIG.userService}/usuarios/`, user);
  }
}
