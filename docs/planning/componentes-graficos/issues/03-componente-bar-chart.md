Status: done

# 03 — Criar BarChartComponent

## O que construir

Criar `BarChartComponent` em `src/app/shared/ui/charts/bar-chart/`. Suporta barras verticais (colunas) e horizontais via input `orientation`. A estrutura de inputs deve ser idêntica ao `LineChartComponent` com o acréscimo do input `orientation`.

## Critérios de aceite

- [ ] `@Input({ required: true }) data: ChartData[]`
- [ ] `@Input({ required: true }) title: string`
- [ ] `@Input() orientation?: 'vertical' | 'horizontal'` — default: `'vertical'`
- [ ] `@Input() description?: string`, `height?`, `colors?`, `showLegend?` — mesmos defaults do `LineChartComponent`
- [ ] `orientation: 'horizontal'` inverte os eixos corretamente no ApexCharts
- [ ] Gráfico renderiza corretamente com apenas `data` e `title` fornecidos
- [ ] Modo dark/light atualiza o tema automaticamente
- [ ] Componente é `standalone: true`

## Bloqueado por

- [01 — Instalar ng-apexcharts](./01-instalar-e-configurar-ng-apexcharts.md)
- [sistema-de-tema/issues/02](../../sistema-de-tema/issues/02-implementar-theme-service.md)
