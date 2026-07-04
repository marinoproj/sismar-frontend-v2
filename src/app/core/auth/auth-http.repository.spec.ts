import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthHttpRepository } from './auth-http.repository';
import { environment } from '../../../environments/environment';

describe('AuthHttpRepository', () => {
  let repo: AuthHttpRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthHttpRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repo = TestBed.inject(AuthHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('posts credentials to /auth/clients', () => {
    repo.getClients({ username: 'joao', password: 'x' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/clients`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'joao', password: 'x' });
    req.flush([]);
  });

  it('posts credentials and the clientCode header to /auth/login', () => {
    repo.login({ username: 'joao', password: 'x' }, 'SANTOS').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'joao', password: 'x' });
    expect(req.request.headers.get('clientCode')).toBe('SANTOS');
    req.flush({});
  });

  it('posts to /auth/logout', () => {
    repo.logout().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });
});
