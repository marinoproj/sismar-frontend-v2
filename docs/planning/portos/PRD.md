Status: done

# PRD — Dashboard de Portos e Detalhes do Porto

## Declaração do problema

O sistema hoje só tem páginas de exemplo (dashboard/charts/ui-elements/maps), todas com dados mockados e sem valor de produto real — nenhuma delas consome os endpoints operacionais do `AisManager` (`docs/api/api-reference.md`). Um operador que precisa saber rapidamente quantos portos existem, quantos navios estão em cada um agora, e abrir o detalhe operacional de um porto específico (ocupação de berços, navios por tipo, fundeio/canal de acesso/atracados) não tem hoje nenhuma tela real para isso no frontend.

## Solução

Duas páginas novas, atrás da feature `PORTOS`, consumindo os endpoints reais `GET /ports/summary` e `GET /ports/{id}/details`:

1. **Dashboard de Portos** (`/ports`): tabela com todos os portos (imagem + nome, bandeira + país, navios no porto agora, última atualização) e busca por nome, com ação "Ver detalhes" para cada porto.
2. **Detalhes do Porto** (`/ports/:id`): página com 4 abas — **Geral** (implementada agora, com informações cadastrais e indicadores operacionais do porto), **Histórico**, **Terminais** e **Alertas** (só placeholders "em desenvolvimento" por enquanto). Cada aba é protegida por sua própria feature (`PORTOS`, `PORTOS_HISTORICO`, `PORTOS_TERMINAIS`, `PORTOS_ALERTAS`) — uma aba cuja feature o usuário não possui aparece visível mas bloqueada na barra de abas.

Ambas as páginas reaproveitam o máximo possível do catálogo de componentes existente (`TableComponent`, `PieChartComponent`, `ButtonComponent`, `BadgeComponent`) e introduzem dois componentes genéricos novos que passam a fazer parte do catálogo compartilhado: `StatCardComponent` (número simples com ícone, sem indicador de tendência — nem `KpiCardComponent` nem `TickerCardComponent` cobrem esse caso, pois ambos exigem um `change` percentual obrigatório) e `TabsComponent` (navegação em abas, ainda inexistente no projeto).

## User stories

