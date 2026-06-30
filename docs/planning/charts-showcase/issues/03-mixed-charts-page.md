Status: done

## Issue pai

[PRD — Menu Charts: Showcase de Tipos de Gráfico](../PRD.md)

## O que construir

Criar a página `MixedChartsPageComponent` em `features/charts/pages/mixed-charts-page/`, exibindo 2 exemplos do `MixedChartComponent` existente com dados fictícios distintos.

Exemplos sugeridos:
1. "Receita e Margem" — barras para receita + linha para margem percentual no mesmo eixo.
2. "Tráfego e Conversão" — barras para visitas + linha para taxa de conversão.

O resultado observável: acessar `/charts/mixed` exibe a página com gráficos combinados, breadcrumb "Charts > Mixed Charts".

## Critérios de aceite

- [ ] `MixedChartsPageComponent` criado e acessível em `/charts/mixed`.
- [ ] Página exibe 2 instâncias do `MixedChartComponent` com dados e títulos diferentes.
- [ ] Cada gráfico combina visivelmente dois tipos (ex: barra + linha).
- [ ] Grid responsivo.
- [ ] Breadcrumb exibe "Charts > Mixed Charts".
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [charts-showcase/01 — Line Charts Page](01-line-charts-page.md)
