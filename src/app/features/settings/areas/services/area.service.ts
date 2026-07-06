import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { AREA_REPOSITORY } from '../repositories/area.repository';
import { Area, AreaInput, RetroactiveJob, TriggerRetroactiveJobInput } from '../models/area.model';

@Injectable()
export class AreaService {
  private readonly repo = inject(AREA_REPOSITORY);

  private readonly searchTerm = signal('');
  private readonly reload$ = new Subject<void>();

  private readonly allAreas = toSignal(
    this.reload$.pipe(
      startWith(undefined),
      switchMap(() => this.repo.getAll()),
    ),
    { initialValue: [] as Area[] },
  );

  readonly areas = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.allAreas();
    return this.allAreas().filter((area) => area.name.toLowerCase().includes(term));
  });

  search(term: string): void {
    this.searchTerm.set(term);
  }

  create(input: AreaInput): Observable<Area> {
    return this.repo.create(input).pipe(tap(() => this.reload$.next()));
  }

  update(id: number, input: AreaInput): Observable<Area> {
    return this.repo.update(id, input).pipe(tap(() => this.reload$.next()));
  }

  activate(id: number): Observable<void> {
    return this.repo.activate(id).pipe(tap(() => this.reload$.next()));
  }

  deactivate(id: number): Observable<void> {
    return this.repo.deactivate(id).pipe(tap(() => this.reload$.next()));
  }

  delete(id: number): Observable<void> {
    return this.repo.delete(id).pipe(tap(() => this.reload$.next()));
  }

  getLastRetroactiveJob(id: number): Observable<RetroactiveJob | null> {
    return this.repo.getLastRetroactiveJob(id);
  }

  triggerRetroactiveJob(id: number, input: TriggerRetroactiveJobInput): Observable<void> {
    return this.repo.triggerRetroactiveJob(id, input);
  }

  cancelRetroactiveJob(id: number): Observable<void> {
    return this.repo.cancelRetroactiveJob(id);
  }
}
