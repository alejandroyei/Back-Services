import { Component, computed, EventEmitter, Output, inject, signal } from '@angular/core';
import { User, UserRegistration, UserService } from '../../core/user.service';

interface Alumno { id: number; nombre: string; correo: string; programa: string; estado: 'Activo' | 'Pendiente'; }

@Component({ selector: 'app-alumnos', imports: [], templateUrl: './alumnos.html', styleUrl: './alumnos.css' })
export class Alumnos {
  @Output() readonly logout = new EventEmitter<void>();
  @Output() readonly navigate = new EventEmitter<'alumnos' | 'gestion-empresas' | 'empresas' | 'entrega'>();
  private readonly users = inject(UserService);
  protected readonly alumnos = signal<Alumno[]>([]);
  protected readonly search = signal('');
  protected readonly selectedId = signal<number | null>(null);
  protected readonly editingId = signal<number | null>(null);
  protected readonly creating = signal(false);
  protected readonly confirmingDelete = signal(false);
  protected readonly actionMessage = signal('');
  protected readonly loading = signal(true);
  protected readonly filteredAlumnos = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.alumnos().filter((alumno) => `${alumno.nombre} ${alumno.correo} ${alumno.programa}`.toLowerCase().includes(term));
  });

  constructor() { this.loadUsers(); }

  protected onSearch(value: string): void { this.search.set(value); this.selectedId.set(null); }
  protected selectAlumno(id: number): void { this.selectedId.set(id); this.confirmingDelete.set(false); this.actionMessage.set(''); }
  protected addAlumno(): void { this.creating.set(true); this.editingId.set(null); this.confirmingDelete.set(false); this.actionMessage.set(''); }
  protected editSelected(): void { this.editingId.set(this.selectedId()); this.actionMessage.set(''); }
  protected cancelEdit(): void { this.editingId.set(null); }
  protected cancelCreate(): void { this.creating.set(false); }

  protected createAlumno(documento: string, nombre: string, correo: string, telefono: string, programa: string, semestre: string, contrasena: string): void {
    const names = nombre.trim().split(/\s+/);
    const payload: UserRegistration = {
      tipo_user: 'estudiante', documento_user: documento.trim(), nombres_user: names.shift() ?? '', apellidos_user: names.join(' ') || '-',
      correo_user: correo.trim(), contrasena_user: contrasena, telefono_user: telefono.trim(), programa: programa.trim(), semestre: Number(semestre), activo: 1,
    };
    this.users.register(payload).subscribe({
      next: (user) => { this.alumnos.update((items) => [...items, this.mapUser(user)]); this.creating.set(false); this.actionMessage.set('Estudiante agregado correctamente.'); },
      error: (response) => this.actionMessage.set(this.errorMessage(response, 'No fue posible agregar el estudiante.')),
    });
  }

  protected saveAlumno(id: number, nombre: string, correo: string, programa: string): void {
    const names = nombre.trim().split(/\s+/);
    this.users.update(id, { nombres_user: names.shift() ?? '', apellidos_user: names.join(' ') || '-', correo_user: correo.trim(), programa: programa.trim() }).subscribe({
      next: (user) => { this.alumnos.update((items) => items.map((item) => item.id === id ? this.mapUser(user) : item)); this.editingId.set(null); this.actionMessage.set('Estudiante actualizado correctamente.'); },
      error: (response) => this.actionMessage.set(this.errorMessage(response, 'No fue posible actualizar el estudiante.')),
    });
  }

  protected deleteSelected(): void { if (this.selectedId() !== null) this.confirmingDelete.set(true); }
  protected cancelDelete(): void { this.confirmingDelete.set(false); }
  protected confirmDelete(): void {
    const id = this.selectedId();
    if (id === null) return;
    this.users.delete(id).subscribe({
      next: () => { this.alumnos.update((items) => items.filter((item) => item.id !== id)); this.selectedId.set(null); this.confirmingDelete.set(false); this.actionMessage.set('Estudiante eliminado correctamente.'); },
      error: (response) => this.actionMessage.set(this.errorMessage(response, 'No fue posible eliminar el estudiante.')),
    });
  }
  protected closeSession(): void { this.logout.emit(); }
  protected openSection(section: 'alumnos' | 'gestion-empresas' | 'empresas' | 'entrega'): void { this.navigate.emit(section); }

  private loadUsers(): void {
    this.users.list().subscribe({
      next: (users) => { this.alumnos.set(users.filter((user) => user.tipo_user === 'estudiante').map((user) => this.mapUser(user))); this.loading.set(false); },
      error: (response) => { this.loading.set(false); this.actionMessage.set(this.errorMessage(response, 'No fue posible cargar los estudiantes. Inicia sesión nuevamente.')); },
    });
  }
  private mapUser(user: User): Alumno { return { id: user.id_user, nombre: `${user.nombres_user} ${user.apellidos_user}`.trim(), correo: user.correo_user, programa: user.programa, estado: user.activo === 1 ? 'Activo' : 'Pendiente' }; }
  private errorMessage(response: { error?: unknown }, fallback: string): string { const details = response.error; return typeof details === 'object' && details !== null ? Object.values(details as object).flat().join(' ') || fallback : fallback; }
}
