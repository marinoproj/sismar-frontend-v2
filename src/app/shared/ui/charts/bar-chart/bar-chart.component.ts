import { Component, computed, inject, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTheme, ApexTitleSubtitle, ApexPlotOptions, ApexGrid } from 'ng-apexcharts';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONFIG } from '../../../../core/config/theme.config';
import { ChartData } from '../../../models/chart-data.model';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="chartSeries()"
      [chart]="chartConfig()"
      [xaxis]="xAxisConfig"
      [dataLabels]="dataLabels"
      [plotOptions]="plotOptions()"
      [grid]="gridConfig()"
      [theme]="chartTheme()"
      [title]="titleConfig()"
      [colors]="resolvedColors()"
    />
  `,
})
export class BarChartComponent {
  @Input({ required: true }) data: ChartData[] = [];
  @Input({ required: true }) title = '';
  @Input() description?: string;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() height = 350;
  @Input() colors?: string[];
  @Input() showLegend = true;

  private readonly theme = inject(ThemeService);
  private readonly config = inject(THEME_CONFIG);

  readonly chartSeries = computed<ApexAxisChartSeries>(() => this.data as ApexAxisChartSeries);

  readonly chartConfig = computed<ApexChart>(() => ({
    type: 'bar',
    height: this.height,
    background: 'transparent',
    toolbar: { show: false },
  }));

  readonly plotOptions = computed<ApexPlotOptions>(() => ({
    bar: { horizontal: this.orientation === 'horizontal', borderRadius: 4 },
  }));

  readonly xAxisConfig: ApexXAxis = { type: 'category' };
  readonly dataLabels: ApexDataLabels = { enabled: false };

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
    this.colors ?? [this.config.primaryColor, '#34D399', '#FF8A65', '#FBBF24'],
  );
}
