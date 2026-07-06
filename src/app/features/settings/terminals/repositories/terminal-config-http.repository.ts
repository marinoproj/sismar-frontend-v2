import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { TerminalConfigRepository } from './terminal-config.repository';
import { TerminalConfig, TerminalConfigFilter, TerminalConfigInput } from '../models/terminal-config.model';

@Injectable()
export class TerminalConfigHttpRepository implements TerminalConfigRepository {
  private readonly http = inject(HttpClient);

  getAll(filter?: TerminalConfigFilter): Observable<TerminalConfig[]> {
    let params = new HttpParams();
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    if (filter?.portId != null) {
      params = params.set('portId', filter.portId);
    }
    return this.http.get<TerminalConfig[]>(`${environment.apiUrl}/terminals`, { params });
  }

  create(input: TerminalConfigInput): Observable<TerminalConfig> {
    return this.http.post<TerminalConfig>(`${environment.apiUrl}/terminals`, input);
  }

  update(id: number, input: TerminalConfigInput): Observable<TerminalConfig> {
    return this.http.put<TerminalConfig>(`${environment.apiUrl}/terminals/${id}`, input);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/terminals/${id}`);
  }
}