1. Como usuário com a feature `PORTOS`, quero ver uma lista de todos os portos cadastrados, para ter uma visão geral rápida da operação portuária.
2. Como usuário, quero ver na listagem a imagem do porto, o nome, a bandeira e o nome do país, quantos navios estão no porto agora e a data/hora da última atualização, para entender o status de cada porto sem abrir o detalhe.
3. Como usuário, quero buscar um porto pelo nome na própria tabela, para encontrar rapidamente o porto que preciso sem rolar a lista inteira.
4. Como usuário, quero clicar em "Ver detalhes" de um porto e ser levado à página de detalhes daquele porto, para aprofundar na operação específica dele.
5. Como usuário sem a feature `PORTOS`, quero ser barrado ao tentar acessar `/ports` (redirecionado para a página 403), para que dados operacionais não fiquem visíveis a quem não tem permissão.
6. Como usuário, quero que a página de detalhes do porto tenha abas (Geral, Histórico, Terminais, Alertas), para navegar entre diferentes tipos de informação do mesmo porto sem trocar de página.
7. Como usuário sem a feature de uma aba específica (ex.: sem `PORTOS_TERMINAIS`), quero ver aquela aba visível mas bloqueada (não clicável), para entender que o recurso existe mas não está liberado para mim, em vez de simplesmente não saber que ele existe.
8. Como usuário com a feature de uma aba ainda não implementada (Histórico, Terminais ou Alertas), quero ver uma mensagem clara de "em desenvolvimento, estará disponível em breve" ao acessá-la, para não achar que o sistema quebrou.
9. Como usuário, quero que a URL mude ao trocar de aba (ex.: `/ports/1/geral`, `/ports/1/historico`), para poder compartilhar ou favoritar o link de uma aba específica.
10. Como usuário, na aba Geral, quero ver as informações cadastrais do porto (imagem, nome, bandeira + país), para identificar visualmente o porto que estou vendo.
11. Como usuário, na aba Geral, quero ver o total de berços, quantos estão ocupados e a taxa de ocupação (em um gráfico), para avaliar rapidamente a capacidade disponível do porto.
12. Como usuário, na aba Geral, quero ver quantos navios estão no porto agora, com a distribuição por tipo de embarcação, para entender a composição do tráfego atual.
13. Como usuário, na aba Geral, quero ver quantos navios passaram pelo porto nas últimas 24 horas, com a distribuição por tipo, para ter uma visão do fluxo recente.
14. Como usuário, na aba Geral, quero ver os totais de navios fundeados, no canal de acesso e atracados, para entender onde as embarcações estão fisicamente dentro da área do porto.
15. Como usuário, quero ver um botão "Ver detalhes" nos blocos de Fundeio/Canal de acesso/Atracados, mesmo sabendo que a lista de embarcações ainda não abre (o botão aparece desabilitado com indicação "em breve"), para já entender que essa interação existirá no futuro.
16. Como desenvolvedor, quero um `PortsRepository` (abstract) com implementação HTTP real (`PortsHttpRepository`) chamando `GET /ports/summary` e `GET /ports/{id}/details`, para que a página já nasça funcional contra o backend, sem depender de dados mockados.
17. Como desenvolvedor, quero um `StatCardComponent` genérico (label, valor, ícone, sem tendência) no catálogo compartilhado, para reaproveitar em qualquer número simples de qualquer feature futura, sem forçar um `change` que não faz sentido.
18. Como desenvolvedor, quero um `TabsComponent` genérico no catálogo compartilhado (lista de abas com rota e feature opcional, calculando sozinho quais ficam bloqueadas via `AuthService.hasFeature`), para reaproveitar em qualquer página futura que precise de navegação em abas.
19. Como desenvolvedor, quero que a rota de Portos seja registrada como página real (fora de `demo-routes.ts`), para que continue existindo no build de produção independentemente do toggle de páginas de exemplo.
20. Como desenvolvedor, quero um item "Portos" no menu lateral (grupo MAIN), com `feature: 'PORTOS'`, para que o item apareça/desapareça do menu de acordo com a mesma regra de permissionamento já usada pelas outras páginas.

## Decisões de implementação

