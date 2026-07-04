Status: done

# 02 — Seleção de Client via modal (multi-tenant)

## Issue pai

[docs/planning/autenticacao-multi-tenant/PRD.md](../PRD.md)

## O que construir

Quando `getClients` retorna mais de um Client (usuário `superUser` ou com acesso a múltiplos tenants), abrir um modal listando os Clients disponíveis (código e nome), reaproveitando o padrão de modal já existente no projeto (`ModalShellComponent`/CDK dialog). Ao escolher um Client, prosseguir para `login` com o `clientCode` selecionado. Se o usuário fechar/cancelar o modal sem escolher, permanece na tela de login sem autenticar. O caminho de Client único (issue 01) continua funcionando sem abrir modal.

## Critérios de aceite

- [x] Novo componente de modal (seleção de Client) reaproveitando `ModalShellComponent`/padrão CDK dialog já existente no projeto
- [x] Quando `getClients` retorna mais de 1 Client, o modal é aberto automaticamente listando código e nome de cada Client
- [x] Selecionar um Client chama `login` com aquele `clientCode` e, em caso de sucesso, redireciona para `/home`
- [x] Cancelar/fechar o modal sem escolher mantém o usuário na tela de login, sem chamar `POST /auth/login`
- [x] Comportamento anterior (Client único → login direto, sem modal) continua funcionando
- [x] Teste unitário: fluxo com uma implementação fake de `AuthRepository` retornando 2+ Clients abre o mecanismo de seleção e completa o login ao escolher um deles

## Bloqueado por

- [autenticacao-multi-tenant/issues/01](01-login-client-unico-e-sessao.md)
