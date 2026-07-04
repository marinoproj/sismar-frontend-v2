import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PortDetails, PortSummary } from '../models/port.model';

export abstract class PortsRepository {
  abstract getSummary(): Observable<PortSummary[]>;
  abstract getDetails(id: number): Observable<PortDetails>;
}

export const PORTS_REPOSITORY = new InjectionToken<PortsRepository>('PORTS_REPOSITORY');
