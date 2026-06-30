import { Component } from '@angular/core';
import { BarChartComponent } from '../../../../shared/ui/charts/bar-chart/bar-chart.component';
import { ChartData } from '../../../../shared/models/chart-data.model';

@Component({
  selector: 'app-bar-charts-page',
  standalone: true,
  imports: [BarChartComponent],
  templateUrl: './bar-charts-page.component.html',
})
export class BarChartsPageComponent {
  readonly verticalBar: ChartData[] = [
    { name: 'Vendas', data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 71, 68, 80] },
    { name: 'Metas', data: [50, 50, 60, 60, 65, 65, 70, 70, 72, 75, 75, 85] },
  ];

  readonly horizontalBar: ChartData[] = [
    { name: 'Regiões', data: [130, 95, 87, 74, 62, 51] },
  ];

  readonly stackedBar: ChartData[] = [
    { name: 'Q1', data: [44, 55, 41, 67, 22, 43] },
    { name: 'Q2', data: [13, 23, 20, 8, 13, 27] },
    { name: 'Q3', data: [11, 17, 15, 15, 21, 14] },
    { name: 'Q4', data: [21, 7, 25, 13, 22, 8] },
  ];
}
