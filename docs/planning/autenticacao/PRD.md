Status: done

# PRD — Autenticação JWT

## Declaração do problema

Sistemas web que servem múltiplos clientes precisam de autenticação segura. Sem uma camada de autenticação pré-configurada no projeto base, cada novo sistema reimplementa interceptores HTTP, guards de rota e armazenamento de token de forma inconsistente, aumentando o risco de falhas de segurança e o tempo de desenvolvimento inicial.

## Solução

Uma camada de autenticação baseada em JWT com: `AuthService` para gerenciar o ciclo de vida do token, interceptor HTTP que injeta o token Bearer em todas as requisições autenticadas, guard de rota que protege as rotas privadas e redireciona para o login quando necessário, e página de login com Reactive Forms. O `AuthService` expõe sua interface via abstração, permitindo que cada projeto conecte ao backend que desejar sem alterar a infraestrutura.

## User stories

1. Como usuário, quero fazer login com e-mail e senha, para que possa acessar o sistema.
2. Como usuário, quero que minha sessão persista ao recarregar a página (dentro do tempo de expiração do token), para que não precise fazer login repetidamente.
3. Como usuário, quero ser redirecionado para a página de login ao tentar acessar uma rota protegida sem estar autenticado, para que o sistema me guie corretamente.
4. Como usuário, quero clicar em "Sair" e ter minha sessão encerrada imediatamente, para que minha conta fique segura.
5. Como desenvolvedor, quero que o token JWT seja injetado automaticamente no header de todas as requisições HTTP, para que não precise adicionar o token manualmente em cada chamada de API.
6. Como desenvolvedor, quero que o guard de rota seja configurado de forma declarativa nas rotas, para que proteger uma rota seja simples e consistente.
7. Como desenvolvedor, quero que o `AuthService` tenha uma interface clara (`login`, `logout`, `isAuthenticated`, `currentUser`), para que a implementação de negócio seja substituível sem alterar os consumidores.
8. Como desenvolvedor, quero que a página de login use Reactive Forms com validação, para que o padrão de formulários seja consistente com o resto da aplicação.
9. Como usuário, quero ver uma página de erro 404 amigável ao acessar uma rota inexistente, para que o sistema não pareça quebrado.
10. Como desenvolvedor, quero que o logout limpe o token e redirecione para o login, para que a sessão seja encerrada de forma segura e completa.

## Decisões de implementação

- **`AuthService`**: em `src/app/core/auth/auth.service.ts`. Gerencia o token JWT no `localStorage` (chave `auth-token`). Signal `currentUser: Signal<User | null>` e computed `isAuthenticated: Signal<boolean>`. Métodos: `login(credentials): Observable<void>`, `logout(): void`. O `login` chama o endpoint configurado e armazena o token retornado.
- **`User` model**: interface em `src/app/core/auth/user.model.ts` com campos básicos: `id`, `name`, `email`, `roles`.
- **`AuthInterceptor`**: em `src/app/core/interceptors/auth.interceptor.ts`. Interceptor funcional (não classe, padrão Angular 17+). Injeta o header `Authorization: Bearer <token>` em toda requisição que não seja para a URL de login.
- **`AuthGuard`**: em `src/app/core/guards/auth.guard.ts`. Guard funcional (`CanActivateFn`). Verifica `AuthService.isAuthenticated`; se falso, redireciona para `/login` com `router.navigate`.
- **Página de login**: `LoginComponent` em `src/app/features/auth/pages/login/`. Reactive Form com campos `email` (validators: `required`, `email`) e `password` (validators: `required`, `minLength(6)`). Exibe erros de validação inline. Botão de submit desabilitado enquanto o form é inválido. Após login bem-sucedido, redireciona para `/dashboard`.
- **Página 404**: `NotFoundComponent` em `src/app/features/errors/pages/not-found/`. Rota wildcard `**` no final de `app.routes.ts`.
- **Rotas**: `app.routes.ts` divide em rotas públicas (`/login`) e rotas protegidas (usam `LayoutComponent` + `authGuard`).
- **Token endpoint**: configurável via `ThemeConfig` ou variável de ambiente — o projeto base usa uma URL de mock.

## Decisões de teste

- Testar `AuthGuard`: sem token → retorna `UrlTree` para `/login`; com token → retorna `true`.
- Testar `AuthInterceptor`: requisição com token armazenado → header `Authorization` presente; requisição para `/auth/login` → sem header.
- Testar `LoginComponent`: form inválido → botão desabilitado; form válido → `AuthService.login()` chamado.
- Não testar o `localStorage` diretamente — testar o comportamento resultante (`isAuthenticated` verdadeiro após login).

## Fora de escopo

- Refresh token e renovação automática de sessão
- OAuth2 / SSO / login social
- Multi-fator (MFA)
- Controle de acesso baseado em roles (RBAC) nas rotas — cada projeto implementa conforme necessidade
- Recuperação de senha

## Notas adicionais

- O `AuthInterceptor` deve ser registrado como interceptor funcional em `app.config.ts` via `withInterceptors([authInterceptor])`.
- A URL base da API deve ser configurável — usar `environment.ts` ou `ThemeConfig.apiBaseUrl` (a ser decidido em cada projeto derivado).
