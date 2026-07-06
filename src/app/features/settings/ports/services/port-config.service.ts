import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { PORT_CONFIG_REPOSITORY } from '../repositories/port-config.repository';
import { PortConfig, PortConfigInput } from '../models/port-config.model';

@Injectable()
export class PortConfigService {
  private readonly repo = inject(PORT_CONFIG_REPOSITORY);

  private readonly searchTerm$ = new BehaviorSubject<string>('');
  private readonly reload$ = new Subject<void>();

  readonly ports = toSignal(
    merge(
      this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
      this.reload$.pipe(map(() => this.searchTerm$.value)),
    ).pipe(switchMap((name) => this.repo.getAll(name ? { name } : undefined))),
    { initialValue: [] as PortConfig[] },
  );

  search(term: string): void {
    this.searchTerm$.next(term.trim());
  }

  create(input: PortConfigInput): Observable<PortConfig> {
    return this.repo.create(input).pipe(tap(() => this.reload$.next()));
  }

  update(id: number, input: PortConfigInput): Observable<PortConfig> {
    return this.repo.update(id, input).pipe(tap(() => this.reload$.next()));
  }

  delete(id: number): Observable<void> {
    return this.repo.delete(id).pipe(tap(() => this.reload$.next()));
  }
}
