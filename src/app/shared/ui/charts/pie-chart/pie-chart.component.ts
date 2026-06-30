import { Component, computed, inject, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ApexNonAxisChartSeries, ApexTheme, ApexTitleSubtitle, ApexLegend, ApexStroke } from 'ng-apexcharts';
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
      [stroke]="strokeConfig()"
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
    background: 'transparent',
    foreColor: this.theme.currentMode() === 'dark' ? '#A1A1AA' : '#374151',
  }));

  readonly legendConfig: ApexLegend = { position: 'bottom' };

  readonly strokeConfig = computed<ApexStroke>(() => ({
    width: 2,
    colors: [this.theme.currentMode() === 'dark' ? '#232328' : '#ffffff'],
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
    this.colors ?? [this.config.primaryColor, '#EC5CF8', '#5B6CFF', '#34D399', '#FF8A65'],
  );
}
