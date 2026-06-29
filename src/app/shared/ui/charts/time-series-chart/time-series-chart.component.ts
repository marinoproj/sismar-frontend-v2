import { Component, computed, inject, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTheme, ApexTitleSubtitle, ApexTooltip } from 'ng-apexcharts';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONFIG } from '../../../../core/config/theme.config';
import { ChartData } from '../../../models/chart-data.model';

@Component({
  selector: 'app-time-series-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="chartSeries()"
      [chart]="chartConfig()"
      [xaxis]="xAxisConfig"
      [dataLabels]="dataLabels"
      [tooltip]="tooltipConfig"
      [theme]="chartTheme()"
      [title]="titleConfig()"
      [colors]="resolvedColors()"
    />
  `,
})
export class TimeSeriesChartComponent {
  @Input({ required: true }) data: ChartData[] = [];
  @Input({ required: true }) title = '';
  @Input() description?: string;
  @Input() zoomEnabled = true;
  @Input() height = 350;
  @Input() colors?: string[];
  @Input() showLegend = true;

  private readonly theme = inject(ThemeService);
  private readonly config = inject(THEME_CONFIG);

  readonly chartSeries = computed<ApexAxisChartSeries>(() => this.data as ApexAxisChartSeries);

  readonly chartConfig = computed<ApexChart>(() => ({
    type: 'line',
    height: this.height,
    toolbar: { show: this.zoomEnabled },
    zoom: { enabled: this.zoomEnabled, type: 'x' },
  }));

  readonly xAxisConfig: ApexXAxis = {
    type: 'datetime',
    labels: {
      datetimeFormatter: { year: 'yyyy', month: 'dd/MM', day: 'dd/MM', hour: 'HH:mm' },
    },
  };

  readonly dataLabels: ApexDataLabels = { enabled: false };

  readonly tooltipConfig: ApexTooltip = {
    x: { format: 'dd/MM HH:mm' },
  };

  readonly chartTheme = computed<ApexTheme>(() => ({
    mode: this.theme.currentMode() as 'light' | 'dark',
  }));

  readonly titleConfig = computed<ApexTitleSubtitle>(() => ({
    text: this.title,
    align: 'left',
    style: { fontSize: '14px', fontWeight: '600' },
  }));

  readonly resolvedColors = computed<string[]>(() =>
    this.colors ?? [this.config.primaryColor, '#f59e0b', '#10b981'],
  );
}
