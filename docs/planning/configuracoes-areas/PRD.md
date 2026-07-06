Status: done

# PRD — Configurações de Áreas (Perímetros)

## Declaração do problema

O sistema já expõe o CRUD completo de `Area` na API (`docs/api/api-reference.md`, seção "Area") — perímetros geográficos usados para detectar entrada/saída de navios — mas não existe nenhuma tela de gestão dessas áreas no frontend. Hoje `Area` só é consumida como leitura (`GET /area`) dentro do formulário de cadastro de Berço, para vincular um berço a uma área existente. Não há como cadastrar, editar, visualizar num mapa, ativar ou acompanhar o processamento retroativo de uma área sem acessar a API diretamente, o que exclui usuários de negócio desse fluxo.

## Solução

Adicionar um item "Áreas" dentro do menu "Configurações", levando a uma página com dois modos de visualização alternáveis (Tabela / Mapa), sem perder estado ao trocar entre eles:

- **Modo Tabela**: lista todas as áreas cadastradas (nome, porto, status ativa/inativa, quantidade de coordenadas) com busca, ação "Atualizar" (edição manual via modal), ação "Ativar" e ação "Gerenciar job retroativo" (modal para disparar/consultar/cancelar o reprocessamento histórico que a API exige antes da ativação). Não há exclusão nesta versão.
- **Modo Mapa**: desenha todas as áreas ativas como polígonos (borda verde, preenchimento verde translúcido, nome no primeiro vértice), com zoom/centro ajustados automaticamente ao conjunto de áreas ativas. Permite iniciar o cadastro/atualização de uma área desenhando o perímetro diretamente no mapa, com clique sucessivo de vértices e fechamento por proximidade do primeiro ponto.

O cadastro/edição sempre oferece a escolha entre informar coordenadas manualmente (lista editável de lat/lon) ou desenhar no mapa; a edição via tabela usa sempre o modal manual. O acesso à tela e a cada ação é controlado por feature própria, seguindo o padrão de permissionamento já existente no projeto.

## User stories

