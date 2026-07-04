import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import { featureGuard } from './feature.guard';
import { AuthService } from '../auth/auth.service';

describe('featureGuard', () => {
  let hasFeature: jest.Mock;
  let router: Router;

  beforeEach(() => {
    hasFeature = jest.fn();

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { hasFeature } }],
    });

    router = TestBed.inject(Router);
  });

  function runGuard(data: Record<string, unknown>) {
    const route = { data } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => featureGuard(route, state));
  }

  it('allows activation when the route declares no feature', () => {
    expect(runGuard({})).toBe(true);
  });

  it('allows activation when the user has the required feature', () => {
    hasFeature.mockReturnValue(true);
    expect(runGuard({ feature: 'PORT_VIEW' })).toBe(true);
  });

  it('redirects to /403 when the user lacks the required feature', () => {
    hasFeature.mockReturnValue(false);
    const result = runGuard({ feature: 'PORT_VIEW' });
    expect(result).toEqual(router.createUrlTree(['/403']));
  });
});
