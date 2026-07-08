import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs/operators';
import { TERMINAL_CONFIG_REPOSITORY } from '../repositories/terminal-config.repository';
import { TerminalConfig, TerminalConfigInput } from '../models/terminal-config.model';

@Injectable()
export class TerminalConfigService {
  private readonly repo = inject(TERMINAL_CONFIG_REPOSITORY);

  private readonly nameTerm$ = new BehaviorSubject<string>('');
  private readonly portId$ = new BehaviorSubject<number | null>(null);
  private readonly reload$ = new Subject<void>();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  readonly terminals = toSignal(
    merge(
      combineLatest([
        this.nameTerm$.pipe(debounceTime(300), distinctUntilChanged()),
        this.portId$.pipe(distinctUntilChanged()),
      ]),
      this.reload$.pipe(map((): [string, number | null] => [this.nameTerm$.value, this.portId$.value])),
    ).pipe(
      switchMap(([name, portId]) => {
        this.loadingSignal.set(true);
        return this.repo
          .getAll({
            ...(name ? { name } : {}),
            ...(portId != null ? { portId } : {}),
          })
          .pipe(finalize(() => this.loadingSignal.set(false)));
      }),
    ),
    { initialValue: [] as TerminalConfig[] },
  );

  search(term: string): void {
    this.nameTerm$.next(term.trim());
  }

  filterByPort(portId: number | null): void {
    this.portId$.next(portId);
  }

  create(input: TerminalConfigInput): Observable<TerminalConfig> {
    return this.repo.create(input).pipe(tap(() => this.reload$.next()));
  }

  update(id: number, input: TerminalConfigInput): Observable<TerminalConfig> {
    return this.repo.update(id, input).pipe(tap(() => this.reload$.next()));
  }

  delete(id: number): Observable<void> {
    return this.repo.delete(id).pipe(tap(() => this.reload$.next()));
  }
}
