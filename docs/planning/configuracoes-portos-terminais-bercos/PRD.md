Status: done

# PRD — Configurações de Portos, Terminais e Berços

## Declaração do problema

Hoje o item de menu "Configurações" existe na navegação, mas não leva a lugar nenhum (não há rota `/settings` registrada). Não existe nenhuma tela no frontend para cadastrar a infraestrutura portuária de base — Portos, Terminais e Berços — mesmo a API já expondo os endpoints completos de CRUD para essas três entidades (`docs/api/api-reference.md`, seção "Portos e Infraestrutura Portuária"). Sem essas telas, esse cadastro só pode ser feito diretamente via API/backend, o que exclui usuários de negócio do fluxo e força dependência de alguém com acesso técnico toda vez que um porto, terminal ou berço novo precisa ser criado, corrigido ou desativado.

## Solução

Adicionar três páginas de configuração — Portos, Terminais e Berços — como submenus dentro de "Configurações", cada uma com: tabela com busca, botão para cadastrar novo registro, coluna de ações (editar/excluir) e modal de cadastro/edição. As três páginas consomem diretamente os endpoints já documentados (`/ports`, `/terminals`, `/berths`, `/area`), respeitando a hierarquia do domínio (Porto → Terminal → Berço) tanto na navegação (submenus na mesma ordem) quanto nos formulários (Terminal referencia um Porto; Berço referencia um Terminal e, opcionalmente, uma Área). O acesso a cada tela e a cada ação (ver/adicionar/editar/excluir) é controlado por feature própria, seguindo o padrão de permissionamento já existente no projeto.

## User stories

