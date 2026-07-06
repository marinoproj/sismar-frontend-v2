import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TerminalConfigHttpRepository } from './terminal-config-http.repository';
import { environment } from '../../../../../environments/environment';

describe('TerminalConfigHttpRepository', () => {
  let repo: TerminalConfigHttpRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerminalConfigHttpRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repo = TestBed.inject(TerminalConfigHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches all terminals without filter', () => {
    repo.getAll().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/terminals`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('fetches terminals filtered by name', () => {
    repo.getAll({ name: 'conte' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/terminals?name=conte`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('fetches terminals filtered by portId', () => {
    repo.getAll({ portId: 1 }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/terminals?portId=1`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('fetches terminals filtered by name and portId combined', () => {
    repo.getAll({ portId: 1, name: 'conte' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/terminals?name=conte&portId=1`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('creates a terminal', () => {
    const input = { name: 'T2', code: 'TC2', terminalType: 'CONTAINER', portId: 1 };
    repo.create(input).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/terminals`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('updates a terminal', () => {
    const input = { name: 'T2', code: 'TC2', terminalType: 'CONTAINER', portId: 1 };
    repo.update(5, input).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/terminals/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('deletes a terminal', () => {
    repo.delete(5).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/terminals/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
