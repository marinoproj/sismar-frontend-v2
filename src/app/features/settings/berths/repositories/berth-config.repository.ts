import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { BerthConfig, BerthConfigFilter, BerthConfigInput } from '../models/berth-config.model';

export abstract class BerthConfigRepository {
  abstract getAll(filter?: BerthConfigFilter): Observable<BerthConfig[]>;
  abstract create(input: BerthConfigInput): Observable<BerthConfig>;
  abstract update(id: number, input: BerthConfigInput): Observable<BerthConfig>;
  abstract delete(id: number): Observable<void>;
}

export const BERTH_CONFIG_REPOSITORY = new InjectionToken<BerthConfigRepository>('BERTH_CONFIG_REPOSITORY');
