Status: done

# 03 — Tratamento global de erros HTTP (401 + toast)

## Issue pai

[docs/planning/autenticacao-multi-tenant/PRD.md](../PRD.md)

## O que construir

Novo interceptor de erro HTTP, registrado em `app.config.ts` ao lado do `authInterceptor`. Em resposta `401` (token ausente, expirado ou inválido — conforme `docs/api/api-reference.md`), limpa a sessão local via `AuthService` e redireciona para `/login`, sem chamar `POST /auth/logout` (o backend já invalidou o token nesse caminho). Em qualquer outro status de erro, exibe um toast via `ToastService` já existente, usando `error.error.message` retornado pelo backend, com uma mensagem genérica de fallback quando esse campo não estiver presente.

## Critérios de aceite

- [x] Novo interceptor funcional (`error.interceptor.ts`) registrado via `withInterceptors`
- [x] Resposta `401` em qualquer request autenticada limpa a sessão (`AuthService`) e navega para `/login`
- [x] Resposta com outro status de erro (`400`/`403`/`404`/`409`/`500` etc.) exibe toast com `error.error.message` quando presente
- [x] Quando `error.error.message` estiver ausente, o toast exibe uma mensagem genérica de fallback
- [x] Erros durante `/auth/clients` e `/auth/login` exibem toast normalmente, mas não disparam o redirecionamento de 401 (o usuário já está na tela de login)
- [x] Teste unitário com `HttpTestingController`: resposta 401 dispara limpeza de sessão + navegação para `/login`; outro erro dispara `ToastService.show()` com a mensagem correta

## Bloqueado por

- [autenticacao-multi-tenant/issues/01](01-login-client-unico-e-sessao.md)
