import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/errors/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
