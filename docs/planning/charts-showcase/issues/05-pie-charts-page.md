Status: done

## Issue pai

[PRD — Menu Charts: Showcase de Tipos de Gráfico](../PRD.md)

## O que construir

Criar a página `PieChartsPageComponent` em `features/charts/pages/pie-charts-page/`, exibindo 3 exemplos do `PieChartComponent` existente: modo pizza, modo donut e modo semi-donut (ou pizza com legenda lateral), com dados fictícios distintos.

Exemplos sugeridos:
1. "Distribuição de Vendas por Canal" — pizza clássica (Online, Loja Física, Parceiros, Outros).
2. "Composição de Despesas" — donut (Pessoal, Marketing, Infra, Outros).
3. "Market Share" — pizza com rótulos externos (Empresa A, B, C, D).

O resultado observável: acessar `/charts/pie` exibe a página com variações de pizza/donut, breadcrumb "Charts > Pie Charts".

## Critérios de aceite

- [ ] `PieChartsPageComponent` criado e acessível em `/charts/pie`.
- [ ] Página exibe 2–3 instâncias do `PieChartComponent` com dados e títulos diferentes.
- [ ] Ao menos um exemplo em modo pizza e um em modo donut.
- [ ] Grid responsivo.
- [ ] Breadcrumb exibe "Charts > Pie Charts".
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [charts-showcase/01 — Line Charts Page](01-line-charts-page.md)
