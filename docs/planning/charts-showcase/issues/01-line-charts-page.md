Status: done

## Issue pai

[PRD — Menu Charts: Showcase de Tipos de Gráfico](../PRD.md)

## O que construir

Criar a página `LineChartsPageComponent` em `features/charts/pages/line-charts-page/` e o arquivo de rotas `features/charts/routes.ts`, exibindo 2–3 exemplos do `LineChartComponent` existente com dados fictícios distintos.

Esta é também a issue que cria a estrutura base do módulo `features/charts/` (routes.ts), que as issues subsequentes de charts apenas completam com novas páginas.

Exemplos sugeridos de gráficos na página:
1. "Vendas Mensais" — série única, 12 meses.
2. "Comparativo Anual" — 2 séries (Ano Atual vs Ano Anterior), 12 meses.
3. "Métricas de Produto" — 3 séries (Visitas, Conversões, Receita) com eixo Y suavizado.

O resultado observável: acessar `/charts/line` exibe a página com 2–3 gráficos de linha em grid, breadcrumb "Charts > Line Charts" e o menu lateral com "Charts" expandido.

## Critérios de aceite

- [ ] `features/charts/routes.ts` criado com todas as rotas do módulo charts (linha, barra, misto, timeline, pizza) — rotas sem página real apontam para stub até suas issues serem implementadas.
- [ ] `LineChartsPageComponent` criado e acessível em `/charts/line`.
- [ ] Página exibe 2–3 instâncias do `LineChartComponent` com dados e títulos diferentes.
- [ ] Gráficos organizados em grid responsivo (1 col mobile, 2 col desktop).
- [ ] Cada gráfico em card com título descritivo.
- [ ] Breadcrumb exibe "Charts > Line Charts".
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [infraestrutura-ui/02 — Routing skeleton](../../infraestrutura-ui/issues/02-routing-skeleton.md)
- [infraestrutura-ui/03 — Breadcrumb](../../infraestrutura-ui/issues/03-breadcrumb-component.md)
