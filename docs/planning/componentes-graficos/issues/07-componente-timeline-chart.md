Status: done

# 07 — Criar TimelineChartComponent

## O que construir

Criar `TimelineChartComponent` em `src/app/shared/ui/charts/timeline-chart/`. Gráfico de Gantt/timeline do ApexCharts para visualizar eventos ou tarefas ao longo do tempo com início e fim definidos. Cada série representa uma categoria/recurso e os dados são intervalos de tempo.

## Critérios de aceite

- [ ] `@Input({ required: true }) data: TimelineData[]` — interface `TimelineData { name: string; data: { x: string; y: [number, number] }[] }` onde `y` é `[startTimestamp, endTimestamp]`
- [ ] `@Input({ required: true }) title: string`
- [ ] `@Input() description?`, `height?`, `colors?` — mesmos defaults dos demais
- [ ] Eixo X exibe datas/horários em PT-BR
- [ ] Tooltip exibe nome do evento, início e fim formatados
- [ ] Modo dark/light atualiza o tema automaticamente
- [ ] Componente é `standalone: true`

## Bloqueado por

- [01 — Instalar ng-apexcharts](./01-instalar-e-configurar-ng-apexcharts.md)
- [sistema-de-tema/issues/02](../../sistema-de-tema/issues/02-implementar-theme-service.md)
