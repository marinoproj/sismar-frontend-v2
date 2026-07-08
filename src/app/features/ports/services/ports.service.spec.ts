import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { PortsService } from './ports.service';
import { PORTS_REPOSITORY } from '../repositories/ports.repository';
import { PortDetails, PortSummary } from '../models/port.model';

describe('PortsService', () => {
  let getSummary: jest.Mock;
  let getDetails: jest.Mock;

  const summary: PortSummary[] = [
    { id: 1, name: 'Porto de Santos', imagePort: '', country: 'Brasil', countryFlag: '', shipsInPort: 3, lastEquipmentUpdate: null },
  ];

  function setup() {
    TestBed.configureTestingModule({
      providers: [PortsService, { provide: PORTS_REPOSITORY, useValue: { getSummary, getDetails } }],
    });
    return TestBed.inject(PortsService);
  }

  beforeEach(() => {
    getSummary = jest.fn().mockReturnValue(of(summary));
    getDetails = jest.fn().mockReturnValue(of({} as PortDetails));
  });

  it('loads the summary on init', () => {
    const service = setup();
    expect(service.summary()).toEqual(summary);
  });

  it('tracks summaryLoading: true until the request resolves, then false', () => {
    const request$ = new Subject<PortSummary[]>();
    getSummary.mockReturnValue(request$.asObservable());
    const service = setup();

    expect(service.summaryLoading()).toBe(true);

    request$.next(summary);
    request$.complete();

    expect(service.summaryLoading()).toBe(false);
  });

  it('sets summaryLoading back to false when the request fails', () => {
    const request$ = new Subject<PortSummary[]>();
    getSummary.mockReturnValue(request$.asObservable());
    const service = setup();

    expect(service.summaryLoading()).toBe(true);

    request$.error(new Error('falhou'));

    expect(service.summaryLoading()).toBe(false);
  });

  describe('loadDetails', () => {
    it('loads the details of a port', () => {
      const details = { portInfo: { id: 1 } } as unknown as PortDetails;
      getDetails.mockReturnValue(of(details));
      const service = setup();

      service.loadDetails(1);

      expect(getDetails).toHaveBeenCalledWith(1);
      expect(service.details()).toEqual(details);
    });

    it('tracks detailsLoading: true while the request is in flight, false once it resolves', () => {
      const request$ = new Subject<PortDetails>();
      getDetails.mockReturnValue(request$.asObservable());
      const service = setup();

      service.loadDetails(1);
      expect(service.detailsLoading()).toBe(true);

      request$.next({} as PortDetails);
      request$.complete();

      expect(service.detailsLoading()).toBe(false);
    });

    it('resets details to null as soon as a new load starts, so the previous port never leaks through', () => {
      const firstPort = { portInfo: { id: 1, name: 'Porto A' } } as unknown as PortDetails;
      getDetails.mockReturnValue(of(firstPort));
      const service = setup();
      service.loadDetails(1);
      expect(service.details()).toEqual(firstPort);

      const request$ = new Subject<PortDetails>();
      getDetails.mockReturnValue(request$.asObservable());
      service.loadDetails(2);

      expect(service.details()).toBeNull();

      const secondPort = { portInfo: { id: 2, name: 'Porto B' } } as unknown as PortDetails;
      request$.next(secondPort);
      request$.complete();

      expect(service.details()).toEqual(secondPort);
    });
  });
});
