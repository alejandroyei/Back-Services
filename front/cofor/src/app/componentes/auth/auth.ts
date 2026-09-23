import { Component, EventEmitter, Output, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDc8YP-w2xUEn8NXzWAyJZ24qUpgF_3Df4',
  authDomain: 'ecored-ea5ec.firebaseapp.com',
  projectId: 'ecored-ea5ec',
  appId: '1:920308855852:web:8a171566346fb779e90d89',
});

const googleProvider = new GoogleAuthProvider();

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  @Output() readonly createAccount = new EventEmitter<void>();
  @Output() readonly loginSuccess = new EventEmitter<void>();

  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly googleError = signal('');
  protected readonly googleLoading = signal(false);

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected login(): void {
    this.submitted.set(true);
    this.loginSuccess.emit();
  }

  protected async loginWithGoogle(): Promise<void> {
    this.googleError.set('');
    this.googleLoading.set(true);

    try {
      await signInWithPopup(getAuth(firebaseApp), googleProvider);
      this.loginSuccess.emit();
    } catch {
      this.googleError.set('No fue posible iniciar sesión con Google. Inténtalo nuevamente.');
    } finally {
      this.googleLoading.set(false);
    }
  }

  protected openRegistration(): void {
    this.createAccount.emit();
  }

}
