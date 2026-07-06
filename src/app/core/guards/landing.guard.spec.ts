import { TestBed } from '@angular/core/testing';
import { provideRouter, Route, UrlSegment } from '@angular/router';
import { hasPortsFeatureMatch } from './landing.guard';
import { AuthService } from '../auth/auth.service';

describe('hasPortsFeatureMatch', () => {
  let hasFeature: jest.Mock;

  beforeEach(() => {
    hasFeature = jest.fn();

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { hasFeature } }],
    });
  });

  function runGuard() {
    const route = {} as Route;
    const segments: UrlSegment[] = [];
    return TestBed.runInInjectionContext(() => hasPortsFeatureMatch(route, segments));
  }

  it('matches when the user has the PORTOS feature', () => {
    hasFeature.mockReturnValue(true);
    expect(runGuard()).toBe(true);
    expect(hasFeature).toHaveBeenCalledWith('PORTOS');
  });

  it('does not match when the user lacks the PORTOS feature', () => {
    hasFeature.mockReturnValue(false);
    expect(runGuard()).toBe(false);
  });
});
