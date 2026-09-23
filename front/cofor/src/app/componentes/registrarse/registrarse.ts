import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-registrarse',
  imports: [],
  templateUrl: './registrarse.html',
  styleUrl: './registrarse.css',
})
export class Registrarse {
  @Output() readonly goToLogin = new EventEmitter<void>();
  private readonly users = inject(UserService);
  protected readonly showPassword = signal(false);
  protected readonly passwordsDoNotMatch = signal(false);
  protected readonly error = signal('');
  protected readonly loading = signal(false);

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected register(form: HTMLFormElement, password: string, confirmation: string): void {
    this.passwordsDoNotMatch.set(password !== confirmation);
    this.error.set('');
    if (password !== confirmation || !form.checkValidity()) { this.error.set('Completa correctamente los campos obligatorios.'); return; }
    const data = new FormData(form);
    const fullName = String(data.get('fullName')).trim().split(/\s+/);
    this.loading.set(true);
    this.users.register({
      tipo_user: 'estudiante', documento_user: String(data.get('document')).trim(),
      nombres_user: fullName.shift() ?? '', apellidos_user: fullName.join(' ') || '-',
      correo_user: String(data.get('email')).trim(), contrasena_user: password,
      telefono_user: String(data.get('phone')).trim(), programa: String(data.get('program')).trim(),
      semestre: Number(data.get('semester')), activo: 1,
    }).subscribe({
      next: () => { this.loading.set(false); this.goToLogin.emit(); },
      error: (response) => { this.loading.set(false); const details = response.error; this.error.set(typeof details === 'object' ? Object.values(details).flat().join(' ') : 'No fue posible crear la cuenta.'); },
    });
  }

  protected returnToLogin(): void {
    this.goToLogin.emit();
  }
}
