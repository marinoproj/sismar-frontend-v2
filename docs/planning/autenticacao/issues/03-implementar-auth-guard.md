Status: done

# 03 — Implementar guard de rota para rotas protegidas

## O que construir

Criar `authGuard` como guard funcional (`CanActivateFn`) em `src/app/core/guards/auth.guard.ts`. O guard verifica o Signal `isAuthenticated` do `AuthService`; se falso, cancela a navegação e redireciona para `/login`. Configurar as rotas em `app.routes.ts` aplicando o guard nas rotas que usam o `LayoutComponent`.

## Critérios de aceite

- [ ] Acesso a qualquer rota protegida sem token → redirecionamento automático para `/login`
- [ ] Acesso a rota protegida com token válido → navegação permitida normalmente
- [ ] `authGuard` implementado como `CanActivateFn` (não classe)
- [ ] Guard aplicado em `app.routes.ts` na rota que usa `LayoutComponent` como pai
- [ ] Rota de login (`/login`) acessível sem autenticação
- [ ] Usuário autenticado tentando acessar `/login` é redirecionado para `/dashboard`
- [ ] Teste unitário: sem token → retorna `UrlTree` para `/login`; com token → retorna `true`

## Bloqueado por

- [01 — Criar AuthService](./01-criar-auth-service.md)
