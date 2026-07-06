import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PortConfigHttpRepository } from './port-config-http.repository';
import { environment } from '../../../../../environments/environment';

describe('PortConfigHttpRepository', () => {
  let repo: PortConfigHttpRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortConfigHttpRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repo = TestBed.inject(PortConfigHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches all ports without filter', () => {
    repo.getAll().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/ports`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('name')).toBe(false);
    req.flush([]);
  });

  it('fetches ports filtered by name', () => {
    repo.getAll({ name: 'santos' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/ports?name=santos`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('creates a port', () => {
    const input = { name: 'Porto de Santos', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };
    repo.create(input).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/ports`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('updates a port', () => {
    const input = { name: 'Porto de Santos', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };
    repo.update(1, input).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/ports/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('deletes a port', () => {
    repo.delete(1).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/ports/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
