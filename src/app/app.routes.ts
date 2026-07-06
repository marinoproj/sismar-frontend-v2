import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { featureGuard } from './core/guards/feature.guard';
import { LayoutComponent } from './layout/layout.component';
import { demoRoutes } from './demo-routes';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '403',
    loadComponent: () =>
      import('./features/errors/pages/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent,
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        data: { breadcrumb: 'Início' },
        loadComponent: () =>
          import('./features/home/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'ports',
        data: { breadcrumb: 'Portos', feature: 'PORTOS' },
        canActivate: [featureGuard],
        loadChildren: () => import('./features/ports/routes').then((m) => m.portsRoutes),
      },
      {
        path: 'settings',
        data: { breadcrumb: 'Configurações' },
        loadChildren: () => import('./features/settings/routes').then((m) => m.settingsRoutes),
      },
      ...demoRoutes,
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
