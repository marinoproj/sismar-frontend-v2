import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { VendasWcComponent } from './vendas-wc/vendas-wc.component';
import { DashboardService } from './app/features/dashboard/services/dashboard.service';
import { DashboardMockRepository } from './app/features/dashboard/repositories/dashboard-mock.repository';
import { DASHBOARD_REPOSITORY } from './app/features/dashboard/repositories/dashboard.repository';
import { THEME_CONFIG, themeConfig } from './app/core/config/theme.config';

(async () => {
  const app = await createApplication({
    providers: [
      provideExperimentalZonelessChangeDetection(),
      { provide: THEME_CONFIG, useValue: themeConfig },
      DashboardService,
      { provide: DASHBOARD_REPOSITORY, useClass: DashboardMockRepository },
    ],
  });

  const VendasElement = createCustomElement(VendasWcComponent, { injector: app.injector });
  customElements.define('sismar-vendas', VendasElement);
})();
