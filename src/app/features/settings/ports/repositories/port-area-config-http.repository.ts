import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PortAreaConfigRepository } from './port-area-config.repository';
import { PortAreaConfigDetail, PortAreaConfigInput } from '../models/port-area-config.model';

@Injectable()
export class PortAreaConfigHttpRepository implements PortAreaConfigRepository {
  private readonly http = inject(HttpClient);

  get(portId: number): Observable<PortAreaConfigDetail> {
    return this.http.get<PortAreaConfigDetail>(`${environment.apiUrl}/ports/${portId}/config`);
  }

  update(portId: number, input: PortAreaConfigInput): Observable<PortAreaConfigInput> {
    return this.http.put<PortAreaConfigInput>(`${environment.apiUrl}/ports/${portId}/config`, input);
  }
}
