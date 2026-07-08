import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { BerthConfig } from '../models/berth-config.model';
import { BerthConfigService } from './berth-config.service';
import { BERTH_CONFIG_REPOSITORY } from '../repositories/berth-config.repository';
import { BerthConfigInput } from '../models/berth-config.model';

describe('BerthConfigService', () => {
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
        BerthConfigService,
        { provide: BERTH_CONFIG_REPOSITORY, useValue: { getAll, create, update, delete: deleteFn } },
      ],
    });
  });

  it('loads all berths on init', fakeAsync(() => {
    TestBed.inject(BerthConfigService);
    tick(300);

    expect(getAll).toHaveBeenCalledWith(undefined);
  }));

  it('debounces search and calls the repository with the trimmed term', fakeAsync(() => {
    const service = TestBed.inject(BerthConfigService);
    tick(300);
    getAll.mockClear();

    service.search('  leste  ');
    tick(299);
    expect(getAll).not.toHaveBeenCalled();

    tick(1);
    expect(getAll).toHaveBeenCalledWith({ name: 'leste' });
  }));

  it('reloads the list after creating a berth', fakeAsync(() => {
    const service = TestBed.inject(BerthConfigService);
    tick(300);
    getAll.mockClear();

    const input: BerthConfigInput = { name: 'Berço 01 Leste', terminalId: 1, areaId: 6, length: 350.5, draft: 12.8 };
    service.create(input).subscribe();

    expect(create).toHaveBeenCalledWith(input);
    expect(getAll).toHaveBeenCalledTimes(1);
  }));

  it('reloads the list after updating a berth', fakeAsync(() => {
    const service = TestBed.inject(BerthConfigService);
    tick(300);
    getAll.mockClear();

    const input: BerthConfigInput = { name: 'Berço 01 Leste', terminalId: 1, areaId: 6, length: 350.5, draft: 12.8 };
    service.update(10, input).subscribe();

    expect(update).toHaveBeenCalledWith(10, input);
    expect(getAll).toHaveBeenCalledTimes(1);
  }));

  it('reloads the list after deleting a berth', fakeAsync(() => {
    const service = TestBed.inject(BerthConfigService);
    tick(300);
    getAll.mockClear();

    service.delete(10).subscribe();

    expect(deleteFn).toHaveBeenCalledWith(10);
    expect(getAll).toHaveBeenCalledTimes(1);
  }));

  it('tracks loading independently of the data, true while the request is in flight and false once it resolves', fakeAsync(() => {
    const request$ = new Subject<BerthConfig[]>();
    getAll.mockReturnValue(request$.asObservable());
    const service = TestBed.inject(BerthConfigService);
    tick(300);

    expect(service.loading()).toBe(true);

    request$.next([]);
    request$.complete();

    expect(service.loading()).toBe(false);
  }));

  it('sets loading back to false when the request fails', fakeAsync(() => {
    const request$ = new Subject<BerthConfig[]>();
    getAll.mockReturnValue(request$.asObservable());
    const service = TestBed.inject(BerthConfigService);
    tick(300);

    expect(service.loading()).toBe(true);

    request$.error(new Error('falhou'));

    expect(service.loading()).toBe(false);
  }));
});
