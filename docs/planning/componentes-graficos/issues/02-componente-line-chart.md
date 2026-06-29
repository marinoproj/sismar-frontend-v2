Status: done

# 02 — Criar LineChartComponent

## O que construir

Criar `LineChartComponent` em `src/app/shared/ui/charts/line-chart/`. O componente encapsula o `apx-chart` do ng-apexcharts configurado para gráfico de linha. Deve aceitar múltiplas séries, responder ao modo dark/light e usar a cor primária do `ThemeConfig` como cor padrão.

## Critérios de aceite

- [ ] `@Input({ required: true }) data: ChartData[]` — séries de dados
- [ ] `@Input({ required: true }) title: string` — título exibido no gráfico
- [ ] `@Input() description?: string` — subtítulo opcional
- [ ] `@Input() height?: number` — default: 350
- [ ] `@Input() colors?: string[]` — default: cor primária do `ThemeConfig`
- [ ] `@Input() showLegend?: boolean` — default: `true`
- [ ] Gráfico renderiza corretamente com apenas `data` e `title` fornecidos
- [ ] Modo dark/light altera o tema visual do ApexCharts automaticamente via Signal
- [ ] Componente é `standalone: true` e pode ser importado diretamente em qualquer feature
- [ ] Teste: renderiza sem erros com inputs mínimos; `theme.mode` muda quando `ThemeService.currentMode` muda

## Bloqueado por

- [01 — Instalar ng-apexcharts](./01-instalar-e-configurar-ng-apexcharts.md)
- [sistema-de-tema/issues/02](../../sistema-de-tema/issues/02-implementar-theme-service.md)
