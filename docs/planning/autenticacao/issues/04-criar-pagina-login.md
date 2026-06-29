Status: done

# 04 — Criar página de login com Reactive Forms

## O que construir

Criar `LoginComponent` em `src/app/features/auth/pages/login/` com formulário de login usando Reactive Forms. O componente deve exibir logo do sistema (via `ThemeConfig`), campos de e-mail e senha com validação inline, e redirecionar para `/dashboard` após login bem-sucedido. A página não usa o `LayoutComponent` (sem sidebar/header). O design deve se inspirar na tela de login do template Xintra: fundo com cor de destaque, card centralizado, branco.

## Critérios de aceite

- [ ] Página acessível em `/login` sem autenticação
- [ ] Logo do sistema exibido no topo do card (via `ThemeConfig.logoUrl`)
- [ ] Campo e-mail com validação `required` e `email` — erro exibido inline ao sair do campo
- [ ] Campo senha com validação `required` e `minLength(6)` — erro exibido inline; botão de mostrar/ocultar senha
- [ ] Botão "Entrar" desabilitado enquanto form é inválido
- [ ] Após login bem-sucedido, usuário é redirecionado para `/dashboard`
- [ ] Loading spinner no botão durante a requisição de login
- [ ] Mensagem de erro genérica exibida se o login falhar (credenciais inválidas)
- [ ] Layout responsivo: funciona em mobile e desktop
- [ ] Rota de login lazy-loaded em `app.routes.ts`

## Bloqueado por

- [02 — Implementar auth interceptor](./02-implementar-auth-interceptor.md)
- [03 — Implementar auth guard](./03-implementar-auth-guard.md)
- [layout-e-navegacao/issues/01](../../layout-e-navegacao/issues/01-criar-layout-shell.md)