1. Como usuário com a feature `CONFIGURACAO_AREA`, quero ver o item "Áreas" dentro do menu "Configurações", para que eu saiba que essa tela existe e consiga navegar até ela.
2. Como usuário sem a feature `CONFIGURACAO_AREA`, não quero ver o item "Áreas" no menu, para que eu não tente acessar uma tela que não tenho permissão de usar.
3. Como usuário, quero alternar entre visualização em Tabela e em Mapa através de um botão/toggle no topo da página, para que eu escolha a forma mais conveniente de consultar as áreas.
4. Como usuário, quero que trocar entre Tabela e Mapa não descarte busca/filtros já aplicados, para que eu não precise refazer o que já tinha configurado.
5. Como usuário com `CONFIGURACAO_AREA`, quero ver uma tabela com todas as áreas cadastradas (nome, porto, status, quantidade de coordenadas), para que eu tenha uma visão geral do cadastro.
6. Como usuário com `CONFIGURACAO_AREA`, quero buscar áreas pelo nome, para que eu encontre rapidamente uma área específica numa lista grande.
7. Como usuário com `CONFIGURACAO_AREA_ADICIONAR`, quero ver um botão "Adicionar área" no topo da página, para que eu inicie o cadastro de uma nova área.
8. Como usuário sem `CONFIGURACAO_AREA_ADICIONAR`, não quero ver o botão "Adicionar área", para que eu não tente uma ação que será rejeitada.
9. Como usuário, ao clicar em "Adicionar área", quero escolher entre "Informar dados manualmente" ou "Desenhar no mapa", para que eu use a forma mais adequada ao meu caso.
10. Como usuário, ao escolher cadastro manual, quero preencher nome, porto (opcional) e uma lista de coordenadas (latitude/longitude decimais) num modal, para que eu cadastre uma nova área.
11. Como usuário, quero adicionar e remover linhas de coordenadas na lista do formulário manual, para que eu monte o perímetro com a quantidade de vértices que precisar.
12. Como usuário, quero reordenar as coordenadas da lista usando botões de subir/descer, para que eu ajuste a ordem dos vértices do polígono sem recomeçar.
13. Como usuário, quero que o sistema feche automaticamente o perímetro (repetindo a primeira coordenada como última) sem eu precisar digitá-la de novo, para que eu não cometa erros de digitação nesse ponto redundante.
14. Como usuário, quero ser bloqueado ao tentar salvar um perímetro com menos de 3 coordenadas únicas, latitude/longitude inválidas, ou polígono aberto, para que eu corrija o cadastro antes de enviar.
15. Como usuário, quero ver um indicador de carregamento no botão "Salvar" do modal enquanto a API processa o cadastro/atualização, para que eu saiba que a ação está em andamento.
16. Como usuário, quero ver um toast de sucesso ou erro após cadastrar/atualizar uma área, para que eu saiba se a ação deu certo.
17. Como usuário com `CONFIGURACAO_AREA_EDITAR`, quero ver uma ação "Atualizar" na linha de cada área na tabela, para que eu corrija dados cadastrados incorretamente.
18. Como usuário, quero que a ação "Atualizar" da tabela sempre abra o modal de edição manual (nome, porto, coordenadas), para que eu edite os dados com previsibilidade.
19. Como usuário, quero que o modal de edição venha preenchido com os dados atuais da área (incluindo a lista de coordenadas), para que eu só altere o que for necessário.
20. Como usuário sem `CONFIGURACAO_AREA_EDITAR`, não quero ver as ações de atualizar, ativar ou gerenciar job retroativo, para que eu não tente ações que serão rejeitadas.
21. Como usuário com `CONFIGURACAO_AREA_EDITAR`, quero ver uma ação "Ativar" na linha de cada área inativa, para que eu ative uma área já pronta para gerar eventos.
22. Como usuário, quero que "Ativar" apenas chame a ativação (sem disparar reprocessamento), e que erros de negócio (ex.: nenhum job retroativo concluído ainda) apareçam num toast claro, para que eu entenda por que a ativação falhou.
23. Como usuário com `CONFIGURACAO_AREA_EDITAR`, quero ver uma ação "Gerenciar job retroativo" na linha de cada área, para que eu administre o processamento histórico daquela área.
24. Como usuário, ao abrir o modal de job retroativo, quero ver o status do último job (modo, status, período, progresso, erro se houver), para que eu saiba o que já foi feito.
25. Como usuário, quero disparar um novo job escolhendo entre modo Completo (com campo obrigatório "Período em dias") ou Incremental (sem esse campo), para que eu reprocesse o histórico da forma adequada.
26. Como usuário, quero um botão "Atualizar status" dentro do modal de job para consultar o progresso mais recente, para que eu acompanhe o andamento sem fechar e reabrir o modal.
27. Como usuário, quero cancelar um job em andamento a partir do mesmo modal, para que eu interrompa um reprocessamento iniciado por engano ou desnecessário.
28. Como usuário, quero ver mensagens de erro claras da API no modal de job (ex.: já existe job em andamento, modo incremental sem job completo anterior), para que eu entenda por que a ação falhou.
29. Como usuário com `CONFIGURACAO_AREA`, quero alternar para o Modo Mapa e ver todas as áreas ativas desenhadas como polígonos (borda verde, preenchimento verde translúcido), para que eu visualize os perímetros geograficamente.
30. Como usuário, quero ver o nome da área exibido próximo à primeira coordenada do seu perímetro no mapa, para que eu identifique cada área sem precisar clicar.
31. Como usuário, quero que o mapa ajuste automaticamente zoom e centro para enquadrar todas as áreas ativas ao abrir a página, para que eu veja o conjunto completo sem precisar navegar manualmente.
32. Como usuário, quero que, sem nenhuma área ativa cadastrada, o mapa caia num centro/zoom padrão, para que a tela não fique quebrada ou vazia sem contexto.
33. Como usuário, ao escolher "Desenhar no mapa" (para criar ou atualizar), quero clicar sucessivamente para adicionar vértices, vendo linhas ligando os pontos e um marcador em cada vértice, para que eu construa o perímetro visualmente.
34. Como usuário, quero que o sistema destaque visualmente o primeiro ponto quando meu cursor estiver próximo o suficiente dele, indicando que um clique ali fechará o polígono, para que o fechamento seja intuitivo sem precisar acertar o pixel exato.
35. Como usuário, quero poder cancelar o desenho a qualquer momento pressionando ESC, para que eu desista sem precisar recarregar a página.
36. Como usuário, ao fechar um polígono desenhado no mapa, quero que um modal pergunte se desejo criar uma nova área ou atualizar uma área existente, para que eu decida o destino daquele perímetro.
37. Como usuário, ao escolher "Criar nova área" após desenhar, quero preencher apenas nome e porto (opcional) num modal, já com as coordenadas desenhadas preenchidas automaticamente, para que eu finalize o cadastro rapidamente.
38. Como usuário, ao escolher "Atualizar área existente" após desenhar, quero selecionar a área (entre todas, ativas e inativas) num combobox, para que o novo perímetro desenhado substitua o anterior mantendo nome/porto/status intactos.
39. Como usuário, quero que tentar salvar um polígono inválido (menos de 3 vértices únicos) seja bloqueado antes mesmo de abrir o modal de destino, para que eu não perca tempo escolhendo criar/atualizar com um desenho inválido.

