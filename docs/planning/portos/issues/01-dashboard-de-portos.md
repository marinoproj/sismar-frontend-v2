Status: done

# 01 — Dashboard de Portos (listagem)

## Issue pai

[docs/planning/portos/PRD.md](../PRD.md)

## O que construir

Novo módulo `features/ports/` com uma página de listagem em `/ports` (feature `PORTOS`), consumindo `GET /ports/summary` via um `PortsRepository`/`PortsHttpRepository` reais (sem mock). A tabela usa `TableComponent` com colunas customizadas (imagem + nome do porto, bandeira + país, navios no porto agora, última atualização formatada) e um botão "Ver detalhes" por linha (pode navegar para `/ports/:id`, mesmo que essa rota ainda não exista — vem na issue 02). Busca por nome é feita client-side sobre o array retornado por `getSummary()`. Novo item "Portos" no menu lateral (grupo MAIN), com `feature: 'PORTOS'`.

## Critérios de aceite

- [x] `PortsRepository` (abstract + `InjectionToken`) com `getSummary(): Observable<PortSummary[]>`; `PortsHttpRepository` chama `GET {apiUrl}/ports/summary`
- [x] Modelo `PortSummary` com `id`, `name`, `imagePort`, `country`, `countryFlag`, `shipsInPort`, `lastEquipmentUpdate`
- [x] `PortsListPageComponent` usa `TableComponent` com colunas: imagem+nome (template), bandeira+país (template), navios no porto agora, última atualização (formatada)
- [x] Botão de ação "Ver detalhes" por linha, navegando para `/ports/{id}`
- [x] Campo de busca (`searchable` do `TableComponent`) filtra a lista client-side por nome do porto
- [x] Rota `/ports` registrada em `app.routes.ts` (fora de `demo-routes.ts`, é página real), com `data: { feature: 'PORTOS' }` e `canActivate: [featureGuard]`
- [x] Novo item "Portos" em `nav-items.ts` (grupo MAIN), `route: '/ports'`, `feature: 'PORTOS'`, sem `demo`
- [x] Usuário sem a feature `PORTOS` que acessar `/ports` é redirecionado para `/403`
- [x] Teste unitário: `PortsHttpRepository.getSummary()` chama `GET {apiUrl}/ports/summary` (via `HttpTestingController`)

## Bloqueado por

Nenhum — pode começar imediatamente
