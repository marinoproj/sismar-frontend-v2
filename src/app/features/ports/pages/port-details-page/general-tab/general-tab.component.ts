import { Component, computed, inject } from '@angular/core';
import { StatCardComponent } from '../../../../../shared/ui/stat-card/stat-card.component';
import { PieChartComponent } from '../../../../../shared/ui/charts/pie-chart/pie-chart.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { SkeletonComponent } from '../../../../../shared/ui/skeleton/skeleton.component';
import { PortsService } from '../../../services/ports.service';

@Component({
  selector: 'app-general-tab',
  standalone: true,
  imports: [StatCardComponent, PieChartComponent, ButtonComponent, SkeletonComponent],
  templateUrl: './general-tab.component.html',
})
export class GeneralTabComponent {
  private readonly portsService = inject(PortsService);

  readonly occupancyLabels = ['Ocupados', 'Disponíveis'];
  readonly occupancyColors = ['#F59E0B', '#10B981'];

  get details() {
    return this.portsService.details();
  }

  get loading(): boolean {
    return this.portsService.detailsLoading();
  }

  readonly occupancySeries = computed(() => {
    const info = this.portsService.details()?.portInfo;
    if (!info) return [0, 0];
    return [info.occupiedBerths, info.totalBerths - info.occupiedBerths];
  });

  readonly shipsInPortLabels = computed(() =>
    Object.keys(this.portsService.details()?.operationalIndicators.shipsInPortByType ?? {}),
  );
  readonly shipsInPortSeries = computed(() =>
    Object.values(this.portsService.details()?.operationalIndicators.shipsInPortByType ?? {}),
  );

  readonly shipsLast24hLabels = computed(() =>
    Object.keys(this.portsService.details()?.operationalIndicators.shipsLast24hByType ?? {}),
  );
  readonly shipsLast24hSeries = computed(() =>
    Object.values(this.portsService.details()?.operationalIndicators.shipsLast24hByType ?? {}),
  );
}
