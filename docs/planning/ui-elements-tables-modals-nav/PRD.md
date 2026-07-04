Status: done

# Tables, Modals e nav scroll (UI Elements)

## Declaração do problema

O catálogo `UI Elements` demonstra componentes isolados (badges, buttons, cards, dropdowns, etc.), mas não mostra como compor tabelas de dados com variações do mundo real (paginação, busca, colunas com badge/progress, linhas com/sem destaque) nem como abrir modais para os padrões mais comuns de um admin (confirmar exclusão, confirmar ação, ver detalhes, cadastrar via formulário). Hoje não existe nenhum componente de modal no projeto — cada feature que precisar de um teria que criar o seu do zero, sem padrão compartilhado. Além disso, a barra de scroll do menu lateral (nav) usa o visual padrão do navegador, destoando do resto do design do template.

## Solução

Duas novas páginas em `ui-elements/`:

- **Tables**: demonstra o `TableComponent` existente, estendido com suporte a striping opcional e busca embutida, exibindo variações combinando paginação, busca, colunas com `app-badge`/`app-progress` e striping ligado/desligado — tudo sobre um único domínio mock ("Pedidos").
- **Modals**: introduz o primeiro conjunto de componentes de modal do projeto, construídos sobre `@angular/cdk/dialog`, com uma casca visual compartilhada (`ModalShellComponent`) e três variações reutilizáveis: confirmação (exclusão/ação), detalhes (conteúdo arbitrário via `TemplateRef`) e formulário de cadastro.

Além disso, a barra de scroll do `<nav>` da sidebar ganha um visual customizado (fino, arredondado, translúcido), consistente com os temas light/dark do template.

## User stories

1. Como desenvolvedor navegando o catálogo UI Elements, quero uma página "Tables", para que eu veja exemplos reais de como compor o `TableComponent` com diferentes variações.
2. Como desenvolvedor, quero ver uma tabela básica sem paginação e sem striping, para que eu entenda o caso de uso mais simples do componente.
3. Como desenvolvedor, quero ver uma tabela com paginação, para que eu entenda como conectar `totalItems`, `pageSize`, `currentPage` e o evento `pageChange`.
4. Como desenvolvedor, quero ver uma tabela com campo de busca, para que eu entenda como usar o novo `@Input searchable` e `@Output searchChange` do `TableComponent`.
5. Como desenvolvedor, quero ver uma tabela com uma coluna de status renderizada como badge e uma coluna de progresso renderizada com a barra de progresso, para que eu entenda como usar `col.template` para células customizadas reaproveitando `app-badge` e `app-progress`.
6. Como desenvolvedor, quero ver duas tabelas lado a lado — uma com striping (linhas alternando cor) e outra sem (fundo transparente) — para que eu entenda o novo `@Input striped` do `TableComponent`.
7. Como desenvolvedor, quero que o `@Input striped` tenha valor padrão `true`, para que tabelas existentes no projeto continuem com a aparência atual sem precisar de nenhuma mudança.
8. Como desenvolvedor navegando o catálogo UI Elements, quero uma página "Modals", para que eu veja os padrões de modal disponíveis no projeto.
9. Como desenvolvedor, quero abrir um modal de confirmação de exclusão (variante de perigo, vermelho), para que eu veja o padrão recomendado para ações destrutivas.
10. Como desenvolvedor, quero abrir um modal de confirmação de ação genérica (variante primária), para que eu veja que o mesmo `ConfirmDialogComponent` cobre os dois casos, mudando apenas os dados passados.
11. Como desenvolvedor, quero abrir um modal de detalhes que exibe KPI cards e uma tabela com os itens de um pedido, para que eu veja como projetar conteúdo arbitrário (outros componentes já existentes no catálogo) dentro de um modal via `TemplateRef`.
12. Como desenvolvedor, quero abrir um modal com um formulário de cadastro de cliente (nome, e-mail, telefone, categoria via select, ativo via checkbox, botão salvar), para que eu veja o padrão de formulário reativo (`ReactiveFormsModule` + `FormBuilder`) dentro de um modal.
13. Como desenvolvedor, quero que todo modal feche ao clicar no backdrop, pressionar ESC ou clicar no botão de fechar, para que o comportamento seja previsível e consistente entre os três tipos de modal.
14. Como desenvolvedor, quero que os modais herdem a aparência do tema light/dark ativo, para que não haja inconsistência visual ao trocar o tema com um modal aberto.
15. Como desenvolvedor, quero que qualquer feature futura do projeto possa reaproveitar `ConfirmDialogComponent` e `DetailModalComponent` sem precisar criar um novo componente de dialog, para que o padrão de modal fique centralizado em `shared/ui/`.
16. Como usuário da aplicação, quero que a barra de scroll do menu lateral tenha um visual fino e moderno (não o padrão do navegador), para que a interface pareça mais polida.
17. Como usuário da aplicação, quero que a barra de scroll do menu lateral continue legível e com bom contraste tanto no tema light quanto no dark do app, para que a experiência seja consistente independente do tema escolhido.
18. Como desenvolvedor, quero que a nova entrada "Tables" e "Modals" apareçam no menu lateral dentro do grupo "UI Elements", para que sejam navegáveis como as demais páginas do catálogo.

