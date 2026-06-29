Status: done

# 05 — Criar PieChartComponent

## O que construir

Criar `PieChartComponent` em `src/app/shared/ui/charts/pie-chart/`. Suporta gráfico de pizza e donut via input `donut`. Os dados de entrada para este componente têm formato diferente dos demais (categorias com valores únicos, não séries temporais).

## Critérios de aceite

- [ ] `@Input({ required: true }) labels: string[]` — categorias/fatias
- [ ] `@Input({ required: true }) series: number[]` — valores correspondentes a cada label
- [ ] `@Input({ required: true }) title: string`
- [ ] `@Input() donut?: boolean` — default: `false`; quando `true`, renderiza como donut
- [ ] `@Input() description?`, `height?`, `colors?`, `showLegend?` — mesmos defaults dos demais
- [ ] Legenda exibe labels e percentuais
- [ ] Modo dark/light atualiza o tema automaticamente
- [ ] Componente é `standalone: true`

## Bloqueado por

- [01 — Instalar ng-apexcharts](./01-instalar-e-configurar-ng-apexcharts.md)
- [sistema-de-tema/issues/02](../../sistema-de-tema/issues/02-implementar-theme-service.md)
