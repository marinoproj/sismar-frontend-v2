import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const featureGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const feature = route.data['feature'] as string | undefined;
  if (!feature || auth.hasFeature(feature)) {
    return true;
  }

  return router.createUrlTree(['/403']);
};
