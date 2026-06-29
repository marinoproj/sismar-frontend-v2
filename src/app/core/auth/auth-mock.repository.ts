import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { AuthRepository, LoginCredentials, LoginResponse } from './auth.repository';

@Injectable()
export class AuthMockRepository implements AuthRepository {
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const user = {
      id: '1',
      name: 'Admin Sismar',
      email: credentials.email,
      roles: ['admin'],
    };

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: user.id, user, iat: Date.now() }));
    const token = `${header}.${payload}.mock-signature`;

    return of({ token, user }).pipe(delay(500));
  }
}