1. Como usuário com a feature `CONFIGURACAO_PORTO`, quero ver o item "Portos" dentro do menu "Configurações", para que eu saiba que essa tela existe e consiga navegar até ela.
2. Como usuário sem a feature `CONFIGURACAO_PORTO`, não quero ver o item "Portos" no menu, para que eu não tente acessar uma tela que não tenho permissão de usar.
3. Como usuário com `CONFIGURACAO_PORTO`, quero ver uma tabela com todos os portos cadastrados (nome, país, coordenadas), para que eu tenha uma visão geral do cadastro.
4. Como usuário com `CONFIGURACAO_PORTO`, quero buscar portos pelo nome, para que eu encontre rapidamente um porto específico numa lista grande.
5. Como usuário com `CONFIGURACAO_PORTO_ADICIONAR`, quero ver um botão "Novo porto" no topo da página, para que eu inicie o cadastro de um porto.
6. Como usuário sem `CONFIGURACAO_PORTO_ADICIONAR`, não quero ver o botão "Novo porto", para que eu não tente uma ação que será rejeitada.
7. Como usuário com `CONFIGURACAO_PORTO_ADICIONAR`, quero preencher nome, país, URL da imagem do porto, URL da bandeira do país e (opcionalmente) latitude/longitude num modal, para que eu cadastre um novo porto.
8. Como usuário, quero ser bloqueado com uma mensagem clara ao tentar cadastrar um porto com nome+país que já existe, para que eu entenda por que o cadastro falhou (erro 409 da API).
9. Como usuário, quero ser bloqueado com uma mensagem clara ao deixar campos obrigatórios (nome, país, imagem do porto, bandeira) em branco, para que eu corrija o formulário antes de reenviar.
10. Como usuário com `CONFIGURACAO_PORTO_EDITAR`, quero ver uma ação "Editar" na linha de cada porto, para que eu corrija dados cadastrados incorretamente.
11. Como usuário com `CONFIGURACAO_PORTO_EDITAR`, quero que o modal de edição venha preenchido com os dados atuais do porto, para que eu só altere o que for necessário.
12. Como usuário com `CONFIGURACAO_PORTO_EXCLUIR`, quero ver uma ação "Excluir" na linha de cada porto, para que eu remova um porto que não deveria mais existir.
13. Como usuário, quero confirmar a exclusão de um porto num diálogo de confirmação antes que ela aconteça, para que eu não exclua um registro por engano.
14. Como usuário, quero ser avisado quando a exclusão de um porto falhar porque ele tem Equipamentos associados, para que eu entenda que preciso remover essas dependências primeiro.
15. Como usuário sem nenhuma das features de Porto, Terminal ou Berço, não quero ver o grupo "Configurações" no menu, para que a navegação fique limpa.
16. Como usuário com a feature `CONFIGURACAO_TERMINAL`, quero ver o item "Terminais" dentro de "Configurações", para que eu acesse essa tela.
17. Como usuário com `CONFIGURACAO_TERMINAL`, quero ver uma tabela com todos os terminais cadastrados (nome, código, tipo, porto ao qual pertence), para que eu tenha uma visão geral do cadastro.
18. Como usuário com `CONFIGURACAO_TERMINAL`, quero buscar terminais pelo nome, para que eu encontre rapidamente um terminal específico.
19. Como usuário com `CONFIGURACAO_TERMINAL`, quero filtrar a lista de terminais por porto, para que eu veja apenas os terminais de um porto que me interessa.
20. Como usuário com `CONFIGURACAO_TERMINAL_ADICIONAR`, quero preencher nome, código, tipo (texto livre), porto (seleção) e, opcionalmente, URL de imagem/latitude/longitude num modal, para que eu cadastre um novo terminal.
21. Como usuário, quero que o campo "porto" do formulário de terminal seja um select alimentado pelos portos já cadastrados, para que eu não digite o nome de um porto errado ou inexistente.
22. Como usuário, quero ser bloqueado com mensagem clara se o porto selecionado não existir mais no momento do envio, para que eu entenda o erro 404 da API.
23. Como usuário com `CONFIGURACAO_TERMINAL_EDITAR`, quero editar um terminal existente, incluindo trocar o porto ao qual ele pertence, para que eu corrija cadastros errados.
24. Como usuário com `CONFIGURACAO_TERMINAL_EXCLUIR`, quero excluir um terminal, com confirmação prévia, para que eu remova cadastros que não devem mais existir.
25. Como usuário, quero ver a mensagem de erro da API quando a exclusão de um terminal falhar por estar em uso, para que eu entenda a causa do bloqueio.
26. Como usuário com a feature `CONFIGURACAO_BERCO`, quero ver o item "Berços" dentro de "Configurações", para que eu acesse essa tela.
27. Como usuário com `CONFIGURACAO_BERCO`, quero ver uma tabela com todos os berços cadastrados (nome, terminal, área associada, comprimento, calado), para que eu tenha uma visão geral do cadastro.
28. Como usuário com `CONFIGURACAO_BERCO`, quero buscar berços pelo nome, para que eu encontre rapidamente um berço específico.
29. Como usuário com `CONFIGURACAO_BERCO_ADICIONAR`, quero, no modal de cadastro, primeiro escolher um porto, para que a lista de terminais seguinte já venha filtrada e eu não precise procurar entre todos os terminais do sistema.
30. Como usuário, quero que, após escolher o porto, o select de terminal mostre apenas os terminais daquele porto, para que eu não selecione um terminal de outro porto por engano.
31. Como usuário, quero que, após escolher o terminal, o select de área mostre as áreas do porto correspondente (mais as áreas sem porto vinculado), para que eu associe um berço a uma área geograficamente coerente.
32. Como usuário, quero que o campo de área seja opcional no cadastro de berço, para que eu possa cadastrar um berço mesmo antes de uma área geográfica existir para ele.
33. Como usuário com `CONFIGURACAO_BERCO_ADICIONAR`, quero preencher nome, terminal, área (opcional), comprimento e calado (opcionais) num modal, para que eu cadastre um novo berço.
34. Como usuário com `CONFIGURACAO_BERCO_EDITAR`, quero editar um berço existente, incluindo os selects de terminal e área, para que eu corrija cadastros errados.
35. Como usuário com `CONFIGURACAO_BERCO_EXCLUIR`, quero excluir um berço, com confirmação prévia, para que eu remova cadastros que não devem mais existir.
36. Como usuário, quero que qualquer erro inesperado da API (400/404/409) em qualquer uma das três telas apareça como uma notificação (toast) com a mensagem retornada pelo backend, para que eu sempre saiba por que uma ação falhou.

## Decisões de implementação

