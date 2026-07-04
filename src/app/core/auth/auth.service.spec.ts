import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AUTH_REPOSITORY, AuthRepository } from './auth.repository';
import { AuthSession } from './session.model';

function buildSession(overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    accessToken: 'token-123',
    userId: 1,
    name: 'João Silva',
    superUser: false,
    profile: { id: 1, name: 'Operacional', description: '', master: false, dhCreate: '' },
    clientId: 1,
    client: {
      id: 1,
      code: 'SANTOS',
      name: 'Porto de Santos',
      dhCreate: '',
      dhDeleted: null,
      enableAreaNotifications: true,
    },
    features: ['PORT_VIEW'],
    ...overrides,
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let repo: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    localStorage.clear();
    repo = {
      getClients: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: AUTH_REPOSITORY, useValue: repo }],
    });

    service = TestBed.inject(AuthService);
  });

  it('starts unauthenticated when there is no stored session', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
  });

  it('populates and persists the session on successful login', () => {
    const session = buildSession();
    repo.login.mockReturnValue(of(session));

    service.login({ username: 'joao', password: 'x' }, 'SANTOS').subscribe();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).toBe('token-123');
    expect(JSON.parse(localStorage.getItem('auth-session')!)).toEqual(session);
  });

  it('hasFeature reflects the features array, with no bypass for superUser', () => {
    repo.login.mockReturnValue(of(buildSession({ superUser: true, features: [] })));

    service.login({ username: 'joao', password: 'x' }, 'SANTOS').subscribe();

    expect(service.hasFeature('PORT_VIEW')).toBe(false);
  });

  it('logout calls the backend and clears the local session even if the call fails', () => {
    repo.login.mockReturnValue(of(buildSession()));
    service.login({ username: 'joao', password: 'x' }, 'SANTOS').subscribe();
    repo.logout.mockReturnValue(throwError(() => new Error('network error')));

    service.logout();

    expect(repo.logout).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('auth-session')).toBeNull();
  });

  it('clearLocalSession clears the session without calling the repository', () => {
    repo.login.mockReturnValue(of(buildSession()));
    service.login({ username: 'joao', password: 'x' }, 'SANTOS').subscribe();

    service.clearLocalSession();

    expect(repo.logout).not.toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(false);
  });
});
