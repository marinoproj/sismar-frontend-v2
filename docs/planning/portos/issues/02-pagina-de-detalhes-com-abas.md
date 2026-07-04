Status: done

# 02 — Página de detalhes do porto com abas

## Issue pai

[docs/planning/portos/PRD.md](../PRD.md)

## O que construir

Página `/ports/:id`, com um shell (`PortDetailsPageComponent`) que renderiza um novo `TabsComponent` genérico (`shared/ui/tabs/`) e um `<router-outlet>` para a aba ativa. Quatro rotas filhas — `geral` (feature `PORTOS`), `historico` (feature `PORTOS_HISTORICO`), `terminais` (feature `PORTOS_TERMINAIS`), `alertas` (feature `PORTOS_ALERTAS`) — cada uma com seu próprio `featureGuard`. `''` redireciona para `geral`. As três últimas usam um componente reutilizável `TabPlaceholderComponent` ("Em desenvolvimento. Esta funcionalidade estará disponível em breve."). A aba `geral` (`PortGeneralTabComponent`) busca `GET /ports/{id}/details` (novo método `getDetails` no `PortsRepository` da issue 01) e mostra as seções "Informações do Porto" e "Indicadores Operacionais", usando um novo `StatCardComponent` (número + ícone, sem tendência) e reaproveitando `PieChartComponent` para as distribuições por tipo e taxa de ocupação. Os blocos de Fundeio/Canal de acesso/Atracados têm um botão "Ver detalhes" desabilitado com indicação "Em breve".

## Critérios de aceite

- [x] `PortsRepository.getDetails(id): Observable<PortDetails>` chama `GET {apiUrl}/ports/{id}/details`; modelo `PortDetails` com `portInfo` (`id`, `name`, `imagePort`, `country`, `countryFlag`, `totalBerths`, `occupiedBerths`, `occupancyRate`) e `operationalIndicators` (`shipsInPort`, `shipsInPortByType`, `shipsLast24h`, `shipsLast24hByType`, `shipsInAnchorage`, `shipsInAccessChannel`, `shipsDocked`)
- [x] Novo `TabsComponent` (`shared/ui/tabs/`): `@Input tabs: { label, route, feature? }[]`; abas com `feature` que o usuário não possui (via `AuthService.hasFeature`) aparecem visíveis mas bloqueadas (sem navegação); abas sem `feature` nunca ficam bloqueadas
- [x] `PortDetailsPageComponent` (`/ports/:id`) renderiza `TabsComponent` com as 4 abas e um `<router-outlet>`; `''` redireciona para `geral`
- [x] Rotas filhas `geral`/`historico`/`terminais`/`alertas`, cada uma com `data: { feature: '<FEATURE>' }` e `canActivate: [featureGuard]`
- [x] `TabPlaceholderComponent` reutilizado nas rotas `historico`, `terminais` e `alertas`, exibindo mensagem de "em desenvolvimento"
- [x] Novo `StatCardComponent` (`shared/ui/stat-card/`): `label`, `value`, `icon`, sem indicador de tendência
- [x] `PortGeneralTabComponent`: seção "Informações do Porto" (imagem, nome, bandeira+país, `StatCardComponent` para total/ocupados de berços, `PieChartComponent` donut para taxa de ocupação)
- [x] `PortGeneralTabComponent`: seção "Indicadores Operacionais" (`StatCardComponent` + `PieChartComponent` para navios agora e últimas 24h por tipo; blocos Fundeio/Canal de acesso/Atracados com `StatCardComponent` + botão "Ver detalhes" desabilitado)
- [x] Botão "Ver detalhes" da issue 01 navega para `/ports/{id}` (cai em `/ports/{id}/geral` pelo redirect)
- [x] Usuário sem a feature de uma aba específica que acessar a URL da aba diretamente é redirecionado para `/403`
- [x] Teste unitário: `TabsComponent` marca como bloqueada uma aba cuja feature está ausente no `AuthService` mockado, e nunca bloqueia uma aba sem `feature` declarada
- [x] Teste unitário: `PortsHttpRepository.getDetails(id)` chama `GET {apiUrl}/ports/{id}/details` (via `HttpTestingController`)

## Bloqueado por

- [portos/issues/01](01-dashboard-de-portos.md)
