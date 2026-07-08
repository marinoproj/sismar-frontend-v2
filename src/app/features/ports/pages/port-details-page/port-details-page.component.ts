import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    // Reage a mudanças no parâmetro de rota (não só na criação do componente): o Angular
    // reaproveita esta mesma instância ao navegar entre /ports/1 e /ports/2 (mesmo routeConfig),
    // então carregar só uma vez no construtor deixaria os dados do porto anterior na tela.
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.portsService.loadDetails(Number(params.get('id')));
    });
  }
}
