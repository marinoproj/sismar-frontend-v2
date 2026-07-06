import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PortConfig, PortConfigFilter, PortConfigInput } from '../models/port-config.model';

export abstract class PortConfigRepository {
  abstract getAll(filter?: PortConfigFilter): Observable<PortConfig[]>;
  abstract create(input: PortConfigInput): Observable<PortConfig>;
  abstract update(id: number, input: PortConfigInput): Observable<PortConfig>;
  abstract delete(id: number): Observable<void>;
}

export const PORT_CONFIG_REPOSITORY = new InjectionToken<PortConfigRepository>('PORT_CONFIG_REPOSITORY');
