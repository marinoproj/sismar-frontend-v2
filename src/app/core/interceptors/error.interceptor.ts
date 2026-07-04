import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../services/toast.service';

const GENERIC_ERROR_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const isPublicAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/clients');

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && !isPublicAuthRequest) {
          auth.clearLocalSession();
          router.navigate(['/login']);
        } else {
          toast.show({ message: error.error?.message ?? GENERIC_ERROR_MESSAGE, type: 'error' });
        }
      }
      return throwError(() => error);
    }),
  );
};
