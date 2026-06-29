Status: done

# 06 — Criar TimeSeriesChartComponent

## O que construir

Criar `TimeSeriesChartComponent` em `src/app/shared/ui/charts/time-series-chart/`. Gráfico de linha otimizado para dados temporais densos com zoom e pan habilitados via toolbar do ApexCharts. O eixo X espera timestamps (Unix ms ou ISO string). Especialmente útil para sistemas como AIS (trilha de embarcações) e Meteorologia (séries climáticas).

## Critérios de aceite

- [ ] `@Input({ required: true }) data: ChartData[]` — `data` de cada série deve ser array de `[timestamp, valor]`
- [ ] `@Input({ required: true }) title: string`
- [ ] Toolbar de zoom habilitada (zoom in, zoom out, reset, pan)
- [ ] Eixo X formatado como data/hora em PT-BR (`dd/MM HH:mm`)
- [ ] `@Input() zoomEnabled?: boolean` — default: `true`
- [ ] `@Input() description?`, `height?`, `colors?`, `showLegend?` — mesmos defaults dos demais
- [ ] Modo dark/light atualiza o tema automaticamente
- [ ] Componente é `standalone: true`

## Bloqueado por

- [01 — Instalar ng-apexcharts](./01-instalar-e-configurar-ng-apexcharts.md)
- [sistema-de-tema/issues/02](../../sistema-de-tema/issues/02-implementar-theme-service.md)
