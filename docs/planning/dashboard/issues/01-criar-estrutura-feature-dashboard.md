Status: done

# 01 — Criar estrutura da feature dashboard com repositório mock

## O que construir

Criar toda a estrutura de pastas e arquivos da feature `dashboard` seguindo a arquitetura definida: `pages/`, `components/`, `services/`, `repositories/`, `models/`, `routes.ts`. Implementar o `DashboardRepository` (abstrato), o `DashboardMockRepository` com dados estáticos e delay simulado, o `DashboardService` expondo os dados como Signals, e o `KpiCardComponent`. Configurar a rota lazy-loaded `/dashboard` protegida por `authGuard`.

## Critérios de aceite

- [ ] Estrutura de pastas completa criada em `src/app/features/dashboard/`
- [ ] Interface/classe abstrata `DashboardRepository` com método `getSummary(): Observable<DashboardSummary>`
- [ ] `DashboardMockRepository` retorna `DashboardSummary` com dados mockados após `delay(800)`
- [ ] `DashboardService` injeta repositório e expõe dados via `toSignal()`
- [ ] `DashboardMockRepository` provido via token em `dashboard/routes.ts`
- [ ] Rota `/dashboard` configurada em `app.routes.ts` como lazy-loaded e protegida por `authGuard`
- [ ] `KpiCardComponent` em `components/kpi-card/` aceita `@Input() label`, `value`, `change`, `icon` e renderiza o card estilizado
- [ ] `pnpm build` sem erros após a criação da estrutura

## Bloqueado por

- [layout-e-navegacao/issues/04](../../layout-e-navegacao/issues/04-responsividade-mobile-drawer.md)
- [autenticacao/issues/03](../../autenticacao/issues/03-implementar-auth-guard.md)
