import { Component, signal } from '@angular/core';
import { Auth } from './componentes/auth/auth';
import { Alumnos } from './componentes/alumnos/alumnos';
import { Empresas } from './componentes/empresas/empresas';
import { Entrega } from './componentes/entrega/entrega';
import { CalificacionEmpresas } from './componentes/calificacion-empresas/calificacion-empresas';
import { Registrarse } from './componentes/registrarse/registrarse';

@Component({
  selector: 'app-root',
  imports: [Auth, Alumnos, Empresas, Entrega, CalificacionEmpresas, Registrarse],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cofor');
  protected readonly registrationView = signal(false);
  protected readonly authenticated = signal(false);
  protected readonly activeSection = signal<'alumnos' | 'gestion-empresas' | 'empresas' | 'entrega'>('alumnos');

  protected openRegistration(): void {
    this.registrationView.set(true);
  }

  protected openLogin(): void {
    this.registrationView.set(false);
  }

  protected enterApplication(): void { this.authenticated.set(true); this.activeSection.set('alumnos'); }
  protected closeSession(): void {
    sessionStorage.removeItem('co360_access_token');
    sessionStorage.removeItem('co360_refresh_token');
    this.authenticated.set(false);
    this.registrationView.set(false);
  }
  protected navigateTo(section: 'alumnos' | 'gestion-empresas' | 'empresas' | 'entrega'): void { this.activeSection.set(section); }
}
