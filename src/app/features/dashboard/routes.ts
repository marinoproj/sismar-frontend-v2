import { Routes } from '@angular/router';
import { DashboardMockRepository } from './repositories/dashboard-mock.repository';
import { DASHBOARD_REPOSITORY } from './repositories/dashboard.repository';
import { DashboardService } from './services/dashboard.service';

export const dashboardRoutes: Routes = [
  {
    path: '',
    providers: [
      DashboardService,
      { provide: DASHBOARD_REPOSITORY, useClass: DashboardMockRepository },
    ],
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent,
      ),
  },
];
