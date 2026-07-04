Status: done

# 06 — Exclusão de páginas demo em produção + filtragem do menu

## Issue pai

[docs/planning/autenticacao-multi-tenant/PRD.md](../PRD.md)

## O que construir

As páginas de exemplo/demonstração (`/dashboard`, `/charts`, `/maps`, `/ui-elements/*`) passam a ser registradas condicionalmente com base em `environment.production`, ficando fora do build de produção. O menu lateral (`nav-items.ts`), hoje uma lista estática, passa a ser calculado dinamicamente, escondendo os itens dessas páginas demo em produção e, para páginas que futuramente tenham `feature` associada, escondendo também os itens cuja feature o usuário não possui.

## Critérios de aceite

- [x] `app.routes.ts` só registra as rotas `/dashboard`, `/charts`, `/maps` e `/ui-elements/*` quando `environment.production` for `false`
- [x] Build de produção (`pnpm build --configuration=production`) não inclui esses chunks/rotas
- [x] `nav-items.ts` vira uma função/computed que recebe o estado de produção e `AuthService.hasFeature`, retornando apenas os itens navegáveis
- [x] Em produção, o menu lateral não exibe itens das páginas demo
- [x] Em desenvolvimento, o menu continua mostrando todos os itens como hoje

## Bloqueado por

- [autenticacao-multi-tenant/issues/01](01-login-client-unico-e-sessao.md)
