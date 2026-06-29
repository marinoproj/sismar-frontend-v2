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
        loadChildren: () =>
          import('./features/dashboard/routes').then((m) => m.dashboardRoutes),
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
