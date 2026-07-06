import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BerthConfigHttpRepository } from './berth-config-http.repository';
import { environment } from '../../../../../environments/environment';

describe('BerthConfigHttpRepository', () => {
  let repo: BerthConfigHttpRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BerthConfigHttpRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repo = TestBed.inject(BerthConfigHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches all berths without filter', () => {
    repo.getAll().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/berths`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('fetches berths filtered by name', () => {
    repo.getAll({ name: 'leste' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/berths?name=leste`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('creates a berth', () => {
    const input = { name: 'Berço 01 Leste', terminalId: 1, areaId: 6, length: 350.5, draft: 12.8 };
    repo.create(input).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/berths`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('updates a berth', () => {
    const input = { name: 'Berço 01 Leste', terminalId: 1, areaId: 6, length: 350.5, draft: 12.8 };
    repo.update(10, input).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/berths/10`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('deletes a berth', () => {
    repo.delete(10).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/berths/10`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
