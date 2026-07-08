import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { TerminalConfig } from '../models/terminal-config.model';
import { TerminalConfigService } from './terminal-config.service';
import { TERMINAL_CONFIG_REPOSITORY } from '../repositories/terminal-config.repository';
import { TerminalConfigInput } from '../models/terminal-config.model';

describe('TerminalConfigService', () => {
  let getAll: jest.Mock;
  let create: jest.Mock;
  let update: jest.Mock;
  let deleteFn: jest.Mock;

  beforeEach(() => {
    getAll = jest.fn().mockReturnValue(of([]));
    create = jest.fn().mockReturnValue(of({}));
    update = jest.fn().mockReturnValue(of({}));
    deleteFn = jest.fn().mockReturnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        TerminalConfigService,
        { provide: TERMINAL_CONFIG_REPOSITORY, useValue: { getAll, create, update, delete: deleteFn } },
      ],
    });
  });

  it('loads all terminals on init', fakeAsync(() => {
    TestBed.inject(TerminalConfigService);
    tick(300);

    expect(getAll).toHaveBeenCalledWith({});
  }));

  it('debounces search by name', fakeAsync(() => {
    const service = TestBed.inject(TerminalConfigService);
    tick(300);
    getAll.mockClear();

    service.search('  contentores  ');
    tick(299);
    expect(getAll).not.toHaveBeenCalled();

    tick(1);
    expect(getAll).toHaveBeenCalledWith({ name: 'contentores' });
  }));

  it('filters by port immediately, without debounce', fakeAsync(() => {
    const service = TestBed.inject(TerminalConfigService);
    tick(300);
    getAll.mockClear();

    service.filterByPort(1);
    tick(0);
    expect(getAll).toHaveBeenCalledWith({ portId: 1 });
  }));

  it('combines name and port filters', fakeAsync(() => {
    const service = TestBed.inject(TerminalConfigService);
    tick(300);
    getAll.mockClear();

    service.filterByPort(1);
    service.search('contentores');
    tick(300);

    expect(getAll).toHaveBeenCalledWith({ name: 'contentores', portId: 1 });
  }));

  it('reloads the list after creating a terminal', fakeAsync(() => {
    const service = TestBed.inject(TerminalConfigService);
    tick(300);
    getAll.mockClear();

    const input: TerminalConfigInput = { name: 'T2', code: 'TC2', terminalType: 'CONTAINER', portId: 1 };
    service.create(input).subscribe();

    expect(create).toHaveBeenCalledWith(input);
    expect(getAll).toHaveBeenCalledTimes(1);
  }));

  it('reloads the list after updating a terminal', fakeAsync(() => {
    const service = TestBed.inject(TerminalConfigService);
    tick(300);
    getAll.mockClear();

    const input: TerminalConfigInput = { name: 'T2 renomeado', code: 'TC2', terminalType: 'CONTAINER', portId: 1 };
    service.update(5, input).subscribe();

    expect(update).toHaveBeenCalledWith(5, input);
    expect(getAll).toHaveBeenCalledTimes(1);
  }));

  it('reloads the list after deleting a terminal', fakeAsync(() => {
    const service = TestBed.inject(TerminalConfigService);
    tick(300);
    getAll.mockClear();

    service.delete(5).subscribe();

    expect(deleteFn).toHaveBeenCalledWith(5);
    expect(getAll).toHaveBeenCalledTimes(1);
  }));

  it('tracks loading independently of the data, true while the request is in flight and false once it resolves', fakeAsync(() => {
    const request$ = new Subject<TerminalConfig[]>();
    getAll.mockReturnValue(request$.asObservable());
    const service = TestBed.inject(TerminalConfigService);
    tick(300);

    expect(service.loading()).toBe(true);

    request$.next([]);
    request$.complete();

    expect(service.loading()).toBe(false);
  }));

  it('sets loading back to false when the request fails', fakeAsync(() => {
    const request$ = new Subject<TerminalConfig[]>();
    getAll.mockReturnValue(request$.asObservable());
    const service = TestBed.inject(TerminalConfigService);
    tick(300);

    expect(service.loading()).toBe(true);

    request$.error(new Error('falhou'));

    expect(service.loading()).toBe(false);
  }));
});
