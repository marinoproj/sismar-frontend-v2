import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { featureGuard } from './core/guards/feature.guard';
import { hasPortsFeatureMatch } from './core/guards/landing.guard';
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
      // A primeira que casar vence: usuário com a feature PORTOS cai em /ports,
      // os demais caem em /home — vale tanto para o pós-login quanto para acesso direto a '/'.
      { path: '', pathMatch: 'full', canMatch: [hasPortsFeatureMatch], redirectTo: 'ports' },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
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
