import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AREA_REPOSITORY } from '../repositories/area.repository';
import { Area } from '../models/area.model';

@Injectable()
export class AreaService {
  private readonly repo = inject(AREA_REPOSITORY);

  readonly areas = toSignal(this.repo.getAll(), { initialValue: [] as Area[] });
}
