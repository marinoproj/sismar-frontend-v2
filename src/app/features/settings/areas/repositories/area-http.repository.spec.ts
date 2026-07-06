import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AreaHttpRepository } from './area-http.repository';
import { environment } from '../../../../../environments/environment';
import { AreaInput } from '../models/area.model';
import { SKIP_ERROR_TOAST } from '../../../../core/interceptors/skip-error-toast.context';

describe('AreaHttpRepository', () => {
  let repo: AreaHttpRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AreaHttpRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repo = TestBed.inject(AreaHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches all areas', () => {
    repo.getAll().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/area`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('creates an area', () => {
    const input: AreaInput = {
      name: 'Fundeio Norte',
      coordinates: [
        { lat: -23.952, lon: -46.33 },
        { lat: -23.949, lon: -46.328 },
        { lat: -23.9505, lon: -46.325 },
        { lat: -23.952, lon: -46.33 },
      ],
      portId: 1,
    };
    repo.create(input).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/area`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('updates an area', () => {
    const input: AreaInput = {
      name: 'Fundeio Norte',
      coordinates: [
        { lat: -23.952, lon: -46.33 },
        { lat: -23.949, lon: -46.328 },
        { lat: -23.9505, lon: -46.325 },
        { lat: -23.952, lon: -46.33 },
      ],
      portId: 1,
    };
    repo.update(6, input).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/area/6`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('activates an area', () => {
    repo.activate(6).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/area/6/activate`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('deactivates an area', () => {
    repo.deactivate(6).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/area/6/deactivate`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('deletes an area', () => {
    repo.delete(6).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/area/6`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('fetches the last retroactive job', () => {
    repo.getLastRetroactiveJob(6).subscribe((job) => {
      expect(job).toEqual({ mode: 'FULL', status: 'DONE' });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/area/6/retroactive-jobs/last`);
    expect(req.request.method).toBe('GET');
    req.flush({ mode: 'FULL', status: 'DONE' });
  });

  it('maps a 404 on last retroactive job to null (nenhum job disparado ainda), without triggering the global error toast', () => {
    repo.getLastRetroactiveJob(6).subscribe((job) => {
      expect(job).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/area/6/retroactive-jobs/last`);
    expect(req.request.context.get(SKIP_ERROR_TOAST)).toBe(true);
    req.flush('not found', { status: 404, statusText: 'Not Found' });
  });

  it('propagates non-404 errors on last retroactive job', () => {
    let error: unknown;
    repo.getLastRetroactiveJob(6).subscribe({ error: (err) => (error = err) });

    const req = httpMock.expectOne(`${environment.apiUrl}/area/6/retroactive-jobs/last`);
    req.flush('server error', { status: 500, statusText: 'Internal Server Error' });

    expect(error).toBeTruthy();
  });

  it('triggers a retroactive job', () => {
    repo.triggerRetroactiveJob(6, { periodDays: 30 }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/area/6/retroactive-events`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ periodDays: 30 });
    req.flush(null);
  });

  it('cancels a retroactive job', () => {
    repo.cancelRetroactiveJob(6).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/area/6/retroactive-jobs/last/cancel`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });
});
