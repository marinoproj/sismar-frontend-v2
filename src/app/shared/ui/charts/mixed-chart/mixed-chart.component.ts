import { Component, computed, inject, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTheme, ApexTitleSubtitle, ApexGrid } from 'ng-apexcharts';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONFIG } from '../../../../core/config/theme.config';
import { MixedChartData } from '../../../models/chart-data.model';
import { SkeletonComponent } from '../../skeleton/skeleton.component';

@Component({
  selector: 'app-mixed-chart',
  standalone: true,
  imports: [NgApexchartsModule, SkeletonComponent],
  template: `
    @if (loading) {
      <app-skeleton variant="chart" [height]="height" />
    } @else {
      <apx-chart
        [series]="chartSeries()"
        [chart]="chartConfig()"
        [xaxis]="xAxisConfig"
        [dataLabels]="dataLabels"
        [grid]="gridConfig()"
        [theme]="chartTheme()"
        [title]="titleConfig()"
        [colors]="resolvedColors()"
      />
    }
  `,
})
export class MixedChartComponent {
  @Input({ required: true }) data: MixedChartData[] = [];
  @Input({ required: true }) title = '';
  @Input() description?: string;
  @Input() height = 350;
  @Input() colors?: string[];
  @Input() showLegend = true;
  @Input() loading = false;

  private readonly theme = inject(ThemeService);
  private readonly config = inject(THEME_CONFIG);

  readonly chartSeries = computed<ApexAxisChartSeries>(
    () => this.data as unknown as ApexAxisChartSeries,
  );

  readonly chartConfig = computed<ApexChart>(() => ({
    type: 'line',
    height: this.height,
    background: 'transparent',
    foreColor: this.theme.currentMode() === 'dark' ? '#A1A1AA' : '#374151',
    toolbar: { show: false },
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
    this.colors ?? [this.config.primaryColor, '#EC5CF8', '#5B6CFF'],
  );
}
