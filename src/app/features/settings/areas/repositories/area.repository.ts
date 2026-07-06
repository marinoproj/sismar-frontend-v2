import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Area, AreaInput, RetroactiveJob, TriggerRetroactiveJobInput } from '../models/area.model';

export abstract class AreaRepository {
  abstract getAll(): Observable<Area[]>;
  abstract create(input: AreaInput): Observable<Area>;
  abstract update(id: number, input: AreaInput): Observable<Area>;
  abstract activate(id: number): Observable<void>;
  abstract deactivate(id: number): Observable<void>;
  abstract delete(id: number): Observable<void>;
  abstract getLastRetroactiveJob(id: number): Observable<RetroactiveJob | null>;
  abstract triggerRetroactiveJob(id: number, input: TriggerRetroactiveJobInput): Observable<void>;
  abstract cancelRetroactiveJob(id: number): Observable<void>;
}

export const AREA_REPOSITORY = new InjectionToken<AreaRepository>('AREA_REPOSITORY');
