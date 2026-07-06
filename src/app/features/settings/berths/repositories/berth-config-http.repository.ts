import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BerthConfigRepository } from './berth-config.repository';
import { BerthConfig, BerthConfigFilter, BerthConfigInput } from '../models/berth-config.model';

@Injectable()
export class BerthConfigHttpRepository implements BerthConfigRepository {
  private readonly http = inject(HttpClient);

  getAll(filter?: BerthConfigFilter): Observable<BerthConfig[]> {
    let params = new HttpParams();
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    return this.http.get<BerthConfig[]>(`${environment.apiUrl}/berths`, { params });
  }

  create(input: BerthConfigInput): Observable<BerthConfig> {
    return this.http.post<BerthConfig>(`${environment.apiUrl}/berths`, input);
  }

  update(id: number, input: BerthConfigInput): Observable<BerthConfig> {
    return this.http.put<BerthConfig>(`${environment.apiUrl}/berths/${id}`, input);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/berths/${id}`);
  }
}
