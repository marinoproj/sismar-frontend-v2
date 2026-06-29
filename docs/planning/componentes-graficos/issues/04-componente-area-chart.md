Status: done

# 04 — Criar AreaChartComponent

## O que construir

Criar `AreaChartComponent` em `src/app/shared/ui/charts/area-chart/`. Gráfico de área com preenchimento gradiente abaixo da linha. Suporta múltiplas séries com áreas sobrepostas ou empilhadas via input `stacked`.

## Critérios de aceite

- [ ] `@Input({ required: true }) data: ChartData[]`
- [ ] `@Input({ required: true }) title: string`
- [ ] `@Input() stacked?: boolean` — default: `false`; quando `true`, áreas são empilhadas
- [ ] `@Input() description?`, `height?`, `colors?`, `showLegend?` — mesmos defaults dos demais
- [ ] Preenchimento com gradiente visível abaixo da linha em todas as séries
- [ ] Modo dark/light atualiza o tema automaticamente
- [ ] Componente é `standalone: true`

## Bloqueado por

- [01 — Instalar ng-apexcharts](./01-instalar-e-configurar-ng-apexcharts.md)
- [sistema-de-tema/issues/02](../../sistema-de-tema/issues/02-implementar-theme-service.md)
