import { Routes } from '@angular/router';

export const uiElementsRoutes: Routes = [
  { path: '', redirectTo: 'alerts', pathMatch: 'full' },
  {
    path: 'alerts',
    data: { breadcrumb: 'Alerts' },
    loadComponent: () =>
      import('./pages/alerts-page/alerts-page.component').then((m) => m.AlertsPageComponent),
  },
  {
    path: 'badges',
    data: { breadcrumb: 'Badges' },
    loadComponent: () =>
      import('./pages/badges-page/badges-page.component').then((m) => m.BadgesPageComponent),
  },
  {
    path: 'buttons',
    data: { breadcrumb: 'Buttons' },
    loadComponent: () =>
      import('./pages/buttons-page/buttons-page.component').then((m) => m.ButtonsPageComponent),
  },
  {
    path: 'cards',
    data: { breadcrumb: 'Cards' },
    loadComponent: () =>
      import('./pages/cards-page/cards-page.component').then((m) => m.CardsPageComponent),
  },
  {
    path: 'dropdowns',
    data: { breadcrumb: 'Dropdowns' },
    loadComponent: () =>
      import('./pages/dropdowns-page/dropdowns-page.component').then(
        (m) => m.DropdownsPageComponent,
      ),
  },
  {
    path: 'list-group',
    data: { breadcrumb: 'List group' },
    loadComponent: () =>
      import('./pages/list-group-page/list-group-page.component').then(
        (m) => m.ListGroupPageComponent,
      ),
  },
  {
    path: 'modals',
    data: { breadcrumb: 'Modals' },
    loadComponent: () =>
      import('./pages/modals-page/modals-page.component').then((m) => m.ModalsPageComponent),
  },
  {
    path: 'progress',
    data: { breadcrumb: 'Progress' },
    loadComponent: () =>
      import('./pages/progress-page/progress-page.component').then(
        (m) => m.ProgressPageComponent,
      ),
  },
  {
    path: 'spinners',
    data: { breadcrumb: 'Spinners' },
    loadComponent: () =>
      import('./pages/spinners-page/spinners-page.component').then(
        (m) => m.SpinnersPageComponent,
      ),
  },
  {
    path: 'tables',
    data: { breadcrumb: 'Tables' },
    loadComponent: () =>
      import('./pages/tables-page/tables-page.component').then((m) => m.TablesPageComponent),
  },
  {
    path: 'toasts',
    data: { breadcrumb: 'Toasts' },
    loadComponent: () =>
      import('./pages/toasts-page/toasts-page.component').then((m) => m.ToastsPageComponent),
  },
];