## Decisões de implementação

- **Menu** — novo item "Áreas" dentro do grupo "Configurações" (mesmo padrão de filtragem por feature já usado por Portos/Terminais/Berços), gated pela feature `CONFIGURACAO_AREA`.

- **Rota** — `settings/areas`, lazy-loaded, seguindo o mesmo padrão de `settings/ports`/`settings/terminals`/`settings/berths`: `canActivate: [featureGuard]`, providers escopados à rota.

- **Consolidação do repositório de Area** — o `Area` model/repositório read-only hoje em `settings/berths/` (usado só no combobox de área do formulário de Berço) é substituído por um model/repositório completo em `features/settings/areas/`, incluindo `coordinates`. `settings/berths/` passa a importar `Area`/`AREA_REPOSITORY` de `settings/areas/`, no mesmo padrão de import cruzado já usado (ex.: Terminal importando `PortConfig` de `settings/ports/`).

- **Modelo de dados** — `Area`: `id`, `name`, `coordinates: {lat, lon}[]` (com a coordenada de fechamento duplicada — primeira = última — incluída no array, tanto na leitura quanto no payload enviado), `portId?`, `active` (somente leitura no frontend — nunca enviado em create/update). Input de criação/atualização (`AreaInput`): `name`, `coordinates`, `portId?` — sem campo de status.

- **Repositório/serviço de Area** — métodos: `getAll()`, `getById(id)`, `create(input)`, `update(id, input)`, `activate(id)`, `getLastRetroactiveJob(id)` (trata 404 como "nenhum job ainda", não como erro), `triggerRetroactiveJob(id, {periodDays?, catchUp?})`, `cancelRetroactiveJob(id)`. Segue o mesmo padrão repository abstrato + `InjectionToken` + implementação HTTP dos módulos irmãos.

- **Página de Áreas** — dois modos de visualização (Tabela/Mapa) alternados por um toggle no topo, mantidos como estado local do componente (signal), sem rotas separadas, preservando busca/filtro ao trocar de modo.

