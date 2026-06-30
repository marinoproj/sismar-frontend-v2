import { Component } from '@angular/core';
import { LineChartComponent } from '../../../../shared/ui/charts/line-chart/line-chart.component';
import { ChartData } from '../../../../shared/models/chart-data.model';

@Component({
  selector: 'app-line-charts-page',
  standalone: true,
  imports: [LineChartComponent],
  templateUrl: './line-charts-page.component.html',
})
export class LineChartsPageComponent {
  readonly singleLine: ChartData[] = [
    { name: 'Receita', data: [31, 40, 28, 51, 42, 82, 56, 73, 64, 91, 85, 110] },
  ];

  readonly multiLine: ChartData[] = [
    { name: 'Produto A', data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 71, 68, 80] },
    { name: 'Produto B', data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 103, 112, 120] },
    { name: 'Produto C', data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 50, 60, 70] },
  ];

  readonly steppedLine: ChartData[] = [
    { name: 'Usuários', data: [120, 132, 132, 145, 145, 165, 165, 182, 182, 200, 200, 215] },
    { name: 'Meta', data: [130, 130, 150, 150, 170, 170, 190, 190, 210, 210, 230, 230] },
  ];
}
