import { Routes } from '@angular/router';

export const mapsRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Maps' },
    loadComponent: () =>
      import('./pages/maps-page/maps-page.component').then((m) => m.MapsPageComponent),
  },
];