## Decisões de implementação

### Tables

- `TableComponent` (`src/app/shared/ui/table/`) é estendido, não substituído:
  - `@Input striped = true`: controla se as linhas alternam cor (comportamento atual, mantido como padrão) ou ficam com fundo transparente/uniforme.
  - `@Input searchable = false` + `@Output searchChange = new EventEmitter<string>()`: quando `true`, o componente renderiza um campo de busca acima da tabela; ele apenas emite o termo digitado — a filtragem dos dados continua sendo responsabilidade do componente pai, seguindo o mesmo padrão "componente burro" já usado na paginação (`pageChange`).
  - Colunas com badge/progress usam o mecanismo já existente `ColumnDef.template` (`TemplateRef`) — nenhuma mudança de API é necessária para isso.
- Nova página `src/app/features/ui-elements/pages/tables-page/`, registrada em `uiElementsRoutes` como `tables` (breadcrumb "Tables") e em `nav-items.ts` dentro do grupo "UI Elements".
- 5 tabelas de demonstração, todas sobre um único array mock de "Pedidos" (id, cliente, status, valor, progresso de entrega, data):
  1. Básica — sem paginação, sem striping (`striped=false`).
  2. Com paginação — usa `totalItems`/`pageSize`/`currentPage`/`pageChange`.
  3. Com busca — usa `searchable`/`searchChange`, filtrando o array mock localmente na página.
  4. Colunas customizadas — status via `app-badge` (variant conforme o status do pedido) e progresso de entrega via `app-progress`.
  5. Striped vs não-striped lado a lado — mesma base de dados, duas instâncias do componente com `striped` diferente.

### Modals

