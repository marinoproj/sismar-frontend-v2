import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AcoesSummary } from '../models/acoes.model';

export abstract class AcoesRepository {
  abstract getSummary(): Observable<AcoesSummary>;
}

export const ACOES_REPOSITORY = new InjectionToken<AcoesRepository>('ACOES_REPOSITORY');
