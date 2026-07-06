import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PortAreaConfigHttpRepository } from './port-area-config-http.repository';
import { environment } from '../../../../../environments/environment';
import { PortAreaConfigInput } from '../models/port-area-config.model';

describe('PortAreaConfigHttpRepository', () => {
  let repo: PortAreaConfigHttpRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortAreaConfigHttpRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repo = TestBed.inject(PortAreaConfigHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches the area configuration of a port', () => {
    repo.get(1).subscribe((config) => {
      expect(config).toEqual({ anchorageAreas: [], accessChannelArea: null, portArea: null });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/ports/1/config`);
    expect(req.request.method).toBe('GET');
    req.flush({ anchorageAreas: [], accessChannelArea: null, portArea: null });
  });

  it('updates the area configuration of a port', () => {
    const input: PortAreaConfigInput = { anchorageAreaIds: [2, 3], accessChannelAreaId: 4, portAreaId: 5 };
    repo.update(1, input).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/ports/1/config`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(input);
    req.flush(input);
  });
});
