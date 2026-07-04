Status: done

# 04 — Logout real (cliente + servidor)

## Issue pai

[docs/planning/autenticacao-multi-tenant/PRD.md](../PRD.md)

## O que construir

O logout manual (clique em "Sair" no menu do header) passa a chamar `POST /auth/logout` no backend, invalidando a sessão no servidor, antes de limpar o estado local e redirecionar para `/login`. Hoje `AuthService.logout()` só limpa `localStorage`/signals — nunca chama o backend.

## Critérios de aceite

- [x] `AuthRepository.logout()` chama `POST {apiUrl}/auth/logout` com o token atual
- [x] `AuthService.logout()` chama o repository e, independentemente do resultado da chamada ao backend, limpa a sessão local
- [x] `header.component.ts` continua chamando `auth.logout()` + `navigate(['/login'])` após a limpeza
- [x] Teste unitário: `logout()` chama o repository e limpa a sessão local mesmo se a chamada ao backend falhar

## Bloqueado por

- [autenticacao-multi-tenant/issues/01](01-login-client-unico-e-sessao.md)
