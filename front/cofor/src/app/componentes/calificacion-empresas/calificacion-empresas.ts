import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { Company, CompanyService } from '../../core/company.service';

interface EmpresaCalificada {
  id: number;
  nombre: string;
  sector: string;
}

@Component({
  selector: 'app-calificacion-empresas',
  imports: [],
  templateUrl: './calificacion-empresas.html',
  styleUrl: './calificacion-empresas.css',
})
export class CalificacionEmpresas {
  @Output() readonly logout = new EventEmitter<void>();
  @Output() readonly navigate = new EventEmitter<'alumnos' | 'gestion-empresas' | 'empresas' | 'entrega'>();
  private readonly companiesService = inject(CompanyService);
  protected readonly empresas = signal<EmpresaCalificada[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  constructor() {
    this.companiesService.list().subscribe({
      next: (companies) => { this.empresas.set(companies.map((company) => this.mapCompany(company))); this.loading.set(false); },
      error: () => { this.error.set('No fue posible cargar las empresas.'); this.loading.set(false); },
    });
  }

  protected initials(name: string): string { return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase(); }

  protected openSection(section: 'alumnos' | 'gestion-empresas' | 'empresas' | 'entrega'): void { this.navigate.emit(section); }
  protected closeSession(): void { this.logout.emit(); }
  private mapCompany(company: Company): EmpresaCalificada { return { id: company.id_company, nombre: company.nombre_company, sector: company.sector }; }
}