- Nova feature Angular lazy-loaded `settings`, registrada em `app.routes.ts` com `path: 'settings'`, redirecionando por padrão (`''`) para o path de Portos.
- Dentro dela, um módulo por domínio (Portos, Terminais, Berços), cada um com seu próprio model, repository abstrato + `InjectionToken` + implementação HTTP, e service — seguindo exatamente o padrão já usado em `features/ports` (repository/service isolados por feature, DI por rota).
- Os models desses três novos módulos são de **cadastro/configuração** e não reaproveitam nem colidem com os models já existentes em `features/ports` (`PortSummary`, `PortDetails`, focados em indicadores operacionais) — nomes devem deixar essa distinção clara.
- Rotas filhas (`settings/ports`, `settings/terminals`, `settings/berths`) cada uma protegida por `featureGuard` com a feature "de visualização" correspondente (`CONFIGURACAO_PORTO`, `CONFIGURACAO_TERMINAL`, `CONFIGURACAO_BERCO`).
- As ações de adicionar/editar/excluir dentro de cada página são condicionadas às features específicas (`_ADICIONAR`, `_EDITAR`, `_EXCLUIR`) via `*appHasFeature` (esconder botão/ação) — a validação definitiva continua sendo do backend.
- `nav-items.ts`: o item "Configurações" (hoje único, sem `children`, apontando para `/settings`) passa a ter `children` com os três submenus, na ordem Portos → Terminais → Berços, cada um com seu `feature` de visualização. O grupo já herda o comportamento de esconder-se quando nenhum filho é visível (comportamento existente da sidebar para grupos).
- Cada página de listagem usa o componente `app-table` já existente, com busca (`searchable`, `searchChange`) disparando a query correspondente na API (`?name=` para Portos e Berços; `?name=&portId=` para Terminais) com debounce, e não filtro em memória — sem paginação (os endpoints não paginam).
- Terminais: além da busca por nome, um select de porto acima da tabela filtra a listagem via `?portId=`.
- Cada modal de cadastro/edição segue o padrão de `modal-shell` + CDK `Dialog` + `ReactiveFormsModule`, no mesmo formato do `customer-form-dialog` de referência (`features/ui-elements`), ficando localizado junto da página que o usa (não em `shared/`).
- Exclusão em todas as três telas reaproveita o `ConfirmDialogComponent` genérico já existente (`variant: 'danger'`), sem componente novo.
- Modal de Porto: campos `name`, `country`, `imagePort` (texto, URL), `countryFlag` (texto, URL), `latitude`/`longitude` (opcionais). Sem upload de arquivo — a API só aceita string de URL.
- Modal de Terminal: campos `name`, `code`, `terminalType` (texto livre — não há enum documentado no backend), `portId` (select alimentado pela listagem/serviço de Portos), `imageTerminal`/`latitude`/`longitude` (opcionais).
- Modal de Berço: fluxo em cascata — select de Porto (client-side, apenas para filtrar o próximo passo, não é campo do `BerthDTO`) → select de Terminal (via `GET /terminals?portId=`) → select de Área (via `GET /area`, filtrado no cliente por `area.portId` igual ao porto escolhido, **mais** as áreas com `portId` nulo, sempre incluídas) → campos `name`, `length`, `draft` (opcionais). Ao editar um berço existente, o porto/terminal/área atuais devem vir pré-selecionados usando os dados de `BerthDetailDTO` (`terminal.portId` e `area`).
- Repository de Área é novo, mas **somente leitura** (`GET /area`), usado apenas para alimentar o select do modal de Berço — não há tela de configuração de Área neste PRD.
- Tratamento de erro: interceptar respostas `400`/`404`/`409` da API nas três telas e exibir a `message` retornada via `ToastService`, seguindo o tratamento global de erros já existente no projeto.

## Decisões de teste

- Um bom teste aqui valida comportamento observável (requisição HTTP correta disparada, resposta mapeada corretamente, erro tratado), não detalhes internos de implementação.
- Cada `*HttpRepository` (Port config, Terminal, Berth, Area — leitura) ganha um spec unitário mockando HTTP via `HttpTestingController`, no mesmo formato de `src/app/features/ports/repositories/ports-http.repository.spec.ts`: uma constante de referência (`environment.apiUrl`), `httpMock.expectOne(...)` verificando método e URL (incluindo query params de busca/filtro), `req.flush(...)` e `httpMock.verify()` no `afterEach`.
- Cada `*Service` (orquestração acima do repository) ganha spec unitário testando o comportamento exposto (ex.: `search(name)` chama o repository com o parâmetro certo, erro do repository propaga/é tratado).
- `nav-items.spec.ts` é atualizado para cobrir a visibilidade condicional dos três novos itens filhos de "Configurações" por feature, e do grupo como um todo quando nenhuma das três features está presente.
- Sem testes E2E de página/modal neste PRD — não há esse padrão hoje no projeto; a validação de UI (fluxo completo de criar/editar/excluir em cada tela) é manual.

## Fora de escopo

- Tela de configuração de Área (CRUD) — a API já existe e é usada apenas como consulta (select) no cadastro de Berço.
- Upload de arquivo para os campos de imagem — permanecem como texto de URL.
- Paginação nas tabelas — os endpoints de listagem não paginam.
- Qualquer enum/catálogo fixo para `terminalType` ou `country` no frontend — permanecem texto livre, espelhando o contrato atual da API.
- Alterações no módulo `features/ports` existente (dashboard/detalhes operacionais).
- Endpoint/tela para verificar previamente se um registro pode ser excluído (dependências) — a UI apenas reage ao erro `409` retornado pela tentativa de exclusão.

## Notas adicionais

- A ordem de implementação sugerida segue a hierarquia de dependência do domínio: Portos antes de Terminais (o formulário de Terminal depende do serviço de Portos para o select), e Terminais antes de Berços (o formulário de Berço depende do serviço de Terminais e, pela primeira vez, do repository de Área).
- As strings de feature (`CONFIGURACAO_PORTO`, `CONFIGURACAO_TERMINAL`, `CONFIGURACAO_BERCO` e as variantes `_ADICIONAR`/`_EDITAR`/`_EXCLUIR`) foram definidas pelo solicitante e devem ser usadas exatamente como especificado — o backend precisa emitir essas strings na sessão do usuário (`AuthSession.features`) para que o permissionamento funcione.
