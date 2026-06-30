Status: done

## Issue pai

[PRD — Dashboards: Vendas e Ações](../PRD.md)

## O que construir

Mover o `DashboardPageComponent` atual para `VendasPageComponent` em `features/dashboard/pages/vendas-page/`, atualizando a rota para `/dashboard/vendas`. O conteúdo da página (KPI cards, gráficos, tabela de pedidos) é preservado integralmente — apenas o nome do componente, o path do arquivo e o dado de rota (`breadcrumb`) mudam.

O resultado observável: acessar `/dashboard/vendas` exibe exatamente o que hoje está em `/dashboard`, com breadcrumb "Dashboards > Vendas" no topo.

## Critérios de aceite

- [ ] Arquivo `dashboard-page.component.ts` renomeado/movido para `features/dashboard/pages/vendas-page/vendas-page.component.ts`.
- [ ] Classe renomeada de `DashboardPageComponent` para `VendasPageComponent`.
- [ ] Rota `dashboard/vendas` aponta para `VendasPageComponent`.
- [ ] Conteúdo da página (KPIs, gráficos, tabela) é idêntico ao original.
- [ ] Breadcrumb exibe "Dashboards > Vendas" na página.
- [ ] `/dashboard` redireciona para `/dashboard/vendas` (já configurado na issue de routing, apenas verificar).
- [ ] Nenhuma referência ao nome antigo `DashboardPageComponent` permanece no codebase.

## Bloqueado por

- [infraestrutura-ui/02 — Routing skeleton](../../infraestrutura-ui/issues/02-routing-skeleton.md)
