Status: done

# 01 — Criar AuthService com gerenciamento de token JWT

## O que construir

Criar `AuthService` em `src/app/core/auth/` com Signal `currentUser` e computed `isAuthenticated`. O serviço deve armazenar o JWT no `localStorage`, restaurá-lo na inicialização (para persistir sessão após reload) e expor métodos `login()` e `logout()`. Criar a interface `User` com os campos básicos do usuário autenticado.

## Critérios de aceite

- [ ] `AuthService` tem Signal `currentUser: Signal<User | null>` inicializado com dados do token armazenado (se existir)
- [ ] `isAuthenticated` é computed Signal: `true` quando `currentUser !== null`
- [ ] `login(credentials)` retorna `Observable<void>` — chama endpoint mock e armazena token no `localStorage`
- [ ] `logout()` limpa o token do `localStorage` e define `currentUser` como `null`
- [ ] Ao recarregar com token válido no `localStorage`, `isAuthenticated` é `true` sem novo login
- [ ] Interface `User` definida com: `id: string`, `name: string`, `email: string`, `roles: string[]`
- [ ] Teste unitário: `logout()` limpa `currentUser`; após `login()` mock, `isAuthenticated` é `true`

## Bloqueado por

- [setup-infraestrutura/issues/01](../../setup-infraestrutura/issues/01-criar-projeto-angular-19.md)
