import { Routes } from '@angular/router';
import { featureGuard } from '../../core/guards/feature.guard';
import { PortsHttpRepository } from './repositories/ports-http.repository';
import { PORTS_REPOSITORY } from './repositories/ports.repository';
import { PortsService } from './services/ports.service';

export const portsRoutes: Routes = [
  {
    path: '',
    providers: [
      PortsService,
      { provide: PORTS_REPOSITORY, useClass: PortsHttpRepository },
    ],
    loadComponent: () =>
      import('./pages/ports-list-page/ports-list-page.component').then(
        (m) => m.PortsListPageComponent,
      ),
  },
  {
    path: ':id',
    providers: [
      PortsService,
      { provide: PORTS_REPOSITORY, useClass: PortsHttpRepository },
    ],
    loadComponent: () =>
      import('./pages/port-details-page/port-details-page.component').then(
        (m) => m.PortDetailsPageComponent,
      ),
    children: [
      { path: '', redirectTo: 'geral', pathMatch: 'full' },
      {
        path: 'geral',
        data: { breadcrumb: 'Geral', feature: 'PORTOS' },
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/port-details-page/general-tab/general-tab.component').then(
            (m) => m.GeneralTabComponent,
          ),
      },
      {
        path: 'historico',
        data: { breadcrumb: 'Histórico', feature: 'PORTOS_HISTORICO', title: 'Histórico' },
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/port-details-page/tab-placeholder/tab-placeholder.component').then(
            (m) => m.TabPlaceholderComponent,
          ),
      },
      {
        path: 'terminais',
        data: { breadcrumb: 'Terminais', feature: 'PORTOS_TERMINAIS', title: 'Terminais' },
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/port-details-page/tab-placeholder/tab-placeholder.component').then(
            (m) => m.TabPlaceholderComponent,
          ),
      },
      {
        path: 'alertas',
        data: { breadcrumb: 'Alertas', feature: 'PORTOS_ALERTAS', title: 'Alertas' },
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/port-details-page/tab-placeholder/tab-placeholder.component').then(
            (m) => m.TabPlaceholderComponent,
          ),
      },
    ],
  },
];
