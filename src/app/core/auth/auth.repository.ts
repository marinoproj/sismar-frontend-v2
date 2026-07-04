import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthSession, ClientDTO } from './session.model';

export interface LoginCredentials {
  username: string;
  password: string;
}

export abstract class AuthRepository {
  abstract getClients(credentials: LoginCredentials): Observable<ClientDTO[]>;
  abstract login(credentials: LoginCredentials, clientCode: string): Observable<AuthSession>;
  abstract logout(): Observable<void>;
}

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
