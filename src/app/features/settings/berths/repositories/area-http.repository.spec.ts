import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AreaHttpRepository } from './area-http.repository';
import { environment } from '../../../../../environments/environment';

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
});
