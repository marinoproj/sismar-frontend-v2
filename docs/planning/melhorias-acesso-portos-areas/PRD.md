Status: done

# PRD — Landing pós-login por permissão, configuração de áreas do porto e ações avançadas de Área

## Declaração do problema

Hoje, todo usuário autenticado cai em `/home` (uma página estática "Em construção") logo após o login, independentemente de ter acesso à página de Portos — que é a primeira página real de produto do sistema. Usuários com a feature `PORTOS` precisam navegar manualmente até `/ports` toda vez, e usuários sem essa feature não têm alternativa além do placeholder.

Além disso, a tela de configuração de Portos não permite associar a um porto quais `Area`s representam o fundeio, o canal de acesso e o perímetro do próprio porto — configuração que a API já expõe (`PUT/GET /ports/{id}/config`) mas que hoje só pode ser feita chamando a API diretamente.

Por fim, a tela de configuração de Áreas (perímetros) ficou incompleta em duas frentes: (1) faltam as ações de inativar e excluir permanentemente uma área — hoje só é possível ativar, nunca reverter — e a coluna de ações, com botões inline, não comporta mais itens sem poluir a tabela; (2) o botão de reordenar coordenadas (subir/descer) no formulário manual de área está com um bug e não produz nenhum efeito visível ao clicar.

## Solução

1. **Landing condicional por permissão**: a rota raiz (`/`) passa a verificar se o usuário tem a feature `PORTOS`. Se tiver, é redirecionado para `/ports`. Caso contrário, cai em `/home` (mantendo o placeholder "Em construção" já existente, sem alterações nele). O login também passa a navegar para `/` em vez de `/home` fixo, delegando a decisão para a rota raiz — cobrindo tanto o pós-login quanto qualquer acesso direto/atualização de página em `/`.

2. **Configuração de áreas do porto**: o dialog de cadastro/edição de porto ganha uma seção "Áreas do porto", habilitada apenas quando o porto já existe (foi salvo ao menos uma vez). Essa seção permite escolher, dentre as áreas já vinculadas àquele porto (`Area.portId === port.id`), quais são as áreas de fundeio (múltipla escolha), qual é o canal de acesso (única) e qual é o perímetro do porto (única). Uma mesma área não pode ser escolhida em mais de um desses papéis simultaneamente — a UI impede a seleção duplicada antes mesmo de chamar a API. Salvar essa seção chama `PUT /ports/{id}/config` separadamente do salvamento dos dados básicos do porto (nome/país/bandeira/imagem/coordenadas), que continua chamando `POST`/`PUT /ports` como hoje.

3. **Ações avançadas de Área — Inativar e Excluir**: a coluna de ações da tabela de Áreas passa a ser um dropdown (reaproveitando o `DropdownComponent` já existente no catálogo compartilhado, estendendo o `TableComponent` genérico para suportar esse modo de renderização de ações). O dropdown lista: Editar (renomeado de "Atualizar"), Ativar, Inativar, Job retroativo e Excluir. Itens indisponíveis para o estado atual da linha aparecem no menu desabilitados (não ocultos). "Inativar" chama `POST /area/{id}/deactivate` e "Excluir" chama `DELETE /area/{id}` (soft-delete), ambos atrás de um modal de confirmação (`ConfirmDialogComponent` já existente no catálogo, mesmo padrão usado em Portos/Terminais/Berços).

4. **Correção do reordenamento de coordenadas**: ao clicar em subir/descer no formulário manual de área, os valores de latitude/longitude das duas linhas trocam de lugar (permanecendo os mesmos controles/campos de formulário na mesma posição do DOM), corrigindo o bug atual em que a troca de identidade dos controles não se refletia na tela.

## User stories

### Landing pós-login

1. Como usuário com a feature `PORTOS`, quero ser redirecionado para `/ports` automaticamente após o login, para que eu chegue direto à página que uso no dia a dia.
2. Como usuário sem a feature `PORTOS`, quero continuar caindo em `/home` (Em construção) após o login, para que eu não veja uma tela em branco ou um erro de permissão.
3. Como usuário com a feature `PORTOS`, quero ser redirecionado para `/ports` também ao acessar a raiz do site diretamente (ex.: atualizar a página, abrir um favorito para `/`), não só logo após autenticar, para que o comportamento seja consistente em qualquer entrada pela raiz.
4. Como usuário, quero que o acesso direto a `/home` continue funcionando normalmente (sem redirecionamento condicional), para que a página placeholder continue navegável enquanto outras features não existem.

### Configuração de áreas do porto

