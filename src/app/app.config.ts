import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { THEME_CONFIG, themeConfig } from './core/config/theme.config';
import { ThemeService } from './core/services/theme.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AUTH_REPOSITORY } from './core/auth/auth.repository';
import { AuthMockRepository } from './core/auth/auth-mock.repository';

function initializeTheme(themeService: ThemeService) {
  return () => themeService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: THEME_CONFIG, useValue: themeConfig },
    { provide: AUTH_REPOSITORY, useClass: AuthMockRepository },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      deps: [ThemeService],
      multi: true,
    },
  ],
};
