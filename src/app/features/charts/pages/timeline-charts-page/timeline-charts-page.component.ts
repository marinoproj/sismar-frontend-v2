import { Component } from '@angular/core';
import { TimelineChartComponent } from '../../../../shared/ui/charts/timeline-chart/timeline-chart.component';
import { TimelineData } from '../../../../shared/models/chart-data.model';

const now = Date.now();
const DAY = 86400000;

@Component({
  selector: 'app-timeline-charts-page',
  standalone: true,
  imports: [TimelineChartComponent],
  templateUrl: './timeline-charts-page.component.html',
})
export class TimelineChartsPageComponent {
  readonly projectTimeline: TimelineData[] = [
    { name: 'Planejamento', data: [{ x: 'Projeto A', y: [now - 14 * DAY, now - 10 * DAY] }] },
    { name: 'Desenvolvimento', data: [{ x: 'Projeto A', y: [now - 10 * DAY, now - 3 * DAY] }] },
    { name: 'Testes', data: [{ x: 'Projeto A', y: [now - 3 * DAY, now + 1 * DAY] }] },
    { name: 'Deploy', data: [{ x: 'Projeto A', y: [now + 1 * DAY, now + 2 * DAY] }] },
  ];

  readonly processTimeline: TimelineData[] = [
    {
      name: 'Coleta',
      data: [
        { x: 'Sensor A', y: [now - 6 * DAY, now - 5 * DAY] },
        { x: 'Sensor B', y: [now - 4 * DAY, now - 3 * DAY] },
      ],
    },
    {
      name: 'Processamento',
      data: [
        { x: 'CPU 1', y: [now - 5 * DAY, now - 3 * DAY] },
        { x: 'CPU 2', y: [now - 3 * DAY, now - 1 * DAY] },
      ],
    },
    {
      name: 'Publicação',
      data: [
        { x: 'API', y: [now - 3 * DAY, now - 1 * DAY] },
        { x: 'Cache', y: [now - 1 * DAY, now] },
      ],
    },
  ];
}
