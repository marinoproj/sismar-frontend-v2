import { Routes } from '@angular/router';

export const demoRoutes: Routes = [
  {
    path: 'dashboard',
    data: { breadcrumb: 'Dashboard' },
    loadChildren: () =>
      import('./features/dashboard/routes').then((m) => m.dashboardRoutes),
  },
  {
    path: 'charts',
    data: { breadcrumb: 'Charts' },
    loadChildren: () =>
      import('./features/charts/routes').then((m) => m.chartsRoutes),
  },
  {
    path: 'ui-elements',
    data: { breadcrumb: 'UI Elements' },
    loadChildren: () =>
      import('./features/ui-elements/routes').then((m) => m.uiElementsRoutes),
  },
  {
    path: 'maps',
    data: { breadcrumb: 'Maps' },
    loadChildren: () =>
      import('./features/maps/routes').then((m) => m.mapsRoutes),
  },
];
