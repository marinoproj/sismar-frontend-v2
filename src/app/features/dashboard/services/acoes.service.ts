import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ACOES_REPOSITORY } from '../repositories/acoes.repository';

@Injectable()
export class AcoesService {
  private readonly repo = inject(ACOES_REPOSITORY);
  readonly summary = toSignal(this.repo.getSummary());
}
