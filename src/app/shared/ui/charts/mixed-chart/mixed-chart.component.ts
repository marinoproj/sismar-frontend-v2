import { Component, computed, inject, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTheme, ApexTitleSubtitle } from 'ng-apexcharts';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONFIG } from '../../../../core/config/theme.config';
import { MixedChartData } from '../../../models/chart-data.model';

@Component({
  selector: 'app-mixed-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="chartSeries()"
      [chart]="chartConfig"
      [xaxis]="xAxisConfig"
      [dataLabels]="dataLabels"
      [theme]="chartTheme()"
      [title]="titleConfig()"
      [colors]="resolvedColors()"
    />
  `,
})
export class MixedChartComponent {
  @Input({ required: true }) data: MixedChartData[] = [];
  @Input({ required: true }) title = '';
  @Input() description?: string;
  @Input() height = 350;
  @Input() colors?: string[];
  @Input() showLegend = true;

  private readonly theme = inject(ThemeService);
  private readonly config = inject(THEME_CONFIG);

  readonly chartSeries = computed<ApexAxisChartSeries>(
    () => this.data as unknown as ApexAxisChartSeries,
  );

  readonly chartConfig: ApexChart = { type: 'line', height: this.height, toolbar: { show: false } };
  readonly xAxisConfig: ApexXAxis = { type: 'category' };
  readonly dataLabels: ApexDataLabels = { enabled: false };

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
