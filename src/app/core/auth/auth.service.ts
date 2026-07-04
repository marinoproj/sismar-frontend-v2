import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthSession, ClientDTO } from './session.model';
import { AUTH_REPOSITORY, LoginCredentials } from './auth.repository';

const SESSION_KEY = 'auth-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly repo = inject(AUTH_REPOSITORY);

  readonly session = signal<AuthSession | null>(readStoredSession());
  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly token = computed(() => this.session()?.accessToken ?? null);

  getClients(credentials: LoginCredentials): Observable<ClientDTO[]> {
    return this.repo.getClients(credentials);
  }

  login(credentials: LoginCredentials, clientCode: string): Observable<AuthSession> {
    return this.repo.login(credentials, clientCode).pipe(
      tap((session) => this.setSession(session)),
    );
  }

  hasFeature(name: string): boolean {
    return this.session()?.features.includes(name) ?? false;
  }

  logout(): void {
    this.repo.logout().subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  // Não chama o backend: usado no 401, onde o token já é inválido/expirado (evita loop de retries).
  clearLocalSession(): void {
    this.clearSession();
  }

  private setSession(session: AuthSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.session.set(session);
  }

  private clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.session.set(null);
  }
}

function readStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}
