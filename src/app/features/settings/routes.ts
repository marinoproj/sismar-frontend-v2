import { Routes } from '@angular/router';
import { featureGuard } from '../../core/guards/feature.guard';
import { PortConfigHttpRepository } from './ports/repositories/port-config-http.repository';
import { PORT_CONFIG_REPOSITORY } from './ports/repositories/port-config.repository';
import { PortConfigService } from './ports/services/port-config.service';
import { TerminalConfigHttpRepository } from './terminals/repositories/terminal-config-http.repository';
import { TERMINAL_CONFIG_REPOSITORY } from './terminals/repositories/terminal-config.repository';
import { TerminalConfigService } from './terminals/services/terminal-config.service';
import { BerthConfigHttpRepository } from './berths/repositories/berth-config-http.repository';
import { BERTH_CONFIG_REPOSITORY } from './berths/repositories/berth-config.repository';
import { AreaHttpRepository } from './berths/repositories/area-http.repository';
import { AREA_REPOSITORY } from './berths/repositories/area.repository';
import { BerthConfigService } from './berths/services/berth-config.service';
import { AreaService } from './berths/services/area.service';

export const settingsRoutes: Routes = [
  { path: '', redirectTo: 'ports', pathMatch: 'full' },
  {
    path: 'ports',
    data: { breadcrumb: 'Portos', feature: 'CONFIGURACAO_PORTO' },
    canActivate: [featureGuard],
    providers: [
      PortConfigService,
      { provide: PORT_CONFIG_REPOSITORY, useClass: PortConfigHttpRepository },
    ],
    loadComponent: () =>
      import('./ports/pages/ports-config-page/ports-config-page.component').then(
        (m) => m.PortsConfigPageComponent,
      ),
  },
  {
    path: 'terminals',
    data: { breadcrumb: 'Terminais', feature: 'CONFIGURACAO_TERMINAL' },
    canActivate: [featureGuard],
    providers: [
      PortConfigService,
      { provide: PORT_CONFIG_REPOSITORY, useClass: PortConfigHttpRepository },
      TerminalConfigService,
      { provide: TERMINAL_CONFIG_REPOSITORY, useClass: TerminalConfigHttpRepository },
    ],
    loadComponent: () =>
      import('./terminals/pages/terminals-config-page/terminals-config-page.component').then(
        (m) => m.TerminalsConfigPageComponent,
      ),
  },
  {
    path: 'berths',
    data: { breadcrumb: 'Berços', feature: 'CONFIGURACAO_BERCO' },
    canActivate: [featureGuard],
    providers: [
      BerthConfigService,
      { provide: BERTH_CONFIG_REPOSITORY, useClass: BerthConfigHttpRepository },
      PortConfigService,
      { provide: PORT_CONFIG_REPOSITORY, useClass: PortConfigHttpRepository },
      { provide: TERMINAL_CONFIG_REPOSITORY, useClass: TerminalConfigHttpRepository },
      AreaService,
      { provide: AREA_REPOSITORY, useClass: AreaHttpRepository },
    ],
    loadComponent: () =>
      import('./berths/pages/berths-config-page/berths-config-page.component').then(
        (m) => m.BerthsConfigPageComponent,
      ),
  },
];