5. Como usuário com `CONFIGURACAO_PORTO_EDITAR`, quero ver uma seção "Áreas do porto" ao editar um porto já cadastrado, para que eu associe as áreas de fundeio, canal de acesso e perímetro daquele porto.
6. Como usuário, ao criar um porto novo (ainda sem ID salvo), quero que essa seção apareça desabilitada ou com uma mensagem explicando que só fica disponível após salvar o porto pela primeira vez, para que eu não tente uma ação impossível.
7. Como usuário, quero que os seletores de fundeio/canal de acesso/área do porto listem apenas as áreas já vinculadas àquele porto (`Area.portId` igual ao porto em edição), para que eu não veja dezenas de áreas de outros portos misturadas.
8. Como usuário, quero marcar mais de uma área como "fundeio" (multi-seleção), para que eu represente pontos de ancoragem distintos do mesmo porto.
9. Como usuário, quero escolher no máximo uma área como "canal de acesso" e no máximo uma como "área do porto" (seleção única cada), para que a configuração reflita a realidade operacional do porto.
10. Como usuário, ao selecionar uma área em um dos três papéis, quero que ela deixe de estar disponível para seleção nos outros papéis, para que eu não crie uma configuração inválida que seria rejeitada pela API.
11. Como usuário, quero salvar essa seção de forma independente dos dados básicos do porto, para que eu possa ajustar só a configuração de áreas sem reenviar nome/país/imagem.
12. Como usuário, quero ver um toast de sucesso ao salvar a configuração de áreas do porto, para que eu saiba que a ação funcionou.
13. Como usuário, quero ver a mensagem de erro vinda da API (ex.: área inativa, área duplicada entre papéis) via toast quando a configuração for rejeitada, para que eu entenda o que corrigir.
14. Como usuário, ao reabrir o dialog de edição de um porto que já tem configuração de áreas salva, quero ver os seletores pré-preenchidos com a configuração atual (`GET /ports/{id}/config`), para que eu edite a partir do estado real.
15. Como usuário sem `CONFIGURACAO_PORTO_EDITAR`, não quero ver nem poder abrir a seção de áreas do porto, para que eu não tente uma ação que será rejeitada.

### Ações avançadas de Área (Inativar / Excluir / dropdown)

16. Como usuário com `CONFIGURACAO_AREA_EDITAR`, quero ver as ações da linha da tabela de Áreas agrupadas num dropdown (menu com ícone), para que a tabela fique mais limpa com a lista de ações crescendo.
17. Como usuário, quero que o item hoje chamado "Atualizar" passe a se chamar "Editar" no menu, para que o nome fique consistente com o resto do sistema.
18. Como usuário, quero ver "Ativar" habilitado apenas quando a área está inativa, e desabilitado (não oculto) quando já está ativa, para que eu entenda por que a ação não está disponível sem ela simplesmente sumir.
19. Como usuário com `CONFIGURACAO_AREA_EDITAR`, quero uma ação "Inativar" habilitada apenas quando a área está ativa, para que eu possa reverter a ativação sem excluir a área.
20. Como usuário, ao clicar em "Inativar", quero confirmar a ação num modal antes de ela ser executada, para que eu não inative uma área por engano.
21. Como usuário, quero ver um toast de sucesso após inativar uma área, para que eu saiba que a ação funcionou.
22. Como usuário, quero ver o erro da API via toast se a inativação for rejeitada (ex.: job retroativo em andamento), para que eu entenda o motivo.
23. Como usuário com a feature que protege exclusão de área, quero uma ação "Excluir" habilitada apenas quando a área está inativa, para que eu não tente excluir uma área ainda ativa (a API rejeita esse caso).
24. Como usuário, ao clicar em "Excluir", quero confirmar a ação num modal de confirmação com variante de perigo antes de ela ser executada, para que eu não perca uma área por engano.
25. Como usuário, quero ver um toast de sucesso após excluir uma área, e a linha some da tabela, para que eu saiba que a ação funcionou.
26. Como usuário, quero ver o erro da API via toast se a exclusão for rejeitada (ex.: área referenciada por um `PortConfig` ou `Berth`, ou com job retroativo em andamento), para que eu entenda o motivo sem precisar adivinhar.
27. Como usuário sem `CONFIGURACAO_AREA_EDITAR` (ou sem a feature de exclusão, quando aplicável), quero ver os itens correspondentes desabilitados no menu, para que eu saiba que a ação existe mas não tenho permissão.

### Correção do reordenamento de coordenadas

