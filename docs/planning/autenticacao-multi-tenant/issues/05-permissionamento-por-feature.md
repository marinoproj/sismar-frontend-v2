Status: done

# 05 — Permissionamento por feature (guard + diretiva + página 403)

## Issue pai

[docs/planning/autenticacao-multi-tenant/PRD.md](../PRD.md)

## O que construir

Infraestrutura genérica de permissionamento por `feature`, para ser usada a partir de agora em páginas e ações novas. Um guard funcional (`featureGuard`) lê a `feature` exigida via `data` da rota e verifica `AuthService.hasFeature()`; se ausente, redireciona para uma nova página `/403`. Uma diretiva estrutural (`*appHasFeature`) oculta trechos de UI (botões, abas, seções) quando a feature não está presente na sessão do usuário. Nenhuma página existente hoje recebe uma `feature` nesta issue — todas as páginas atuais são de exemplo/placeholder (ver issue 06) — então a verificação é feita via testes unitários.

## Critérios de aceite

- [x] `featureGuard` (`CanActivateFn`) lê `route.data['feature']`; se `AuthService.hasFeature(feature)` for `true`, permite ativação; caso contrário retorna `UrlTree` para `/403`
- [x] Rota sem `data['feature']` declarado é sempre permitida pelo guard (comportamento padrão para páginas sem restrição, como `/home`)
- [x] Diretiva `*appHasFeature="'NOME_DA_FEATURE'"` remove o elemento do DOM quando a feature não está no array `features` da sessão atual
- [x] Nova `ForbiddenComponent` (403), com o mesmo padrão visual/estrutural da `NotFoundComponent` (404) existente, registrada na rota `/403`
- [x] `AuthService.hasFeature()` não faz bypass para `superUser` — usa sempre o array `features` da sessão
- [x] Teste unitário do guard via `TestBed.runInInjectionContext`, com `AuthService` mockado (feature presente → `true`; feature ausente → `UrlTree` para `/403`)
- [x] Teste unitário da diretiva: elemento presente/ausente no DOM conforme features mockadas na sessão

## Bloqueado por

- [autenticacao-multi-tenant/issues/01](01-login-client-unico-e-sessao.md)