- Nenhum componente de modal existe hoje; este é o primeiro. Construído sobre `@angular/cdk/dialog` (já que `@angular/cdk` é dependência existente do projeto), não sobre `@angular/cdk/overlay` cru nem hand-rolled — usa `Dialog.open()`, `DialogRef` e o token `DIALOG_DATA`.
- `ModalShellComponent` (`src/app/shared/ui/modal/modal-shell/`): casca visual compartilhada usada internamente pelos três tipos de dialog abaixo — painel centralizado, header com título e botão de fechar (X), slot de conteúdo (`ng-content`) e slot de rodapé (`ng-content select="[footer]"`). Fechar por ESC e clique no backdrop vem do `@angular/cdk/dialog` (`DialogConfig` com `disableClose: false`, comportamento padrão).
- `ConfirmDialogComponent` (`src/app/shared/ui/modal/confirm-dialog/`): recebe via `DIALOG_DATA` `{ title: string, message: string, confirmLabel: string, cancelLabel: string, variant: 'danger' | 'primary' }`; usa `ModalShellComponent` internamente; ao confirmar/cancelar, chama `DialogRef.close(boolean)`. Reaproveitado tanto para "confirmar exclusão" (variant `danger`) quanto "confirmar ação" (variant `primary`) na página de showcase.
- `DetailModalComponent` (`src/app/shared/ui/modal/detail-modal/`): recebe via `DIALOG_DATA` `{ title: string, template: TemplateRef<unknown> }`; usa `ModalShellComponent` internamente e renderiza o `template` recebido via `NgTemplateOutlet`. Genérico e reutilizável por qualquer feature futura — não é específico deste showcase.
- Modal de formulário: componente específico do showcase (não genérico, já que campos de formulário variam por caso de uso) — `CustomerFormDialogComponent`, usando `ModalShellComponent` internamente e `ReactiveFormsModule` + `FormBuilder` (mesmo padrão de `login.component.ts`). Campos: nome (texto, obrigatório), e-mail (obrigatório, validador de e-mail), telefone (texto), categoria (select: Varejo/Atacado/Distribuidor), ativo (checkbox), botão Salvar (desabilitado se o form for inválido).
- Nova página `src/app/features/ui-elements/pages/modals-page/`, registrada em `uiElementsRoutes` como `modals` (breadcrumb "Modals") e em `nav-items.ts` dentro do grupo "UI Elements". A página abre cada dialog via `Dialog.open(...)` a partir de botões de exemplo.

### Nav scroll

- Estilização aplicada apenas ao elemento `<nav class="flex-1 overflow-y-auto ...">` dentro de `sidebar.component.html` (não afeta scroll de outras áreas da aplicação).
- CSS customizado (via classe utilitária em `styles.css` ou estilo local do componente): `::-webkit-scrollbar` (Chrome/Edge/Safari) + `scrollbar-width`/`scrollbar-color` (Firefox). Thumb branco translúcido (~15-20% opacidade), ~6px de largura, bordas arredondadas, **sempre visível** (não condicionado a hover).
- Como `--color-menu-bg` é fixo e escuro independente do toggle light/dark do app (só o conteúdo principal muda), o thumb translúcido branco funciona igual nos dois temas — não é necessária uma variante de cor por tema para este elemento específico.

## Decisões de teste

- O projeto não tem nenhum arquivo `.spec.ts` hoje em `shared/ui/` nem em `features/ui-elements/` (nem em `core/`) — não há convenção de teste unitário estabelecida para componentes presentational ou páginas de showcase. Esta feature não introduz testes novos, seguindo o padrão existente.
- Validação é manual, via `npm start`: navegar até `/ui-elements/tables` e `/ui-elements/modals`, testar cada variação de tabela, abrir cada um dos 4 modais (confirmar exclusão, confirmar ação, detalhes, formulário), alternar tema light/dark com um modal aberto e verificar a barra de scroll do nav visualmente nos dois temas.
- `npm run build` (ou `build:dev`/`build:prod`) deve compilar sem erros de tipo, dado que os novos inputs/outputs do `TableComponent` e os componentes de modal são fortemente tipados.

## Fora de escopo

- Testes automatizados (unitários ou e2e) para os componentes novos ou estendidos.
- Persistência real dos dados do formulário de cadastro de cliente (o botão Salvar apenas fecha o dialog retornando os valores do form — não há chamada HTTP).
- Filtragem/paginação server-side — a busca e a paginação do showcase operam sobre arrays mock em memória.
- Estilização do scrollbar em outras áreas da aplicação além do `<nav>` da sidebar (ex.: área de conteúdo principal, `overflow-x-auto` das tabelas).
- Migrar `DropdownComponent` ou outros overlays existentes para `@angular/cdk/dialog` — o CDK Dialog é introduzido apenas para os modais novos.

## Notas adicionais

- `@angular/cdk/dialog` é um submódulo de `@angular/cdk`, já presente no `package.json` — não é necessário adicionar nova dependência.
- Este PRD nasceu de uma sessão `grill-me` conduzida diretamente na conversa (sem necessidade de nova rodada de perguntas para este PRD).
