import { ChartData, MixedChartData, TimelineData } from '../../../shared/models/chart-data.model';

export interface KpiCard {
  label: string;
  value: string | number;
  change: number;
  icon: string;
}

export interface TableRow {
  id: number;
  name: string;
  date: string;
  status: string;
  value: string;
}

export interface DashboardSummary {
  kpis: KpiCard[];
  lineChart: ChartData[];
  barChart: ChartData[];
  areaChart: ChartData[];
  pieLabels: string[];
  pieSeries: number[];
  timeSeries: ChartData[];
  timeline: TimelineData[];
  mixedChart: MixedChartData[];
  tableRows: TableRow[];
  tableTotalItems: number;
}
