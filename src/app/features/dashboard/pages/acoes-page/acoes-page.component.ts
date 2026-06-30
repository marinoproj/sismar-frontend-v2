import { Component, inject, signal } from '@angular/core';
import { AcoesService } from '../../services/acoes.service';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { TickerCardComponent } from '../../../../shared/ui/ticker-card/ticker-card.component';
import { PieChartComponent } from '../../../../shared/ui/charts/pie-chart/pie-chart.component';
import { LineChartComponent } from '../../../../shared/ui/charts/line-chart/line-chart.component';
import { TableComponent } from '../../../../shared/ui/table/table.component';
import { ColumnDef, TableAction } from '../../../../shared/models/column-def.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-acoes-page',
  standalone: true,
  imports: [KpiCardComponent, TickerCardComponent, PieChartComponent, LineChartComponent, TableComponent],
  templateUrl: './acoes-page.component.html',
})
export class AcoesPageComponent {
  readonly acoesService = inject(AcoesService);
  private readonly toastService = inject(ToastService);

  currentPage = signal(1);
  readonly pageSize = 5;

  get summary() {
    return this.acoesService.summary();
  }

  get isLoading(): boolean {
    return !this.summary;
  }

  get pagedRows(): Record<string, unknown>[] {
    if (!this.summary) return [];
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.summary.operations.slice(start, start + this.pageSize) as unknown as Record<string, unknown>[];
  }

  readonly tableColumns: ColumnDef[] = [
    { key: 'date', label: 'Data', width: '100px' },
    { key: 'ticker', label: 'Ticker', width: '80px', align: 'center' },
    { key: 'type', label: 'Tipo', width: '80px', align: 'center' },
    { key: 'quantity', label: 'Qtd', align: 'right' },
    { key: 'unitPrice', label: 'Preço Unit.', align: 'right' },
    { key: 'total', label: 'Total', align: 'right' },
  ];

  readonly tableActions: TableAction[] = [
    {
      label: 'Editar',
      icon: 'ri-edit-line',
      variant: 'primary',
      action: (row) => this.toastService.show({ message: `Editando operação ${row['ticker']} (${row['date']})`, type: 'info' }),
    },
    {
      label: 'Excluir',
      icon: 'ri-delete-bin-line',
      variant: 'danger',
      action: (row) => this.toastService.show({ message: `Operação ${row['ticker']} excluída.`, type: 'success' }),
    },
  ];

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
