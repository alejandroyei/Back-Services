import { Component, computed, EventEmitter, Output, inject, signal } from '@angular/core';
import { Company, CompanyPayload, CompanyService } from '../../core/company.service';

interface Empresa { id: number; nit: string; nombre: string; correo: string; telefono: string; sector: string; estado: 'Activa' | 'Pendiente'; }

@Component({ selector: 'app-empresas', imports: [], templateUrl: './empresas.html', styleUrl: './empresas.css' })
export class Empresas {
  @Output() readonly logout = new EventEmitter<void>();
  @Output() readonly navigate = new EventEmitter<'alumnos' | 'gestion-empresas' | 'empresas' | 'entrega'>();
  private readonly companies = inject(CompanyService);
  protected readonly empresas = signal<Empresa[]>([]);
  protected readonly search = signal('');
  protected readonly selectedId = signal<number | null>(null);
  protected readonly editingId = signal<number | null>(null);
  protected readonly creating = signal(false);
  protected readonly confirmingDelete = signal(false);
  protected readonly message = signal('');
  protected readonly loading = signal(true);
  protected readonly filteredEmpresas = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.empresas().filter((empresa) => `${empresa.nombre} ${empresa.correo} ${empresa.sector}`.toLowerCase().includes(term));
  });
  constructor() { this.loadCompanies(); }
  protected onSearch(value: string): void { this.search.set(value); this.selectedId.set(null); }
  protected selectEmpresa(id: number): void { this.selectedId.set(id); this.confirmingDelete.set(false); this.message.set(''); }
  protected editSelected(): void { this.editingId.set(this.selectedId()); }
  protected cancelEdit(): void { this.editingId.set(null); }
  protected cancelCreate(): void { this.creating.set(false); }
  protected createEmpresa(nit: string, nombre: string, correo: string, telefono: string, sector: string): void {
    this.companies.create(this.payload(nit, nombre, correo, telefono, sector)).subscribe({
      next: (company) => { this.empresas.update((items) => [...items, this.mapCompany(company)]); this.creating.set(false); this.message.set('Empresa agregada correctamente.'); },
      error: () => this.message.set('No fue posible agregar la empresa.'),
    });
  }
  protected saveEmpresa(id: number, nit: string, nombre: string, correo: string, telefono: string, sector: string): void {
    this.companies.update(id, this.payload(nit, nombre, correo, telefono, sector)).subscribe({
      next: (company) => { this.empresas.update((items) => items.map((item) => item.id === id ? this.mapCompany(company) : item)); this.editingId.set(null); this.message.set('Empresa actualizada correctamente.'); },
      error: () => this.message.set('No fue posible actualizar la empresa.'),
    });
  }
  protected addEmpresa(): void { this.creating.set(true); this.editingId.set(null); this.confirmingDelete.set(false); this.message.set(''); }
  protected deleteSelected(): void { if (this.selectedId() !== null) this.confirmingDelete.set(true); }
  protected cancelDelete(): void { this.confirmingDelete.set(false); }
  protected confirmDelete(): void { const id = this.selectedId(); if (id === null) return; this.companies.delete(id).subscribe({ next: () => { this.empresas.update((items) => items.filter((item) => item.id !== id)); this.selectedId.set(null); this.confirmingDelete.set(false); this.message.set('Empresa eliminada correctamente.'); }, error: () => this.message.set('No fue posible eliminar la empresa.') }); }
  protected openSection(section: 'alumnos' | 'gestion-empresas' | 'empresas' | 'entrega'): void { this.navigate.emit(section); }
  protected closeSession(): void { this.logout.emit(); }
  private loadCompanies(): void { this.companies.list().subscribe({ next: (companies) => { this.empresas.set(companies.map((company) => this.mapCompany(company))); this.loading.set(false); }, error: () => { this.loading.set(false); this.message.set('No fue posible cargar las empresas.'); } }); }
  private mapCompany(company: Company): Empresa { return { id: company.id_company, nit: company.nit_company, nombre: company.nombre_company, correo: company.correo_company, telefono: company.telefono_company, sector: company.sector, estado: company.activo === 1 ? 'Activa' : 'Pendiente' }; }
  private payload(nit: string, nombre: string, correo: string, telefono: string, sector: string): CompanyPayload { return { nit_company: nit, nombre_company: nombre, correo_company: correo, telefono_company: telefono, sector, activo: 1 }; }
}
