import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DASHBOARD_REPOSITORY } from '../repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  private readonly repo = inject(DASHBOARD_REPOSITORY);

  readonly summary = toSignal(this.repo.getSummary());
}
