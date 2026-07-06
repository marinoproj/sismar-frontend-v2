import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../services/toast.service';
import { SKIP_ERROR_TOAST } from './skip-error-toast.context';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let clearLocalSession: jest.Mock;
  let toastShow: jest.Mock;
  let router: Router;

  beforeEach(() => {
    clearLocalSession = jest.fn();
    toastShow = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: { clearLocalSession } },
        { provide: ToastService, useValue: { show: toastShow } },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => httpMock.verify());

  it('clears the local session and navigates to /login on 401 from a protected endpoint', () => {
    http.get('/ports').subscribe({ error: () => {} });

    httpMock
      .expectOne('/ports')
      .flush({ message: 'Token expirado.' }, { status: 401, statusText: 'Unauthorized' });

    expect(clearLocalSession).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(toastShow).not.toHaveBeenCalled();
  });

  it('shows a toast with the backend message on other errors', () => {
    http.get('/ports').subscribe({ error: () => {} });

    httpMock
      .expectOne('/ports')
      .flush({ message: 'Port 1 not found' }, { status: 404, statusText: 'Not Found' });

    expect(toastShow).toHaveBeenCalledWith({ message: 'Port 1 not found', type: 'error' });
    expect(clearLocalSession).not.toHaveBeenCalled();
  });

  it('shows a generic message when the backend does not provide one', () => {
    http.get('/ports').subscribe({ error: () => {} });

    httpMock.expectOne('/ports').flush(null, { status: 500, statusText: 'Server Error' });

    expect(toastShow).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', message: expect.any(String) }),
    );
  });

  it('does not show a toast when the request is marked with SKIP_ERROR_TOAST', () => {
    http
      .get('/area/6/retroactive-jobs/last', { context: new HttpContext().set(SKIP_ERROR_TOAST, true) })
      .subscribe({ error: () => {} });

    httpMock.expectOne('/area/6/retroactive-jobs/last').flush('not found', { status: 404, statusText: 'Not Found' });

    expect(toastShow).not.toHaveBeenCalled();
  });

  it('does not redirect on 401 from /auth/login, but still shows a toast', () => {
    http.post('/auth/login', {}).subscribe({ error: () => {} });

    httpMock
      .expectOne('/auth/login')
      .flush({ message: 'Usuário ou senha inválidos' }, { status: 401, statusText: 'Unauthorized' });

    expect(clearLocalSession).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastShow).toHaveBeenCalledWith({ message: 'Usuário ou senha inválidos', type: 'error' });
  });
});