- **Módulo novo** `features/ports/` (`models/`, `repositories/`, `services/`, `pages/`, `routes.ts`), seguindo a mesma convenção estrutural de `features/dashboard/`.
- **`PortsRepository`** (abstract + `InjectionToken`): `getSummary(): Observable<PortSummary[]>` (`GET /ports/summary`) e `getDetails(id: number): Observable<PortDetails>` (`GET /ports/{id}/details`). `PortsHttpRepository` é a única implementação — sem repositório mock, diferente do padrão usado em `dashboard`/`charts` (que são páginas de exemplo); Portos é página real do produto e já nasce contra o backend, no mesmo espírito do `AuthHttpRepository`.
- **Modelos**: `PortSummary` (`id`, `name`, `imagePort`, `country`, `countryFlag`, `shipsInPort`, `lastEquipmentUpdate`) e `PortDetails` (`portInfo`: `id`, `name`, `imagePort`, `country`, `countryFlag`, `totalBerths`, `occupiedBerths`, `occupancyRate`; `operationalIndicators`: `shipsInPort`, `shipsInPortByType`, `shipsLast24h`, `shipsLast24hByType`, `shipsInAnchorage`, `shipsInAccessChannel`, `shipsDocked`) — espelhando `PortSummaryDTO`/`PortDetailsDTO` de `docs/api/api-reference.md`.
- **Página de listagem**: usa `TableComponent` com colunas customizadas via `ColumnDef.template` (imagem+nome, bandeira+país, navios agora, última atualização formatada) e ação "Ver detalhes" (navega para `/ports/:id`). Busca por nome é **client-side** (filtra o array já carregado por `getSummary()`), já que `GET /ports/summary` não tem parâmetro de busca no backend — mesmo padrão de filtro local já usado em `ui-elements/pages/tables-page`.
- **Página de detalhes**: `PortDetailsPageComponent` é o shell da rota `/ports/:id` — renderiza o novo `TabsComponent` e um `<router-outlet>` para a aba ativa. Rotas filhas (`geral`, `historico`, `terminais`, `alertas`), cada uma com `data: { feature: '<FEATURE>' }` e `canActivate: [featureGuard]` (reaproveitando o guard já existente). `''` redireciona para `geral`.
- **Aba Geral** (`PortGeneralTabComponent`): busca `getDetails(id)` (id vindo da rota pai). Seções "Informações do Porto" (imagem, nome, bandeira+país, 2× `StatCardComponent` para total/ocupados de berços, `PieChartComponent` em modo donut para taxa de ocupação) e "Indicadores Operacionais" (`StatCardComponent` + `PieChartComponent` para navios agora e últimas 24h por tipo; 3 blocos Fundeio/Canal de acesso/Atracados com `StatCardComponent` + `ButtonComponent [disabled]="true"` rotulado "Ver detalhes" com indicação "Em breve").
- **Abas Histórico/Terminais/Alertas**: mesmo componente reutilizável `TabPlaceholderComponent`, mensagem genérica "Em desenvolvimento. Esta funcionalidade estará disponível em breve.".
- **`TabsComponent`** (novo, `shared/ui/tabs/`): `@Input tabs: { label: string; route: string; feature?: string }[]`. Para cada aba, calcula internamente (via `AuthService.hasFeature`) se está bloqueada; abas sem `feature` declarada nunca ficam bloqueadas. Renderiza como `routerLink` quando liberada, ou item visualmente desabilitado (sem navegação) quando bloqueada — nunca esconde a aba da lista.
- **`StatCardComponent`** (novo, `shared/ui/stat-card/`): `@Input label`, `@Input value`, `@Input icon` — sem `change`/tendência, para números que não têm comparação histórica disponível.
- **`nav-items.ts`**: novo item "Portos" no grupo `MAIN` (`route: '/ports'`, `icon: 'ri-anchor-line'`, `feature: 'PORTOS'`, sem `demo`).
- **`app.routes.ts`**: nova entrada `loadChildren` para `features/ports/routes` registrada diretamente (não em `demo-routes.ts`, pois não é página de exemplo).
- **Reaproveitamento do `PieChartComponent`**: usado como já existe hoje (ajustando só `height`), sem alterar o componente compartilhado — aceita-se que o resultado visual não será idêntico ao mockup de referência (que tem anéis bem menores e sem legenda).

## Decisões de teste

- Seguir o padrão Jest + Angular `TestBed` já usado no projeto (ex.: `auth.service.spec.ts`, `error.interceptor.spec.ts`).
- `PortsHttpRepository`: testar com `HttpTestingController` — `getSummary()` chama `GET {apiUrl}/ports/summary`; `getDetails(id)` chama `GET {apiUrl}/ports/{id}/details`.
- `TabsComponent`: testar que uma aba com `feature` ausente no `AuthService` mockado fica bloqueada (sem `routerLink` ativo/sem navegação ao clicar), e que uma aba sem `feature` declarada nunca fica bloqueada.
- `featureGuard` já tem testes existentes (`feature.guard.spec.ts`) — não precisa de novos testes específicos para as rotas de Portos, só a configuração de `data.feature` por rota.
- Não testar contra o backend real — usar fakes/`HttpTestingController` para tudo.

## Fora de escopo

- Conteúdo real das abas Histórico, Terminais e Alertas.
- Modais de detalhe de embarcações nos blocos Fundeio/Canal de acesso/Atracados (só o botão desabilitado "em breve").
- Endpoint `GET /ports` (listagem administrativa/CRUD) — só leitura via `/ports/summary` e `/ports/{id}/details`.
- Qualquer alteração no `KpiCardComponent`/`TickerCardComponent` existentes.
- Paginação/busca server-side (tudo client-side sobre o array de `getSummary()`).

## Notas adicionais

- `docs/api/api-reference.md` já documenta `GET /ports/summary` e `GET /ports/{id}/details` com PRDs de backend referenciados (`docs/planning/ports-summary/`, `docs/planning/port-details/`) — esses diretórios não existem neste repositório (são do lado do backend); este PRD é o equivalente do lado frontend.
- Ao concluir, `docs/architecture/architecture.md` deve ganhar entradas para `TabsComponent`, `StatCardComponent`, o módulo `features/ports/` e a nova rota `/ports` no mapa de rotas.
