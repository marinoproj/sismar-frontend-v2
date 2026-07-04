import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthRepository, LoginCredentials } from './auth.repository';
import { AuthSession, ClientDTO } from './session.model';

@Injectable()
export class AuthHttpRepository implements AuthRepository {
  private readonly http = inject(HttpClient);

  getClients(credentials: LoginCredentials): Observable<ClientDTO[]> {
    return this.http.post<ClientDTO[]>(`${environment.apiUrl}/auth/clients`, credentials);
  }

  login(credentials: LoginCredentials, clientCode: string): Observable<AuthSession> {
    return this.http.post<AuthSession>(`${environment.apiUrl}/auth/login`, credentials, {
      headers: { clientCode },
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, null);
  }
}
