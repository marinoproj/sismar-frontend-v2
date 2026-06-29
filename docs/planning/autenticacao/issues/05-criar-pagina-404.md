Status: done

# 05 — Criar página de erro 404

## O que construir

Criar `NotFoundComponent` em `src/app/features/errors/pages/not-found/` com uma página amigável de erro 404. Adicionar a rota wildcard `**` no final de `app.routes.ts` apontando para esse componente. A página deve exibir uma mensagem clara e um botão para voltar ao Dashboard.

## Critérios de aceite

- [ ] Acesso a qualquer rota inexistente exibe a página 404 (sem blank page ou erro no console)
- [ ] Página exibe código "404", mensagem amigável em português e botão "Voltar ao Dashboard"
- [ ] Botão "Voltar ao Dashboard" navega para `/dashboard`
- [ ] Página não usa o `LayoutComponent` (sem sidebar/header — página standalone)
- [ ] Rota wildcard `**` é a última rota em `app.routes.ts`

## Bloqueado por

- [03 — Implementar auth guard](./03-implementar-auth-guard.md)
