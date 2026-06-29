import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Observable<LoginResponse>;
}

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
