import { Routes } from '@angular/router';

export const chartsRoutes: Routes = [
  { path: '', redirectTo: 'line', pathMatch: 'full' },
  {
    path: 'line',
    data: { breadcrumb: 'Line Charts' },
    loadComponent: () =>
      import('./pages/line-charts-page/line-charts-page.component').then(
        (m) => m.LineChartsPageComponent,
      ),
  },
  {
    path: 'bar',
    data: { breadcrumb: 'Bar Charts' },
    loadComponent: () =>
      import('./pages/bar-charts-page/bar-charts-page.component').then(
        (m) => m.BarChartsPageComponent,
      ),
  },
  {
    path: 'mixed',
    data: { breadcrumb: 'Mixed Charts' },
    loadComponent: () =>
      import('./pages/mixed-charts-page/mixed-charts-page.component').then(
        (m) => m.MixedChartsPageComponent,
      ),
  },
  {
    path: 'timeline',
    data: { breadcrumb: 'Timeline Charts' },
    loadComponent: () =>
      import('./pages/timeline-charts-page/timeline-charts-page.component').then(
        (m) => m.TimelineChartsPageComponent,
      ),
  },
  {
    path: 'pie',
    data: { breadcrumb: 'Pie Charts' },
    loadComponent: () =>
      import('./pages/pie-charts-page/pie-charts-page.component').then(
        (m) => m.PieChartsPageComponent,
      ),
  },
];
