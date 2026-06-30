Status: done

## Issue pai

[PRD — Menu UI Elements: Biblioteca de Componentes Reutilizáveis](../PRD.md)

## O que construir

Criar a estrutura base do módulo `features/ui-elements/` (routes.ts com todas as rotas), o `AlertComponent`, o `BadgeComponent` e as páginas de showcase correspondentes (`AlertsPage` e `BadgesPage`).

Esta é a issue fundadora do módulo — cria o `routes.ts` que as issues subsequentes apenas completam.

**AlertComponent** (`shared/ui/alert/`): `@Input()` `type: 'info'|'success'|'warning'|'danger'` (default: 'info'), `message: string`, `dismissible?: boolean`. Quando `dismissible`, botão "×" oculta o componente internamente.

**BadgeComponent** (`shared/ui/badge/`): `@Input()` `label: string`, `variant: 'default'|'primary'|'success'|'warning'|'danger'` (default: 'default'). Renderizado como `<span>` inline com padding e cor por variante.

**AlertsPage**: exibe `AlertComponent` em todos os 4 tipos, versões com e sem `dismissible`. **BadgesPage**: exibe `BadgeComponent` em todas as 5 variantes, em contexto (dentro de texto e isolado).

## Critérios de aceite

- [ ] `features/ui-elements/routes.ts` criado com todas as 9 rotas do módulo (rotas sem página apontam para stub).
- [ ] `AlertComponent` criado em `shared/ui/alert/`.
- [ ] `AlertComponent` exibe ícone e cor distintos por `type`.
- [ ] `AlertComponent` com `dismissible` exibe botão "×" que oculta o alerta ao clicar.
- [ ] `BadgeComponent` criado em `shared/ui/badge/`.
- [ ] `BadgeComponent` aplica cor diferente por `variant`.
- [ ] `AlertsPageComponent` criada em `/ui-elements/alerts` com todos os tipos e variações.
- [ ] `BadgesPageComponent` criada em `/ui-elements/badges` com todos os variants.
- [ ] Breadcrumb exibe "UI Elements > Alerts" / "UI Elements > Badges" nas respectivas páginas.
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [infraestrutura-ui/02 — Routing skeleton](../../infraestrutura-ui/issues/02-routing-skeleton.md)
- [infraestrutura-ui/03 — Breadcrumb](../../infraestrutura-ui/issues/03-breadcrumb-component.md)