28. Como usuário preenchendo o formulário manual de área, quero que clicar em "mover para cima"/"mover para baixo" realmente troque a posição das coordenadas na lista, para que eu consiga reordenar os vértices do perímetro sem excluir e recadastrar linhas.

## Decisões de implementação

### Landing pós-login
- A rota raiz (`path: ''` dentro do `LayoutComponent`, hoje `redirectTo: 'home'` estático) passa a ser resolvida por um guard funcional (`CanMatchFn` ou `CanActivateFn`, a definir na implementação seguindo o estilo de `featureGuard` já existente) que checa `AuthService.hasFeature('PORTOS')`. Padrão recomendado: duas entradas de rota para o mesmo `path: ''`, uma com `canMatch` checando a feature e `redirectTo: 'ports'`, outra sem guard e `redirectTo: 'home'` como fallback — evita qualquer componente "vazio" e reaproveita a semântica nativa de `canMatch` para múltiplas definições do mesmo path.
- `LoginComponent` troca `router.navigate(['/home'])` por `router.navigate(['/'])`, deixando a raiz decidir o destino em todo caso (login, refresh, navegação direta).
- Nenhuma mudança em `/home` (`HomeComponent` continua igual) nem em `/ports` (rota e guard `featureGuard` com `data.feature = 'PORTOS'` já existentes).

### Configuração de áreas do porto
- Novo modelo e par repositório (contrato + implementação HTTP) para a configuração de áreas do porto (fundeio/canal de acesso/área do porto), distinto do `PortConfig`/`PortConfigRepository` já existentes hoje no código (que, apesar do nome, representam o CRUD básico do `Port` — nomenclatura pré-existente, fora de escopo renomear aqui). Esse novo repositório expõe `get(portId)` (→ `GET /ports/{id}/config`) e `update(portId, input)` (→ `PUT /ports/{id}/config`, corpo `{ anchorageAreaIds, accessChannelAreaId?, portAreaId? }`).
- A seção "Áreas do porto" é adicionada ao `port-form-dialog` existente, consumindo `AreaService` (já existente no módulo de Áreas) filtrado por `portId` para popular os seletores.
- Fica desabilitada/oculta enquanto o porto em edição não tiver `id` (fluxo de criação); ao editar um porto existente, a seção carrega a configuração atual via `GET /ports/{id}/config` e permite salvar via `PUT /ports/{id}/config`, com submit independente do formulário de dados básicos do porto.
- Validação client-side de não sobreposição entre os três papéis (fundeio/canal/perímetro) é feita apenas para UX (esconder/desabilitar opções já usadas em outro papel); a validação autoritativa continua sendo a resposta 400/404 da API, exibida via toast pelo interceptor global de erro já existente.

### Ações avançadas de Área
- `TableComponent` (catálogo compartilhado) ganha um modo de renderização de ações em dropdown (ex.: `actionsMode: 'inline' | 'dropdown'`, mantendo `'inline'` como padrão para não quebrar as demais telas que já usam `actions`), reaproveitando `DropdownComponent` e seu modelo `DropdownItem { label, icon?, action, disabled? }` já existentes.
- `AreasConfigPageComponent` passa a montar suas `actions` no novo modo dropdown, com os itens Editar/Ativar/Inativar/Job retroativo/Excluir e suas regras de habilitação conforme as user stories acima.
- Novas chamadas no `AreaService`/`AreaRepository`: `deactivate(id)` (→ `POST /area/{id}/deactivate`) e `delete(id)` (→ `DELETE /area/{id}`), seguindo o mesmo padrão de `activate(id)` já existente (recarrega a lista após sucesso).
- "Inativar" e "Excluir" abrem `ConfirmDialogComponent` (já existente, mesmo padrão usado em Portos/Terminais/Berços) antes de disparar a chamada; "Excluir" usa `variant: 'danger'`.
- Feature de proteção: "Editar"/"Ativar"/"Inativar"/"Job retroativo" continuam atrás de `CONFIGURACAO_AREA_EDITAR` (já existente). "Excluir" usa uma feature própria, `CONFIGURACAO_AREA_EXCLUIR`, seguindo o mesmo precedente já usado em Portos (`CONFIGURACAO_PORTO_EDITAR` vs. `CONFIGURACAO_PORTO_EXCLUIR`).

