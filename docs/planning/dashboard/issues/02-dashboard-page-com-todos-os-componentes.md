Status: done

# 02 — Implementar DashboardPageComponent com todos os gráficos e tabela

## O que construir

Implementar `DashboardPageComponent` consumindo o `DashboardService` e compondo a página com: 4 `KpiCardComponent`, todos os 7 componentes de gráfico (`LineChart`, `BarChart`, `AreaChart`, `PieChart`, `TimeSeriesChart`, `TimelineChart`, `MixedChart`) e o `TableComponent` com paginação e skeleton loading. Os dados vêm do `DashboardService` (via mock). O layout usa grid responsivo com Tailwind.

## Critérios de aceite

- [ ] Acessar `/dashboard` autenticado exibe a página completa sem erros no console
- [ ] 4 KPI cards no topo com valores mockados (ex: Total de Registros, Usuários Ativos, Receita, Alertas)
- [ ] `LineChartComponent` exibindo vendas mensais (12 meses de dados)
- [ ] `BarChartComponent` exibindo comparativo por categoria
- [ ] `AreaChartComponent` exibindo receita acumulada
- [ ] `PieChartComponent` exibindo distribuição por categoria
- [ ] `TimeSeriesChartComponent` exibindo série horária com zoom habilitado
- [ ] `TimelineChartComponent` exibindo etapas de processo com início e fim
- [ ] `MixedChartComponent` exibindo volume (barra) + tendência (linha)
- [ ] `TableComponent` com skeleton loading nos primeiros 800ms, depois exibe 5 registros com paginação (total: 20)
- [ ] Toggle dark/light no header altera o tema de todos os gráficos simultaneamente
- [ ] Layout responsivo: 1 coluna em mobile, 2 colunas em tablet, conforme o conteúdo em desktop
- [ ] Item "Dashboard" no sidebar navega para `/dashboard` e fica destacado como rota ativa

## Bloqueado por

- [01 — Criar estrutura feature dashboard](./01-criar-estrutura-feature-dashboard.md)
- [componentes-graficos/issues/08](../../componentes-graficos/issues/08-componente-mixed-chart.md)
- [componente-tabela/issues/02](../../componente-tabela/issues/02-adicionar-loading-e-paginacao.md)
