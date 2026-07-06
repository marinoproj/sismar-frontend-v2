import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TerminalConfig, TerminalConfigFilter, TerminalConfigInput } from '../models/terminal-config.model';

export abstract class TerminalConfigRepository {
  abstract getAll(filter?: TerminalConfigFilter): Observable<TerminalConfig[]>;
  abstract create(input: TerminalConfigInput): Observable<TerminalConfig>;
  abstract update(id: number, input: TerminalConfigInput): Observable<TerminalConfig>;
  abstract delete(id: number): Observable<void>;
}

export const TERMINAL_CONFIG_REPOSITORY = new InjectionToken<TerminalConfigRepository>(
  'TERMINAL_CONFIG_REPOSITORY',
);
