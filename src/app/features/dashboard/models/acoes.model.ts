import { ChartData } from '../../../shared/models/chart-data.model';

export interface AcoesKpi {
  label: string;
  value: string;
  change: number;
  icon: string;
}

export interface Ticker {
  symbol: string;
  name: string;
  currentValue: number;
  change: number;
  trend: 'up' | 'down';
}

export interface AcoesOperation {
  date: string;
  ticker: string;
  type: 'Compra' | 'Venda';
  quantity: number;
  unitPrice: string;
  total: string;
}

export interface AcoesSummary {
  kpis: AcoesKpi[];
  tickers: Ticker[];
  pieLabels: string[];
  pieSeries: number[];
  lineChart: ChartData[];
  operations: AcoesOperation[];
  totalOperations: number;
}
