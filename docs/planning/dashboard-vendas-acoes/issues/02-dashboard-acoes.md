Status: done

## Issue pai

[PRD — Dashboards: Vendas e Ações](../PRD.md)

## O que construir

Criar o `TickerCardComponent` e o `AcoesPageComponent`, implementando a página de dashboard financeiro em `/dashboard/acoes`.

**TickerCardComponent** — componente reutilizável em `features/dashboard/components/ticker-card/`. Exibe: símbolo do ativo (ex: PETR4), nome completo, valor atual formatado como moeda, variação percentual com cor condicional (verde para positivo, vermelho para negativo) e mini ícone de seta.

**AcoesPageComponent** — layout em blocos:
1. Linha de 4 KPI cards (Valor da Carteira, Rentabilidade no Mês, Número de Ativos, Operações no Mês) usando o `KpiCardComponent` existente.
2. Grade de 6 `TickerCardComponent` com tickers fictícios (ex: PETR4, VALE3, ITUB4, BBDC4, WEGE3, MGLU3).
3. Linha com `PieChartComponent` em modo donut (Ações / FIIs / Renda Fixa) e `LineChartComponent` (evolução do portfólio nos últimos 12 meses) lado a lado.
4. `TableComponent` com operações recentes: colunas Data, Ticker, Tipo (Compra/Venda), Qtd, Preço Unit., Total. Sem actions nesta tabela.

Todos os dados são mock estáticos definidos diretamente no componente ou em um `AcoesMockRepository`.

O resultado observável: acessar `/dashboard/acoes` exibe uma página completa com KPIs, tickers, gráficos e tabela, com breadcrumb "Dashboards > Ações".

## Critérios de aceite

- [ ] `TickerCardComponent` criado com `@Input()`: `symbol`, `name`, `currentValue: number`, `change: number`, `trend: 'up' | 'down'`.
- [ ] Variação positiva exibida em verde, negativa em vermelho.
- [ ] `AcoesPageComponent` criado em `features/dashboard/pages/acoes-page/`.
- [ ] 4 KPI cards visíveis no topo da página com dados fictícios.
- [ ] 6 TickerCards visíveis com dados fictícios distintos.
- [ ] Gráfico donut (PieChartComponent) exibe 3 categorias (Ações, FIIs, Renda Fixa) com dados fictícios.
- [ ] Gráfico de linha (LineChartComponent) exibe evolução mensal fictícia de 12 meses.
- [ ] Tabela de operações exibe pelo menos 5 linhas com dados fictícios.
- [ ] Breadcrumb exibe "Dashboards > Ações".
- [ ] Página responsiva: KPI cards e TickerCards quebram em grid menor em mobile.
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [dashboard-vendas-acoes/01 — Dashboard Vendas](01-dashboard-vendas.md) (para garantir que a estrutura de routes do dashboard está finalizada)
- [infraestrutura-ui/03 — Breadcrumb](../../infraestrutura-ui/issues/03-breadcrumb-component.md)
