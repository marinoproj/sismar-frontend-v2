Status: done

## Issue pai

[PRD — Infraestrutura de UI](../PRD.md)

## O que construir

Registrar todas as rotas dos novos módulos em `app.routes.ts` e reestruturar as rotas do dashboard, de modo que o esqueleto de navegação esteja completo antes da implementação de qualquer página de conteúdo.

Mudanças de roteamento:
- `/dashboard` redireciona para `/dashboard/vendas`.
- `dashboardRoutes` ganha rotas filhas `vendas` e `acoes` (ambas apontando para um componente stub mínimo por enquanto).
- Novas entradas lazy em `app.routes.ts` para `/charts/*`, `/ui-elements/*` e `/maps`.
- Cada rota carrega `data: { breadcrumb: 'Label' }` com o label correto para o breadcrumb.
- A rota pai `dashboard` carrega `data: { breadcrumb: 'Dashboards' }`; as filhas carregam `data: { breadcrumb: 'Vendas' }` e `data: { breadcrumb: 'Ações' }`.

O resultado observável: navegar para qualquer uma das novas URLs não resulta em 404 (cai em uma página stub ou redirect). Os dados de rota estão presentes e prontos para o `BreadcrumbComponent` (issue 03) ler.

## Critérios de aceite

- [ ] `/dashboard` redireciona para `/dashboard/vendas` (sem 404).
- [ ] `/dashboard/vendas` carrega sem 404 (stub mínimo aceitável).
- [ ] `/dashboard/acoes` carrega sem 404 (stub mínimo aceitável).
- [ ] `/charts/line`, `/charts/bar`, `/charts/mixed`, `/charts/timeline`, `/charts/pie` carregam sem 404.
- [ ] `/ui-elements/alerts`, `/ui-elements/badges`, `/ui-elements/buttons`, `/ui-elements/cards`, `/ui-elements/dropdowns`, `/ui-elements/list-group`, `/ui-elements/progress`, `/ui-elements/spinners`, `/ui-elements/toasts` carregam sem 404.
- [ ] `/maps` carrega sem 404.
- [ ] Cada rota possui `data: { breadcrumb: '...' }` com o label adequado.
- [ ] Lazy loading funciona (nenhum bundle extra é carregado antes da navegação para a rota).
- [ ] Auth guard protege todas as novas rotas (estão dentro do `LayoutComponent`).

## Bloqueado por

Nenhum — pode começar imediatamente (paralelo à issue 01).
