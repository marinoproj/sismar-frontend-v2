import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PortAreaConfigDetail, PortAreaConfigInput } from '../models/port-area-config.model';

export abstract class PortAreaConfigRepository {
  abstract get(portId: number): Observable<PortAreaConfigDetail>;
  abstract update(portId: number, input: PortAreaConfigInput): Observable<PortAreaConfigInput>;
}

export const PORT_AREA_CONFIG_REPOSITORY = new InjectionToken<PortAreaConfigRepository>(
  'PORT_AREA_CONFIG_REPOSITORY',
);
