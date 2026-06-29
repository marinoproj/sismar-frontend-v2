import { Component, computed, inject, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ApexNonAxisChartSeries, ApexTheme, ApexTitleSubtitle, ApexLegend } from 'ng-apexcharts';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_CONFIG } from '../../../../core/config/theme.config';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="data"
      [labels]="labels"
      [chart]="chartConfig()"
      [theme]="chartTheme()"
      [title]="titleConfig()"
      [legend]="legendConfig"
      [colors]="resolvedColors()"
    />
  `,
})
export class PieChartComponent {
  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) series: number[] = [];
  @Input({ required: true }) title = '';
  @Input() donut = false;
  @Input() description?: string;
  @Input() height = 350;
  @Input() colors?: string[];
  @Input() showLegend = true;

  private readonly theme = inject(ThemeService);
  private readonly config = inject(THEME_CONFIG);

  get data(): ApexNonAxisChartSeries {
    return this.series;
  }

  readonly chartConfig = computed<ApexChart>(() => ({
    type: this.donut ? 'donut' : 'pie',
    height: this.height,
  }));

  readonly legendConfig: ApexLegend = { position: 'bottom' };

  readonly chartTheme = computed<ApexTheme>(() => ({
    mode: this.theme.currentMode() as 'light' | 'dark',
  }));

  readonly titleConfig = computed<ApexTitleSubtitle>(() => ({
    text: this.title,
    align: 'left',
    style: { fontSize: '14px', fontWeight: '600' },
  }));

  readonly resolvedColors = computed<string[]>(() =>
    this.colors ?? [this.config.primaryColor, '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'],
  );
}
