import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { LineChartComponent } from '../../../../shared/ui/charts/line-chart/line-chart.component';
import { BarChartComponent } from '../../../../shared/ui/charts/bar-chart/bar-chart.component';
import { AreaChartComponent } from '../../../../shared/ui/charts/area-chart/area-chart.component';
import { PieChartComponent } from '../../../../shared/ui/charts/pie-chart/pie-chart.component';
import { TimelineChartComponent } from '../../../../shared/ui/charts/timeline-chart/timeline-chart.component';
import { MixedChartComponent } from '../../../../shared/ui/charts/mixed-chart/mixed-chart.component';
import { TableComponent } from '../../../../shared/ui/table/table.component';
import { ColumnDef } from '../../../../shared/models/column-def.model';

@Component({
  selector: 'app-vendas-page',
  standalone: true,
  imports: [
    KpiCardComponent,
    LineChartComponent,
    BarChartComponent,
    AreaChartComponent,
    PieChartComponent,
    TimelineChartComponent,
    MixedChartComponent,
    TableComponent,
  ],
  templateUrl: './vendas-page.component.html',
})
export class VendasPageComponent {
  readonly dashboardService = inject(DashboardService);

  currentPage = signal(1);
  readonly pageSize = 5;

  get summary() {
    return this.dashboardService.summary();
  }

  get isLoading(): boolean {
    return !this.summary;
  }

  get pagedRows(): Record<string, unknown>[] {
    if (!this.summary) return [];
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.summary.tableRows.slice(start, start + this.pageSize) as unknown as Record<string, unknown>[];
  }

  readonly tableColumns: ColumnDef[] = [
    { key: 'id', label: '#', width: '60px', align: 'center' },
    { key: 'name', label: 'Nome' },
    { key: 'date', label: 'Data' },
    { key: 'status', label: 'Status' },
    { key: 'value', label: 'Valor', align: 'right' },
  ];

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
