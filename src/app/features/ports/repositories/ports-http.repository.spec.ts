import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PortsHttpRepository } from './ports-http.repository';
import { environment } from '../../../../environments/environment';

describe('PortsHttpRepository', () => {
  let repo: PortsHttpRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortsHttpRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repo = TestBed.inject(PortsHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches the ports summary', () => {
    repo.getSummary().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/ports/summary`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('fetches the details of a specific port', () => {
    repo.getDetails(1).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/ports/1/details`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
