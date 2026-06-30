import { Component, computed, inject, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTheme, ApexTitleSubtitle, ApexPlotOptions, ApexTooltip, ApexGrid } from 'ng-apexcharts';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONFIG } from '../../../../core/config/theme.config';
import { TimelineData } from '../../../models/chart-data.model';

@Component({
  selector: 'app-timeline-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="chartSeries()"
      [chart]="chartConfig()"
      [xaxis]="xAxisConfig"
      [plotOptions]="plotOptions"
      [tooltip]="tooltipConfig"
      [grid]="gridConfig()"
      [theme]="chartTheme()"
      [title]="titleConfig()"
      [colors]="resolvedColors()"
    />
  `,
})
export class TimelineChartComponent {
  @Input({ required: true }) data: TimelineData[] = [];
  @Input({ required: true }) title = '';
  @Input() description?: string;
  @Input() height = 350;
  @Input() colors?: string[];

  private readonly theme = inject(ThemeService);
  private readonly config = inject(THEME_CONFIG);

  readonly chartSeries = computed<ApexAxisChartSeries>(
    () => this.data as unknown as ApexAxisChartSeries,
  );

  readonly chartConfig = computed<ApexChart>(() => ({
    type: 'rangeBar',
    height: this.height,
    background: 'transparent',
    foreColor: this.theme.currentMode() === 'dark' ? '#A1A1AA' : '#374151',
  }));

  readonly xAxisConfig: ApexXAxis = {
    type: 'datetime',
    labels: { datetimeFormatter: { day: 'dd/MM', hour: 'HH:mm' } },
  };

  readonly plotOptions: ApexPlotOptions = { bar: { horizontal: true, rangeBarGroupRows: true } };

  readonly tooltipConfig: ApexTooltip = {
    x: { format: 'dd/MM/yyyy HH:mm' },
  };

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
    this.colors ?? [this.config.primaryColor, '#5B6CFF', '#34D399', '#FF8A65'],
  );
}
