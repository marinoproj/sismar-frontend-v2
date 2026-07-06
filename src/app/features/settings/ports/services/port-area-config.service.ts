import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PORT_AREA_CONFIG_REPOSITORY } from '../repositories/port-area-config.repository';
import { PortAreaConfigDetail, PortAreaConfigInput } from '../models/port-area-config.model';

@Injectable()
export class PortAreaConfigService {
  private readonly repo = inject(PORT_AREA_CONFIG_REPOSITORY);

  get(portId: number): Observable<PortAreaConfigDetail> {
    return this.repo.get(portId);
  }

  update(portId: number, input: PortAreaConfigInput): Observable<PortAreaConfigInput> {
    return this.repo.update(portId, input);
  }
}
