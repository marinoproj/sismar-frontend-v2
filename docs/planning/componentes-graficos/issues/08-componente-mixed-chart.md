Status: done

# 08 — Criar MixedChartComponent

## O que construir

Criar `MixedChartComponent` em `src/app/shared/ui/charts/mixed-chart/`. Combinação de gráfico de linha e barra no mesmo eixo. Cada série define seu próprio tipo via propriedade `type`. Útil para comparar métricas de naturezas diferentes (ex: volume em barras + tendência em linha).

## Critérios de aceite

- [ ] `@Input({ required: true }) data: MixedChartData[]` — interface `MixedChartData extends ChartData { type: 'line' | 'bar' | 'area' }`
- [ ] `@Input({ required: true }) title: string`
- [ ] `@Input() description?`, `height?`, `colors?`, `showLegend?` — mesmos defaults dos demais
- [ ] Cada série renderiza com o tipo correto (linha ou barra) no mesmo gráfico
- [ ] Modo dark/light atualiza o tema automaticamente
- [ ] Componente é `standalone: true`
- [ ] Teste: renderiza sem erros com ao menos uma série `line` e uma série `bar`

## Bloqueado por

- [01 — Instalar ng-apexcharts](./01-instalar-e-configurar-ng-apexcharts.md)
- [sistema-de-tema/issues/02](../../sistema-de-tema/issues/02-implementar-theme-service.md)
