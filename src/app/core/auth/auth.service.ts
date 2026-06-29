import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from './user.model';
import { AUTH_REPOSITORY, LoginCredentials } from './auth.repository';

const TOKEN_KEY = 'auth-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly repo = inject(AUTH_REPOSITORY);

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly currentUser = signal<User | null>(this.parseUserFromToken());
  readonly isAuthenticated = computed(() => this.token() !== null);

  login(credentials: LoginCredentials): Observable<void> {
    return this.repo.login(credentials).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        this.token.set(res.token);
        this.currentUser.set(res.user);
      }),
    ) as unknown as Observable<void>;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
    this.currentUser.set(null);
  }

  private parseUserFromToken(): User | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user ?? null;
    } catch {
      return null;
    }
  }
}
