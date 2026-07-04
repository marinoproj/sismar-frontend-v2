Status: done

# 01 — Login real com Client único + sessão + /home

## Issue pai

[docs/planning/autenticacao-multi-tenant/PRD.md](../PRD.md)

## O que construir

Substituir a camada de autenticação mockada por uma real, alinhada ao `AuthResponseDTO` do backend (`docs/api/api-reference.md`). Novo modelo de sessão (`accessToken`, `userId`, `name`, `superUser`, `profile`, `clientId`, `client`, `features`) no lugar do `User` atual. `AuthRepository` ganha `getClients(credentials)` (chama `POST /auth/clients`) e `login(credentials, clientCode)` (chama `POST /auth/login` com header `clientCode`); `AuthMockRepository` é removido e substituído por uma implementação HTTP real usando `environment.apiUrl` (corrigido para `http://localhost:8080`). `AuthService` passa a expor a sessão completa, `isAuthenticated`, `hasFeature(name)` e orquestra o login de duas etapas — nesta issue, apenas para o caso de exatamente 1 Client retornado (o caso de múltiplos Clients fica para a issue 02). O formulário de login troca o campo de e-mail por um campo de usuário (texto simples). Cria-se uma página placeholder (`/home`, "em construção", sem feature exigida) que passa a ser o destino da rota raiz dentro do shell autenticado.

## Critérios de aceite

- [x] `User` model atual removido; novo modelo de sessão com `accessToken`, `userId`, `name`, `superUser`, `profile`, `clientId`, `client`, `features`
- [x] `AuthRepository` expõe `getClients(credentials)` e `login(credentials, clientCode)`; `AuthMockRepository` removido; nova implementação HTTP chama `POST {apiUrl}/auth/clients` e `POST {apiUrl}/auth/login` (header `clientCode`) via `HttpClient`
- [x] `AuthService` expõe sessão (signal), `isAuthenticated` (computed), `hasFeature(name)`, e `login(username, password)` orquestrando os dois passos para o caso de exatamente 1 Client
- [x] Quando `getClients` retorna 0 ou mais de 1 Client, o login exibe um erro genérico e não prossegue (o fluxo completo de múltiplos Clients é tratado na issue 02)
- [x] `LoginComponent` usa campo "usuário" (texto, sem `Validators.email`) + senha
- [x] `environment.ts` aponta `apiUrl` para `http://localhost:8080`
- [x] Nova página `HomeComponent` (placeholder "em construção"), sem feature exigida
- [x] Rota `''` dentro do shell autenticado redireciona para `/home` (não mais `/dashboard`)
- [x] `authInterceptor` não injeta `Authorization` em `/auth/clients` nem `/auth/login`
- [x] Login bem-sucedido com Client único redireciona para `/home`
- [x] Teste unitário: `AuthService.login()` com uma implementação fake de `AuthRepository` retornando exatamente 1 Client autentica corretamente e popula a sessão

## Bloqueado por

Nenhum — pode começar imediatamente
