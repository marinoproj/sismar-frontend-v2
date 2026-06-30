Status: done

## Issue pai

[PRD — Menu Charts: Showcase de Tipos de Gráfico](../PRD.md)

## O que construir

Criar a página `TimelineChartsPageComponent` em `features/charts/pages/timeline-charts-page/`, exibindo 2 exemplos do `TimelineChartComponent` existente com dados fictícios distintos.

Exemplos sugeridos:
1. "Cronograma de Projetos" — faixas horizontais por projeto com início e fim fictícios.
2. "Fases de Produto" — faixas por fase (Planejamento, Desenvolvimento, QA, Lançamento).

O resultado observável: acessar `/charts/timeline` exibe a página com gráficos de linha do tempo, breadcrumb "Charts > Timeline Charts".

## Critérios de aceite

- [ ] `TimelineChartsPageComponent` criado e acessível em `/charts/timeline`.
- [ ] Página exibe 2 instâncias do `TimelineChartComponent` com dados e títulos diferentes.
- [ ] Faixas de evento visíveis com rótulos.
- [ ] Grid responsivo.
- [ ] Breadcrumb exibe "Charts > Timeline Charts".
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [charts-showcase/01 — Line Charts Page](01-line-charts-page.md)
