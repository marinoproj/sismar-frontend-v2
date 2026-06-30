Status: done

## Issue pai

[PRD — Menu Charts: Showcase de Tipos de Gráfico](../PRD.md)

## O que construir

Criar a página `BarChartsPageComponent` em `features/charts/pages/bar-charts-page/`, exibindo 2–3 exemplos do `BarChartComponent` existente com dados fictícios distintos.

Exemplos sugeridos:
1. "Receita por Categoria" — barras verticais, 6 categorias.
2. "Top 5 Produtos" — barras horizontais (via configuração do ApexCharts), ordenadas por valor.
3. "Vendas por Trimestre" — barras agrupadas (2 séries: metas vs realizado).

O resultado observável: acessar `/charts/bar` exibe a página com 2–3 gráficos de barra, breadcrumb "Charts > Bar Charts".

## Critérios de aceite

- [ ] `BarChartsPageComponent` criado e acessível em `/charts/bar`.
- [ ] Página exibe 2–3 instâncias do `BarChartComponent` com dados e títulos diferentes.
- [ ] Ao menos um gráfico exibe barras horizontais e outro barras verticais.
- [ ] Grid responsivo (1 col mobile, 2 col desktop).
- [ ] Cada gráfico em card com título descritivo.
- [ ] Breadcrumb exibe "Charts > Bar Charts".
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [charts-showcase/01 — Line Charts Page](01-line-charts-page.md) (routes.ts do módulo charts criado nessa issue)
