Status: done

# Issue 01 — Landing pós-login por permissão

## Issue pai

`docs/planning/melhorias-acesso-portos-areas/PRD.md`

## O que construir

A rota raiz (`/`) passa a decidir seu destino com base na feature `PORTOS` do usuário autenticado, em vez do `redirectTo: 'home'` estático atual:

- Se o usuário tem a feature `PORTOS`, `/` redireciona para `/ports`.
- Caso contrário, `/` redireciona para `/home` (comportamento atual, inalterado — placeholder "Em construção" continua igual).

Essa decisão deve valer tanto para o pós-login quanto para qualquer acesso direto à raiz (atualizar a página, abrir `/` diretamente já autenticado). Por isso, `LoginComponent` passa a navegar para `/` (não mais para `/home` fixo) após um login bem-sucedido, deixando a raiz decidir.

`/home` continua acessível diretamente (sem redirecionamento condicional nela própria) e sem nenhuma mudança de conteúdo. `/ports` e seu guard `featureGuard` (`data.feature: 'PORTOS'`) continuam como estão.

## Critérios de aceite

- [ ] Usuário com a feature `PORTOS` que acessa `/` (via login ou diretamente) é redirecionado para `/ports`.
- [ ] Usuário sem a feature `PORTOS` que acessa `/` (via login ou diretamente) é redirecionado para `/home`, exibindo o placeholder "Em construção" já existente.
- [ ] `LoginComponent`, após login bem-sucedido, navega para `/` (não mais para `/home` hardcoded).
- [ ] Acesso direto a `/home` continua funcionando normalmente, sem redirecionamento condicional.
- [ ] Nenhuma mudança de comportamento em `/ports` ou no `featureGuard` existente.

## Bloqueado por

Nenhum — pode começar imediatamente.
