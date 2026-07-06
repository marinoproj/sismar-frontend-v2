import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const hasPortsFeatureMatch: CanMatchFn = () => {
  return inject(AuthService).hasFeature('PORTOS');
};
