import { Component } from '@angular/core';
import { MixedChartComponent } from '../../../../shared/ui/charts/mixed-chart/mixed-chart.component';
import { MixedChartData } from '../../../../shared/models/chart-data.model';

@Component({
  selector: 'app-mixed-charts-page',
  standalone: true,
  imports: [MixedChartComponent],
  templateUrl: './mixed-charts-page.component.html',
})
export class MixedChartsPageComponent {
  readonly volumeTrend: MixedChartData[] = [
    { name: 'Volume', type: 'bar', data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 65] },
    { name: 'Tendência', type: 'line', data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 50, 60, 70] },
  ];

  readonly revenueComparison: MixedChartData[] = [
    { name: 'Receita', type: 'bar', data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 103, 112, 125] },
    { name: 'Custo', type: 'bar', data: [50, 55, 60, 58, 62, 65, 63, 70, 60, 65, 72, 80] },
    { name: 'Lucro', type: 'line', data: [26, 30, 41, 40, 25, 40, 28, 44, 34, 38, 40, 45] },
  ];
}
