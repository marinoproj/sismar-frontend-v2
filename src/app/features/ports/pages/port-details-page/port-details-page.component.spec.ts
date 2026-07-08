import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { PortDetailsPageComponent } from './port-details-page.component';
import { PortsService } from '../../services/ports.service';
import { AuthService } from '../../../../core/auth/auth.service';

describe('PortDetailsPageComponent', () => {
  let loadDetails: jest.Mock;
  let paramMap$: Subject<ReturnType<typeof convertToParamMap>>;

  beforeEach(() => {
    loadDetails = jest.fn();
    paramMap$ = new Subject();

    TestBed.configureTestingModule({
      imports: [PortDetailsPageComponent],
      providers: [
        { provide: PortsService, useValue: { loadDetails, details: () => null } },
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } },
        { provide: AuthService, useValue: { hasFeature: () => true } },
      ],
    });
  });

  it('loads the details for the id present when the component is created', () => {
    TestBed.createComponent(PortDetailsPageComponent);
    paramMap$.next(convertToParamMap({ id: '1' }));

    expect(loadDetails).toHaveBeenCalledWith(1);
  });

  it('reloads when the route param changes, without needing to destroy/recreate the component', () => {
    TestBed.createComponent(PortDetailsPageComponent);

    paramMap$.next(convertToParamMap({ id: '1' }));
    expect(loadDetails).toHaveBeenCalledWith(1);

    paramMap$.next(convertToParamMap({ id: '2' }));
    expect(loadDetails).toHaveBeenCalledWith(2);
    expect(loadDetails).toHaveBeenCalledTimes(2);
  });
});