### Correção do reordenamento de coordenadas
- Causa raiz diagnosticada: `moveCoordinateUp`/`moveCoordinateDown` trocam a *identidade* dos `FormGroup` dentro do `FormArray.controls` diretamente (sem passar por `setControl`/`removeAt`/`insert`), e o template itera com `track $index` — a combinação faz com que a troca nunca se reflita visualmente, já que os componentes de input ligados àquela posição do array não são recriados nem percebem a troca de identidade do controle.
- Correção: trocar os **valores** (`lat`/`lon`) entre os dois `FormGroup`s nas posições envolvidas (via `patchValue`), em vez de trocar quais objetos `FormGroup` ocupam quais posições no array. Os controles do formulário permanecem estáveis; só o conteúdo exibido troca — efeito visual idêntico ao esperado, sem depender de o template recriar DOM por posição.

## Decisões de teste

- Testes devem validar comportamento observável (navegação resultante, chamadas HTTP disparadas, texto/estado renderizado, toasts exibidos), não detalhes internos de implementação — mesmo padrão já usado nos specs existentes do projeto (`TestBed` + Jest, `HttpTestingController`/repositórios mockados via `useValue`, CDK `Dialog` real com `dialog.openDialogs` para fluxos de modal ponta a ponta, como em `areas-config-page.draw-flow.spec.ts`).
- **Landing pós-login**: teste unitário do guard/lógica da rota raiz com `AuthService` mockado (`hasFeature` retornando `true`/`false`), verificando o `UrlTree`/redirecionamento resultante — sem precisar montar o roteador inteiro. Teste do `LoginComponent` garantindo que navega para `/` (não mais `/home`) após login bem-sucedido.
- **Configuração de áreas do porto**: teste do `port-form-dialog` (real CDK Dialog, como já feito para os dialogs de Área) cobrindo: seção desabilitada na criação; seção carregada com `GET /ports/{id}/config` ao editar; seleção de área em um papel remove-a dos outros seletores; submit chama `PUT /ports/{id}/config` com o payload esperado; toast de sucesso/erro.
- **Ações avançadas de Área**: extensão dos specs de fluxo já existentes (`areas-config-page.*.spec.ts`) cobrindo: item desabilitado no dropdown conforme estado da linha (`active`/feature ausente); confirmação via `ConfirmDialogComponent` real antes de chamar `deactivate`/`delete`; chamada correta ao repositório; toast e recarregamento da lista após sucesso; erro da API exibido (sem duplicar toast, já coberto pelo interceptor global).
- **`TableComponent` em modo dropdown**: teste isolado do componente garantindo que, com `actionsMode: 'dropdown'`, renderiza o `DropdownComponent` com os itens visíveis/desabilitados corretos, e que o modo `'inline'` (padrão) permanece com o comportamento atual inalterado — evita regressão nas demais telas que já usam `actions`.
- **Reordenamento de coordenadas**: teste unitário do `area-form-dialog.component.ts` chamando `moveCoordinateUp`/`moveCoordinateDown` e verificando que os *valores* de lat/lon trocaram de posição no `FormArray.getRawValue()` (não a identidade dos controles), incluindo os casos de borda (primeira linha não sobe, última não desce).

## Fora de escopo

- Tema padrão dark: já é o comportamento atual (`themeConfig.defaultMode = 'dark'` em `theme.config.ts`), nenhuma mudança de código necessária — confirmado com o usuário durante o grill desta feature.
- Qualquer alteração no fluxo de ativação de área (`POST /area/{id}/activate`) ou no modal de job retroativo além do já existente — este PRD só adiciona Inativar/Excluir/dropdown ao redor deles.
- Exclusão em cascata de `PortConfig`/`Berth` ao excluir uma área — a API já impede a exclusão nesse caso (409); não há tratamento especial além de exibir o erro.
- Renomear o `PortConfig`/`PortConfigRepository`/`PortConfigService` já existentes (que hoje representam o CRUD básico do `Port`, apesar do nome) — mantidos como estão para não ampliar o escopo desta mudança; o novo conceito de "configuração de áreas do porto" recebe nomes próprios, distintos.
- Qualquer nova feature/permissão além de `CONFIGURACAO_AREA_EXCLUIR` (novo) — as demais reaproveitam features já existentes.

## Notas adicionais

- Este PRD nasceu de uma sessão `grill-me` cobrindo quatro pedidos do usuário; o item de tema padrão foi resolvido como "nenhuma ação necessária" ainda naquela sessão e por isso não gera user stories nem issues de implementação.
- A feature `CONFIGURACAO_AREA_EXCLUIR` precisa existir no backend/sessão de autenticação para ser concedida a usuários — este PRD assume que o valor da feature seguirá o mesmo mecanismo já usado por `CONFIGURACAO_PORTO_EXCLUIR` (string simples em `session.features`).
