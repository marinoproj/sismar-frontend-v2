import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../shared/ui/table/table.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { ProgressComponent } from '../../../../shared/ui/progress/progress.component';
import { ColumnDef } from '../../../../shared/models/column-def.model';

interface Pedido {
  id: number;
  cliente: string;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  progresso: number;
  valor: string;
  data: string;
}

const PEDIDOS_MOCK: Pedido[] = [
  { id: 1001, cliente: 'Ana Beatriz Souza', status: 'Entregue', progresso: 100, valor: 'R$ 1.250,00', data: '02/06/2026' },
  { id: 1002, cliente: 'Carlos Eduardo Lima', status: 'Enviado', progresso: 80, valor: 'R$ 340,50', data: '03/06/2026' },
  { id: 1003, cliente: 'Beatriz Nogueira', status: 'Processando', progresso: 45, valor: 'R$ 2.180,00', data: '04/06/2026' },
  { id: 1004, cliente: 'Diego Fernandes', status: 'Pendente', progresso: 10, valor: 'R$ 89,90', data: '05/06/2026' },
  { id: 1005, cliente: 'Fernanda Torres', status: 'Cancelado', progresso: 0, valor: 'R$ 560,00', data: '06/06/2026' },
  { id: 1006, cliente: 'Gustavo Ramos', status: 'Entregue', progresso: 100, valor: 'R$ 720,30', data: '07/06/2026' },
  { id: 1007, cliente: 'Helena Martins', status: 'Enviado', progresso: 75, valor: 'R$ 1.980,00', data: '08/06/2026' },
  { id: 1008, cliente: 'Igor Cavalcanti', status: 'Processando', progresso: 30, valor: 'R$ 415,00', data: '09/06/2026' },
  { id: 1009, cliente: 'Julia Pereira', status: 'Pendente', progresso: 5, valor: 'R$ 3.050,00', data: '10/06/2026' },
  { id: 1010, cliente: 'Lucas Andrade', status: 'Entregue', progresso: 100, valor: 'R$ 199,90', data: '11/06/2026' },
  { id: 1011, cliente: 'Mariana Costa', status: 'Enviado', progresso: 90, valor: 'R$ 875,00', data: '12/06/2026' },
  { id: 1012, cliente: 'Nathan Oliveira', status: 'Cancelado', progresso: 0, valor: 'R$ 640,00', data: '13/06/2026' },
  { id: 1013, cliente: 'Olivia Barros', status: 'Processando', progresso: 55, valor: 'R$ 1.120,00', data: '14/06/2026' },
  { id: 1014, cliente: 'Pedro Henrique Alves', status: 'Entregue', progresso: 100, valor: 'R$ 2.430,00', data: '15/06/2026' },
  { id: 1015, cliente: 'Rafaela Duarte', status: 'Pendente', progresso: 15, valor: 'R$ 310,00', data: '16/06/2026' },
  { id: 1016, cliente: 'Sergio Nunes', status: 'Enviado', progresso: 65, valor: 'R$ 950,50', data: '17/06/2026' },
  { id: 1017, cliente: 'Tatiane Rocha', status: 'Entregue', progresso: 100, valor: 'R$ 1.600,00', data: '18/06/2026' },
  { id: 1018, cliente: 'Vinicius Teixeira', status: 'Processando', progresso: 40, valor: 'R$ 275,00', data: '19/06/2026' },
  { id: 1019, cliente: 'Yasmin Carvalho', status: 'Cancelado', progresso: 0, valor: 'R$ 480,00', data: '20/06/2026' },
  { id: 1020, cliente: 'André Luiz Farias', status: 'Enviado', progresso: 70, valor: 'R$ 1.340,00', data: '21/06/2026' },
  { id: 1021, cliente: 'Bruna Xavier', status: 'Pendente', progresso: 20, valor: 'R$ 90,00', data: '22/06/2026' },
  { id: 1022, cliente: 'Caio Monteiro', status: 'Entregue', progresso: 100, valor: 'R$ 3.720,00', data: '23/06/2026' },
];

@Component({
  selector: 'app-tables-page',
  standalone: true,
  imports: [TableComponent, BadgeComponent, ProgressComponent],
  templateUrl: './tables-page.component.html',
})
export class TablesPageComponent {
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;
  @ViewChild('progressoTpl', { static: true }) progressoTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;

  readonly pedidosBasicos = PEDIDOS_MOCK.slice(0, 5) as unknown as Record<string, unknown>[];

  readonly pedidosCompletos = PEDIDOS_MOCK;
  readonly pageSize = 5;
  currentPage = signal(1);

  searchTerm = signal('');

  readonly columnsSimples: ColumnDef[] = [
    { key: 'id', label: '#', width: '70px', align: 'center' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'status', label: 'Status' },
    { key: 'valor', label: 'Valor', align: 'right' },
    { key: 'data', label: 'Data', align: 'right' },
  ];

  get columnsCustom(): ColumnDef[] {
    return [
      { key: 'id', label: '#', width: '70px', align: 'center' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'status', label: 'Status', template: this.statusTpl },
      { key: 'progresso', label: 'Progresso da entrega', template: this.progressoTpl, width: '220px' },
      { key: 'valor', label: 'Valor', align: 'right' },
    ];
  }

  get pagedPedidos(): Record<string, unknown>[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.pedidosCompletos.slice(start, start + this.pageSize) as unknown as Record<string, unknown>[];
  }

  get filteredPedidos(): Record<string, unknown>[] {
    const term = this.searchTerm().trim().toLowerCase();
    const filtered = term
      ? this.pedidosCompletos.filter((p) => p.cliente.toLowerCase().includes(term))
      : this.pedidosCompletos;
    return filtered as unknown as Record<string, unknown>[];
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  statusVariant(status: Pedido['status']): 'default' | 'primary' | 'success' | 'warning' | 'danger' {
    const map: Record<Pedido['status'], 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
      Pendente: 'warning',
      Processando: 'primary',
      Enviado: 'primary',
      Entregue: 'success',
      Cancelado: 'danger',
    };
    return map[status];
  }

  progressoVariant(progresso: number): 'primary' | 'success' | 'warning' | 'danger' {
    if (progresso === 100) return 'success';
    if (progresso >= 50) return 'primary';
    if (progresso > 0) return 'warning';
    return 'danger';
  }
}
