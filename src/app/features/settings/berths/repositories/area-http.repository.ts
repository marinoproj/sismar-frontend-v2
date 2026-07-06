import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AreaRepository } from './area.repository';
import { Area } from '../models/area.model';

@Injectable()
export class AreaHttpRepository implements AreaRepository {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiUrl}/area`);
  }
}
