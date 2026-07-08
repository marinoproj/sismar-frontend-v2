import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs/operators';
import { BERTH_CONFIG_REPOSITORY } from '../repositories/berth-config.repository';
import { BerthConfig, BerthConfigInput } from '../models/berth-config.model';

@Injectable()
export class BerthConfigService {
  private readonly repo = inject(BERTH_CONFIG_REPOSITORY);

  private readonly searchTerm$ = new BehaviorSubject<string>('');
  private readonly reload$ = new Subject<void>();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  readonly berths = toSignal(
    merge(
      this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
      this.reload$.pipe(map(() => this.searchTerm$.value)),
    ).pipe(
      switchMap((name) => {
        this.loadingSignal.set(true);
        return this.repo.getAll(name ? { name } : undefined).pipe(finalize(() => this.loadingSignal.set(false)));
      }),
    ),
    { initialValue: [] as BerthConfig[] },
  );

  search(term: string): void {
    this.searchTerm$.next(term.trim());
  }

  create(input: BerthConfigInput): Observable<BerthConfig> {
    return this.repo.create(input).pipe(tap(() => this.reload$.next()));
  }

  update(id: number, input: BerthConfigInput): Observable<BerthConfig> {
    return this.repo.update(id, input).pipe(tap(() => this.reload$.next()));
  }

  delete(id: number): Observable<void> {
    return this.repo.delete(id).pipe(tap(() => this.reload$.next()));
  }
}
