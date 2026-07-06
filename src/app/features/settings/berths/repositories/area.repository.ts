import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Area } from '../models/area.model';

export abstract class AreaRepository {
  abstract getAll(): Observable<Area[]>;
}

export const AREA_REPOSITORY = new InjectionToken<AreaRepository>('AREA_REPOSITORY');
