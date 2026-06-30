import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { AcoesRepository } from './acoes.repository';
import { AcoesSummary } from '../models/acoes.model';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

@Injectable()
export class AcoesMockRepository implements AcoesRepository {
  getSummary(): Observable<AcoesSummary> {
    return of(this.buildSummary()).pipe(delay(800));
  }

  private buildSummary(): AcoesSummary {
    return {
      kpis: [
        { label: 'Valor Total da Carteira', value: 'R$ 245.340', change: 8.4, icon: 'ri-funds-line' },
        { label: 'Rentabilidade', value: '+14,2%', change: 14.2, icon: 'ri-percent-line' },
        { label: 'Número de Ativos', value: '8', change: 0, icon: 'ri-stack-line' },
        { label: 'Operações no Mês', value: '23', change: -2.1, icon: 'ri-exchange-line' },
      ],
      tickers: [
        { symbol: 'PETR4', name: 'Petrobras PN', currentValue: 37.85, change: 2.3, trend: 'up' },
        { symbol: 'VALE3', name: 'Vale ON', currentValue: 68.42, change: -1.1, trend: 'down' },
        { symbol: 'ITUB4', name: 'Itaú Unibanco PN', currentValue: 32.10, change: 0.8, trend: 'up' },
        { symbol: 'BBDC4', name: 'Bradesco PN', currentValue: 14.55, change: -0.4, trend: 'down' },
        { symbol: 'WEGE3', name: 'WEG ON', currentValue: 51.20, change: 3.1, trend: 'up' },
        { symbol: 'MGLU3', name: 'Magazine Luiza ON', currentValue: 4.78, change: -2.8, trend: 'down' },
      ],
      pieLabels: ['Ações', 'FIIs', 'Renda Fixa', 'Caixa'],
      pieSeries: [55, 25, 15, 5],
      lineChart: [
        {
          name: 'Valor da Carteira',
          data: [198000, 205000, 211000, 208000, 218000, 225000, 220000, 232000, 238000, 241000, 243000, 245340],
        },
      ],
      operations: [
        { date: '27/06/2026', ticker: 'PETR4', type: 'Compra', quantity: 100, unitPrice: 'R$ 37,10', total: 'R$ 3.710,00' },
        { date: '25/06/2026', ticker: 'WEGE3', type: 'Compra', quantity: 50, unitPrice: 'R$ 50,80', total: 'R$ 2.540,00' },
        { date: '22/06/2026', ticker: 'VALE3', type: 'Venda', quantity: 200, unitPrice: 'R$ 69,50', total: 'R$ 13.900,00' },
        { date: '20/06/2026', ticker: 'ITUB4', type: 'Compra', quantity: 300, unitPrice: 'R$ 31,90', total: 'R$ 9.570,00' },
        { date: '18/06/2026', ticker: 'MGLU3', type: 'Venda', quantity: 500, unitPrice: 'R$ 5,20', total: 'R$ 2.600,00' },
        { date: '15/06/2026', ticker: 'BBDC4', type: 'Compra', quantity: 400, unitPrice: 'R$ 14,80', total: 'R$ 5.920,00' },
        { date: '12/06/2026', ticker: 'PETR4', type: 'Venda', quantity: 150, unitPrice: 'R$ 36,40', total: 'R$ 5.460,00' },
        { date: '10/06/2026', ticker: 'WEGE3', type: 'Compra', quantity: 80, unitPrice: 'R$ 49,70', total: 'R$ 3.976,00' },
      ],
      totalOperations: 8,
    };
  }
}