- **Modo Tabela** — reutiliza `TableComponent` existente. Colunas: nome, porto, status (badge Ativa/Inativa), quantidade de coordenadas (`coordinates.length`, descontando a duplicata de fechamento se optar por exibir a contagem de vértices únicos — a decidir na implementação, sem impacto de contrato). Ações: "Atualizar" (abre modal manual), "Ativar" (visível só quando `active === false`; chama `activate(id)` diretamente, sem disparar job; erros tratados via toast pelo interceptor global), "Gerenciar job retroativo" (abre modal de job). Ações gated por `CONFIGURACAO_AREA_EDITAR`. Sem ação de exclusão.

- **Modal de cadastro/edição manual** — reutilizado para criar e editar. Campos: nome, porto (select opcional alimentado pelos portos já cadastrados), lista de coordenadas (`FormArray` de lat/lon) com botões adicionar/remover linha e subir/descer para reordenar. Fecha automaticamente o polígono ao montar o payload (adiciona a primeira coordenada como última antes de enviar, sem exigir que o usuário a digite). Validações bloqueiam salvar com menos de 3 coordenadas únicas ou lat/lon inválidos. Segue o padrão já estabelecido nos dialogs de Porto/Terminal/Berço: o próprio dialog é dono da chamada à API, com signal `saving` para o indicador de carregamento no botão "Salvar" e toast de sucesso/erro.

- **Modal "escolher forma de cadastro"** — ao clicar "Adicionar área" (ou "Atualizar" via desenho), pergunta entre "Informar dados manualmente" (abre o modal manual vazio/preenchido) ou "Desenhar no mapa" (ativa o modo de desenho na visualização de mapa).

- **Modo Mapa** — reutiliza `MapComponent`/`MapPolygonComponent` existentes (`shared/ui/map/`) para renderizar as áreas ativas (borda verde `#22c55e` ou similar, `fillOpacity` translúcido, tooltip/label com o nome fixado na primeira coordenada). Bounding box calculado a partir das coordenadas de todas as áreas ativas (via `L.latLngBounds` + `map.fitBounds`); sem áreas ativas, mantém o center/zoom padrão já existente no `MapComponent` (Brasília, zoom 5).

- **Desenho de perímetro no mapa** — novo componente que escuta eventos de clique do `L.Map` (via `MapService`/instância exposta), acumulando vértices num array reativo, desenhando uma polyline de preview e marcadores por vértice a cada clique. Construído à mão sobre a API do Leaflet (sem plugin novo tipo `leaflet-draw`/Geoman), consistente com a decisão já tomada no PRD de Maps ("wrapper Angular manual sem biblioteca de terceiros"). Detecção de proximidade do primeiro ponto usa uma tolerância fixa em pixels (constante no código, não configurável via UI) comparando a posição do clique/cursor à posição do primeiro marcador na tela; quando dentro da tolerância, o primeiro marcador é destacado visualmente e o próximo clique nele fecha o polígono (adiciona a coordenada de fechamento duplicada automaticamente). Tecla ESC cancela o desenho em andamento a qualquer momento, limpando vértices/preview.

- **Pós-fechamento do desenho** — ao fechar o polígono, valida mínimo de 3 vértices únicos antes de abrir o modal "Criar nova área / Atualizar área existente". Em "Criar nova área": abre modal reduzido pedindo só nome e porto, com `coordinates` já preenchido pelo desenho. Em "Atualizar área existente": abre um combobox (buscando `getAll()`, sem filtrar por status) para selecionar a área; ao confirmar, dispara `update(id, {...área selecionada, coordinates: novasCoordenadas})`, preservando nome/porto/status.

- **Permissionamento** — `CONFIGURACAO_AREA` (visualizar/consultar), `CONFIGURACAO_AREA_ADICIONAR` (botão "Adicionar área" e fluxo de criação, manual ou por desenho), `CONFIGURACAO_AREA_EDITAR` (ação "Atualizar", "Ativar", "Gerenciar job retroativo" e atualização por desenho). `CONFIGURACAO_AREA_EXCLUIR` é definida na especificação de permissões mas não é usada por nenhuma ação nesta versão (sem exclusão).

## Decisões de teste

