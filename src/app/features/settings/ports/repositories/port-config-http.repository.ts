import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PortConfigRepository } from './port-config.repository';
import { PortConfig, PortConfigFilter, PortConfigInput } from '../models/port-config.model';

@Injectable()
export class PortConfigHttpRepository implements PortConfigRepository {
  private readonly http = inject(HttpClient);

  getAll(filter?: PortConfigFilter): Observable<PortConfig[]> {
    let params = new HttpParams();
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    return this.http.get<PortConfig[]>(`${environment.apiUrl}/ports`, { params });
  }

  create(input: PortConfigInput): Observable<PortConfig> {
    return this.http.post<PortConfig>(`${environment.apiUrl}/ports`, input);
  }

  update(id: number, input: PortConfigInput): Observable<PortConfig> {
    return this.http.put<PortConfig>(`${environment.apiUrl}/ports/${id}`, input);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ports/${id}`);
  }
}
