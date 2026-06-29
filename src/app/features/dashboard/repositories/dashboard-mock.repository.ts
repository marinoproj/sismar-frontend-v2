import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { DashboardRepository } from './dashboard.repository';
import { DashboardSummary } from '../models/dashboard.model';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const now = Date.now();
const DAY = 86400000;

@Injectable()
export class DashboardMockRepository implements DashboardRepository {
  getSummary(): Observable<DashboardSummary> {
    return of(this.buildSummary()).pipe(delay(800));
  }

  private buildSummary(): DashboardSummary {
    return {
      kpis: [
        { label: 'Total de Registros', value: '12.847', change: 5.4, icon: 'ri-file-list-3-line' },
        { label: 'Usuários Ativos', value: '3.241', change: 2.1, icon: 'ri-user-3-line' },
        { label: 'Receita Total', value: 'R$ 98.340', change: 7.6, icon: 'ri-money-dollar-circle-line' },
        { label: 'Alertas', value: 14, change: -3.2, icon: 'ri-alarm-warning-line' },
      ],
      lineChart: [
        { name: 'Vendas', data: [280, 320, 410, 390, 480, 520, 610, 580, 640, 700, 720, 810] },
        { name: 'Meta', data: [300, 350, 380, 420, 450, 500, 550, 600, 620, 660, 700, 750] },
      ],
      barChart: [
        { name: 'Produtos', data: [44, 55, 57, 56, 61, 58, 63, 60, 66] },
        { name: 'Serviços', data: [76, 85, 101, 98, 87, 105, 91, 114, 94] },
      ],
      areaChart: [
        { name: 'Receita', data: MONTHS.map((_, i) => 10000 + i * 3500 + Math.floor(Math.random() * 2000)) },
        { name: 'Custo', data: MONTHS.map((_, i) => 6000 + i * 1800 + Math.floor(Math.random() * 1000)) },
      ],
      pieLabels: ['Eletrônicos', 'Vestuário', 'Alimentação', 'Serviços', 'Outros'],
      pieSeries: [35, 25, 18, 14, 8],
      timeSeries: [
        {
          name: 'Temperatura (°C)',
          data: Array.from({ length: 7 * 24 }, (_, i) => [
            now - (7 * 24 - i) * 3600000,
            20 + Math.sin(i / 12) * 8 + Math.random() * 3,
          ]),
        },
      ],
      timeline: [
        {
          name: 'Coleta',
          data: [{ x: 'Sensor A', y: [now - 6 * DAY, now - 5 * DAY] }],
        },
        {
          name: 'Processamento',
          data: [{ x: 'Proc. 1', y: [now - 5 * DAY, now - 3 * DAY] }],
        },
        {
          name: 'Publicação',
          data: [{ x: 'API', y: [now - 3 * DAY, now - 1 * DAY] }],
        },
      ],
      mixedChart: [
        { name: 'Volume', type: 'bar', data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 65] },
        { name: 'Tendência', type: 'line', data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 50, 60, 70] },
      ],
      tableRows: Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Registro ${String(i + 1).padStart(3, '0')}`,
        date: new Date(now - i * DAY).toLocaleDateString('pt-BR'),
        status: i % 3 === 0 ? 'Ativo' : i % 3 === 1 ? 'Pendente' : 'Inativo',
        value: `R$ ${(1000 + i * 250).toLocaleString('pt-BR')}`,
      })),
      tableTotalItems: 20,
    };
  }
}
