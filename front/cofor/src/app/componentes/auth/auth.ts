import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { UserService } from '../../core/user.service';

const firebaseApp = initializeApp({ apiKey: 'AIzaSyDc8YP-w2xUEn8NXzWAyJZ24qUpgF_3Df4', authDomain: 'ecored-ea5ec.firebaseapp.com', projectId: 'ecored-ea5ec', appId: '1:920308855852:web:8a171566346fb779e90d89' });
const googleProvider = new GoogleAuthProvider();

@Component({ selector: 'app-auth', imports: [], templateUrl: './auth.html', styleUrl: './auth.css' })
export class Auth {
  @Output() readonly createAccount = new EventEmitter<void>();
  @Output() readonly loginSuccess = new EventEmitter<void>();
  private readonly users = inject(UserService);
  protected readonly showPassword = signal(false);
  protected readonly googleError = signal('');
  protected readonly googleLoading = signal(false);
  protected readonly error = signal('');
  protected readonly loading = signal(false);

  protected togglePassword(): void { this.showPassword.update((visible) => !visible); }
  protected login(email: string, password: string): void {
    this.error.set('');
    if (!email || !password) { this.error.set('Ingresa correo y contraseña.'); return; }
    this.loading.set(true);
    this.users.login({ correo_user: email, contrasena_user: password }).subscribe({
      next: ({ access, refresh }) => { sessionStorage.setItem('co360_access_token', access); sessionStorage.setItem('co360_refresh_token', refresh); this.loading.set(false); this.loginSuccess.emit(); },
      error: (response) => { this.loading.set(false); this.error.set(response.error?.non_field_errors?.[0] ?? 'No fue posible iniciar sesión. Verifica tus credenciales.'); },
    });
  }
  protected async loginWithGoogle(): Promise<void> { this.googleError.set(''); this.googleLoading.set(true); try { await signInWithPopup(getAuth(firebaseApp), googleProvider); this.loginSuccess.emit(); } catch { this.googleError.set('No fue posible iniciar sesión con Google. Inténtalo nuevamente.'); } finally { this.googleLoading.set(false); } }
  protected openRegistration(): void { this.createAccount.emit(); }
}
