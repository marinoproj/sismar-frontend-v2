import { Routes } from '@angular/router';
import { DashboardMockRepository } from './repositories/dashboard-mock.repository';
import { DASHBOARD_REPOSITORY } from './repositories/dashboard.repository';
import { DashboardService } from './services/dashboard.service';
import { AcoesMockRepository } from './repositories/acoes-mock.repository';
import { ACOES_REPOSITORY } from './repositories/acoes.repository';
import { AcoesService } from './services/acoes.service';

export const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'vendas', pathMatch: 'full' },
  {
    path: 'vendas',
    data: { breadcrumb: 'Vendas' },
    providers: [
      DashboardService,
      { provide: DASHBOARD_REPOSITORY, useClass: DashboardMockRepository },
    ],
    loadComponent: () =>
      import('./pages/vendas-page/vendas-page.component').then((m) => m.VendasPageComponent),
  },
  {
    path: 'acoes',
    data: { breadcrumb: 'Ações' },
    providers: [
      AcoesService,
      { provide: ACOES_REPOSITORY, useClass: AcoesMockRepository },
    ],
    loadComponent: () =>
      import('./pages/acoes-page/acoes-page.component').then((m) => m.AcoesPageComponent),
  },
];
