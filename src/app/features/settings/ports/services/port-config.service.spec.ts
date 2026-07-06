import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { PortConfigService } from './port-config.service';
import { PORT_CONFIG_REPOSITORY } from '../repositories/port-config.repository';
import { PortConfig, PortConfigInput } from '../models/port-config.model';

describe('PortConfigService', () => {
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
        PortConfigService,
        { provide: PORT_CONFIG_REPOSITORY, useValue: { getAll, create, update, delete: deleteFn } },
      ],
    });
  });

  it('loads all ports on init', fakeAsync(() => {
    TestBed.inject(PortConfigService);
    tick(300);

    expect(getAll).toHaveBeenCalledWith(undefined);
  }));

  it('debounces search and calls the repository with the trimmed term', fakeAsync(() => {
    const results: PortConfig[] = [{ id: 1, name: 'Porto de Santos', imagePort: '', countryFlag: '', country: 'Brasil' }];
    getAll.mockReturnValue(of(results));
    const service = TestBed.inject(PortConfigService);

    service.search('  santos  ');
    tick(299);
    expect(getAll).not.toHaveBeenCalledWith({ name: 'santos' });

    tick(1);
    expect(getAll).toHaveBeenCalledWith({ name: 'santos' });
    expect(service.ports()).toEqual(results);
  }));

  it('reloads the list after creating a port', fakeAsync(() => {
    const service = TestBed.inject(PortConfigService);
    tick(300);
    getAll.mockClear();

    const input: PortConfigInput = { name: 'Novo porto', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };
    service.create(input).subscribe();

    expect(create).toHaveBeenCalledWith(input);
    expect(getAll).toHaveBeenCalledTimes(1);
  }));

  it('reloads the list after updating a port', fakeAsync(() => {
    const service = TestBed.inject(PortConfigService);
    tick(300);
    getAll.mockClear();

    const input: PortConfigInput = { name: 'Porto atualizado', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };
    service.update(1, input).subscribe();

    expect(update).toHaveBeenCalledWith(1, input);
    expect(getAll).toHaveBeenCalledTimes(1);
  }));

  it('reloads the list after deleting a port', fakeAsync(() => {
    const service = TestBed.inject(PortConfigService);
    tick(300);
    getAll.mockClear();

    service.delete(1).subscribe();

    expect(deleteFn).toHaveBeenCalledWith(1);
    expect(getAll).toHaveBeenCalledTimes(1);
  }));
});