- Bons testes cobrem comportamento observável (o que o usuário vê/pode fazer), não detalhes de implementação — mesmo padrão já usado nos módulos irmãos (Porto/Terminal/Berço).
- `AreaHttpRepository`: spec por método HTTP (`getAll`, `create`, `update`, `activate`, `getLastRetroactiveJob` incluindo o caso 404 tratado como ausência de job, `triggerRetroactiveJob`, `cancelRetroactiveJob`), seguindo o padrão de `port-config-http.repository.spec.ts`.
- `AreaService`: cobre busca debounced e `reload` pós-CRUD, seguindo o padrão de `port-config.service.spec.ts` (uso de `fakeAsync`/`tick`, injeção dentro do corpo do teste por causa do `debounceTime`).
- Modal de cadastro/edição manual: estado `saving` durante a chamada, reabilitação do botão em erro, bloqueio de duplo-submit, validação de mínimo de coordenadas/lat-lon inválidos e fechamento automático do polígono no payload — seguindo `port-form-dialog.component.spec.ts`.
- Página (modo Tabela): visibilidade de ações por feature, comportamento de "Ativar" (chamada direta, sem job), abertura do modal de job.
- Modal de job retroativo: exibição do status do último job (incluindo ausência de job), disparo em modo Completo (com período) e Incremental (sem período), botão de atualizar status, cancelamento, e mensagens de erro da API.
- Componente de desenho no mapa: testes automatizados de interação de mapa (clique, proximidade, ESC) são difíceis de automatizar de forma confiável com Leaflet/DOM real — validação manual conforme os "Critérios de aceite" abaixo. Lógica pura de detecção de proximidade e fechamento de polígono (cálculo de distância, decisão de fechar) deve ser extraída para função/serviço testável isoladamente sem depender do DOM do Leaflet.
- Testes automatizados de renderização de polígonos no mapa (`MapPolygonComponent`) e cálculo de bounding box: mesmo padrão de "fora de escopo" já adotado no PRD de Maps para automação de mapa; cálculo de bounding box (dado um array de áreas, produzir os bounds corretos) deve ser testável isoladamente como função pura.

## Fora de escopo

- Exclusão de áreas.
- Configurável em tempo real da tolerância de proximidade de fechamento do polígono (fica fixa no código).
- Polling automático de status do job retroativo (atualização é manual, via botão).
- Clustering, geocoding, busca de endereço ou qualquer funcionalidade de mapa não explicitamente pedida aqui.
- Notificações (`NotifyAreaClient`) e qualquer configuração de porto (`PortConfig` — fundeio/canal de acesso/perímetro do porto) que referencie `Area`.
- Testes automatizados de interação de desenho no mapa (clique/proximidade/ESC via DOM real do Leaflet).

## Notas adicionais

- Depende da infraestrutura de mapa já existente (`shared/ui/map/`, PRD `docs/planning/maps-showcase/`) e do padrão de permissionamento/CRUD estabelecido em `docs/planning/configuracoes-portos-terminais-bercos/`.
- Risco de contrato conhecido e aceito: a documentação da API (`docs/api/api-reference.md`) descreve `coordinates` como exigindo "mínimo 3 pontos para formar um polígono válido", sem deixar explícito se esse mínimo considera ou não a coordenada de fechamento duplicada. Foi decidido enviar o array sempre com a duplicata de fechamento incluída (N vértices únicos + 1 repetido = mínimo 4 itens no array para um triângulo). Se a API rejeitar essa forma ou tratar a duplicata como um vértice degenerado, será necessário revisitar essa decisão.
- A ativação de área (`POST /area/{id}/activate`) e o fluxo de job retroativo (`POST /area/{id}/retroactive-events`, `GET .../retroactive-jobs/last`, `POST .../retroactive-jobs/last/cancel`) são tratados como duas ações independentes na UI, propositalmente não encadeadas automaticamente — o usuário decide quando reprocessar e quando ativar.
