import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TabsComponent, TabItem } from '../../../../shared/ui/tabs/tabs.component';
import { PortsService } from '../../services/ports.service';

@Component({
  selector: 'app-port-details-page',
  standalone: true,
  imports: [RouterOutlet, TabsComponent],
  templateUrl: './port-details-page.component.html',
})
export class PortDetailsPageComponent {
  private readonly portsService = inject(PortsService);
  private readonly route = inject(ActivatedRoute);

  readonly tabs: TabItem[] = [
    { label: 'Geral', route: 'geral', feature: 'PORTOS' },
    { label: 'Histórico', route: 'historico', feature: 'PORTOS_HISTORICO' },
    { label: 'Terminais', route: 'terminais', feature: 'PORTOS_TERMINAIS' },
    { label: 'Alertas', route: 'alertas', feature: 'PORTOS_ALERTAS' },
  ];

  get portInfo() {
    return this.portsService.details()?.portInfo;
  }

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.portsService.loadDetails(id);
  }
}
