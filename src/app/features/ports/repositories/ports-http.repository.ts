import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PortsRepository } from './ports.repository';
import { PortDetails, PortSummary } from '../models/port.model';

@Injectable()
export class PortsHttpRepository implements PortsRepository {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<PortSummary[]> {
    return this.http.get<PortSummary[]>(`${environment.apiUrl}/ports/summary`);
  }

  getDetails(id: number): Observable<PortDetails> {
    return this.http.get<PortDetails>(`${environment.apiUrl}/ports/${id}/details`);
  }
}
