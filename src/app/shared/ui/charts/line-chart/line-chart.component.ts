import { Component, computed, inject, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTheme, ApexTitleSubtitle, ApexGrid, ApexStroke } from 'ng-apexcharts';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONFIG } from '../../../../core/config/theme.config';
import { ChartData } from '../../../models/chart-data.model';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="chartSeries()"
      [chart]="chartConfig"
      [xaxis]="xAxisConfig"
      [dataLabels]="dataLabels"
      [stroke]="strokeConfig"
      [grid]="gridConfig()"
      [theme]="chartTheme()"
      [title]="titleConfig()"
      [colors]="resolvedColors()"
    />
  `,
})
export class LineChartComponent {
  @Input({ required: true }) data: ChartData[] = [];
  @Input({ required: true }) title = '';
  @Input() description?: string;
  @Input() height = 350;
  @Input() colors?: string[];
  @Input() showLegend = true;

  private readonly theme = inject(ThemeService);
  private readonly config = inject(THEME_CONFIG);

  readonly chartSeries = computed<ApexAxisChartSeries>(() => this.data as ApexAxisChartSeries);

  readonly chartConfig: ApexChart = {
    type: 'line',
    height: this.height,
    background: 'transparent',
    toolbar: { show: true },
    zoom: { enabled: false },
  };

  readonly xAxisConfig: ApexXAxis = { type: 'category' };
  readonly dataLabels: ApexDataLabels = { enabled: false };
  readonly strokeConfig: ApexStroke = { curve: 'smooth', width: 2 };

  readonly gridConfig = computed<ApexGrid>(() => ({
    borderColor: this.theme.currentMode() === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    xaxis: { lines: { show: false } },
  }));

  readonly chartTheme = computed<ApexTheme>(() => ({
    mode: this.theme.currentMode() as 'light' | 'dark',
  }));

  readonly titleConfig = computed<ApexTitleSubtitle>(() => ({
    text: this.title,
    align: 'left',
    style: { fontSize: '14px', fontWeight: '600' },
  }));

  readonly resolvedColors = computed<string[]>(() =>
    this.colors ?? [this.config.primaryColor, '#EC5CF8', '#5B6CFF', '#34D399'],
  );
}
