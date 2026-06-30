import { Component } from '@angular/core';
import { PieChartComponent } from '../../../../shared/ui/charts/pie-chart/pie-chart.component';

@Component({
  selector: 'app-pie-charts-page',
  standalone: true,
  imports: [PieChartComponent],
  templateUrl: './pie-charts-page.component.html',
})
export class PieChartsPageComponent {
  readonly categoryLabels = ['Eletrônicos', 'Vestuário', 'Alimentação', 'Serviços', 'Outros'];
  readonly categorySeries = [35, 25, 18, 14, 8];

  readonly portfolioLabels = ['Ações', 'FIIs', 'Renda Fixa', 'Caixa'];
  readonly portfolioSeries = [55, 25, 15, 5];

  readonly regionLabels = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
  readonly regionSeries = [8, 18, 12, 45, 17];
}
