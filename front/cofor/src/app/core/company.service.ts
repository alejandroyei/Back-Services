import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';

export interface Company {
  id_company: number;
  nit_company: string;
  nombre_company: string;
  correo_company: string;
  telefono_company: string;
  sector: string;
  activo: number;
  fecha_creacion?: string;
}

export type CompanyPayload = Omit<Company, 'id_company' | 'fecha_creacion'>;

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_CONFIG.companiesService}/empresas/`;

  list(): Observable<Company[]> { return this.http.get<Company[]>(this.url); }
  create(company: CompanyPayload): Observable<Company> { return this.http.post<Company>(this.url, company); }
  update(id: number, company: CompanyPayload): Observable<Company> { return this.http.put<Company>(`${this.url}${id}/`, company); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}${id}/`); }
}
