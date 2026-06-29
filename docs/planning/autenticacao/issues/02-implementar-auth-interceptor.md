Status: done

# 02 — Implementar interceptor HTTP para injeção do token JWT

## O que construir

Criar `authInterceptor` como interceptor funcional em `src/app/core/interceptors/auth.interceptor.ts`. O interceptor deve injetar o header `Authorization: Bearer <token>` em toda requisição HTTP quando há um token armazenado, exceto requisições para o endpoint de login. Registrar o interceptor em `app.config.ts` via `withInterceptors`.

## Critérios de aceite

- [ ] Toda requisição HTTP com token armazenado recebe header `Authorization: Bearer <token>`
- [ ] Requisições para a URL de login (`/auth/login`) não recebem o header Authorization
- [ ] Requisições sem token armazenado são enviadas sem o header Authorization
- [ ] Interceptor registrado em `app.config.ts` via `withInterceptors([authInterceptor])`
- [ ] Teste unitário: requisição com token → header presente; requisição para `/auth/login` → sem header; sem token → sem header

## Bloqueado por

- [01 — Criar AuthService](./01-criar-auth-service.md)
