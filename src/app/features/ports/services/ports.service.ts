import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { PORTS_REPOSITORY } from '../repositories/ports.repository';
import { PortDetails } from '../models/port.model';

@Injectable()
export class PortsService {
  private readonly repo = inject(PORTS_REPOSITORY);

  private readonly summaryLoadingSignal = signal(true);
  readonly summaryLoading = this.summaryLoadingSignal.asReadonly();

  readonly summary = toSignal(
    this.repo.getSummary().pipe(finalize(() => this.summaryLoadingSignal.set(false))),
  );

  readonly details = signal<PortDetails | null>(null);

  private readonly detailsLoadingSignal = signal(false);
  readonly detailsLoading = this.detailsLoadingSignal.asReadonly();

  loadDetails(id: number): void {
    this.details.set(null);
    this.detailsLoadingSignal.set(true);
    this.repo
      .getDetails(id)
      .pipe(finalize(() => this.detailsLoadingSignal.set(false)))
      .subscribe((details) => this.details.set(details));
  }
}
