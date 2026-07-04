import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PORTS_REPOSITORY } from '../repositories/ports.repository';
import { PortDetails } from '../models/port.model';

@Injectable()
export class PortsService {
  private readonly repo = inject(PORTS_REPOSITORY);

  readonly summary = toSignal(this.repo.getSummary());

  readonly details = signal<PortDetails | null>(null);

  loadDetails(id: number): void {
    this.repo.getDetails(id).subscribe((details) => this.details.set(details));
  }
}
