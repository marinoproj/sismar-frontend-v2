Status: done

# 02 — Modals: confirm + detail

## Issue pai

`docs/planning/ui-elements-tables-modals-nav/PRD.md`

## O que construir

Introduzir o primeiro conjunto de componentes de modal do projeto, construídos sobre `@angular/cdk/dialog`, e criar a página "Modals" em `ui-elements/` com exemplos de confirmação (exclusão e ação genérica) e detalhes.

Comportamento de ponta a ponta esperado:

- `ModalShellComponent`: casca visual compartilhada (painel centralizado, backdrop, header com título e botão de fechar, slot de conteúdo, slot de rodapé), usada internamente pelos dialogs abaixo. Fecha por ESC, clique no backdrop ou no botão de fechar.
- `ConfirmDialogComponent`: recebe via `DIALOG_DATA` título, mensagem, labels dos botões e uma variante (`danger` para ações destrutivas, `primary` para ações genéricas); ao confirmar ou cancelar, fecha o dialog retornando um booleano. Um único componente cobre tanto o caso de "confirmar exclusão" quanto "confirmar ação".
- `DetailModalComponent`: recebe via `DIALOG_DATA` um título e um `TemplateRef`, renderizando esse template dentro da casca do modal. É genérico — não conhece o conteúdo específico que está sendo exibido, permitindo que qualquer feature futura o reutilize passando seu próprio template.
- Nova página acessível em `/ui-elements/modals`, com breadcrumb "Modals" e entrada no menu lateral dentro do grupo "UI Elements", com pelo menos três botões de exemplo:
  1. Abre `ConfirmDialogComponent` configurado como confirmação de exclusão (variant `danger`).
  2. Abre `ConfirmDialogComponent` configurado como confirmação de ação genérica (variant `primary`).
  3. Abre `DetailModalComponent` passando um template com KPI cards (`app-kpi-card`) e uma tabela (`app-table`) mostrando os itens de um pedido mock.
- Os modais herdam o tema light/dark ativo no momento em que são abertos (não ficam presos a um tema fixo).

## Critérios de aceite

- [x] `ModalShellComponent` existe e é reutilizado pelos dois dialogs desta issue (e, futuramente, pelo dialog de formulário da issue 03).
- [x] `ConfirmDialogComponent` abre via `Dialog.open()`, exibe título/mensagem/variant conforme os dados passados, e retorna `true`/`false` ao `DialogRef` conforme o botão clicado.
- [x] `DetailModalComponent` abre via `Dialog.open()` e renderiza corretamente um `TemplateRef` arbitrário passado via `DIALOG_DATA`.
- [x] Todo modal desta issue fecha ao pressionar ESC, ao clicar fora do painel (backdrop) e ao clicar no botão de fechar.
- [x] `/ui-elements/modals` está acessível pelo menu lateral (grupo "UI Elements") e tem os 3 botões de exemplo descritos acima, cada um abrindo o modal correspondente.
- [x] O modal de detalhes exibe corretamente KPI cards e uma tabela com itens de um pedido mock dentro do template projetado.
- [x] Alternar o tema light/dark com um modal aberto não quebra a aparência do modal.
- [x] `npm run build` compila sem erros de tipo.

## Bloqueado por

Nenhum — pode começar imediatamente.

## Comments

Dois bugs reais foram encontrados e corrigidos durante a validação em navegador real (não previstos no plano original):

1. **Conteúdo do dialog não renderizava (título/mensagem/labels vazios).** Causa raiz: `Dialog.open()` sem `viewContainerRef` cria o componente fora da árvore de change detection da aplicação (`@angular/cdk/portal` não chama `ApplicationRef.attachView()` internamente), então o zone.js nunca disparava CD para o conteúdo do modal. Corrigido injetando `ViewContainerRef` em `ModalsPageComponent` e passando `viewContainerRef: this.viewContainerRef` em todo `dialog.open(...)`.
2. **Modal não centralizava (aparecia colado no canto superior esquerdo).** Causa raiz: o `GlobalPositionStrategy` do CDK aplica a centralização via `afterNextRender()`, que não disparou de forma confiável neste app. Corrigido com um fallback CSS global em `src/styles.css` (`.cdk-global-overlay-wrapper { justify-content: center; align-items: center; }`), que força a centralização independente do JS da position strategy.

Ambos validados via Playwright contra o dev server real: título/mensagem renderizam corretamente, painel centralizado (confirmado via `getBoundingClientRect`), fechamento por ESC e clique no backdrop funcionando.

Nota à parte (não corrigida, fora de escopo): `BreadcrumbComponent` lança `TypeError: Cannot read properties of undefined (reading 'url')` no console em toda navegação — confirmado como bug pré-existente, reproduzível também em `/ui-elements/badges` (página não tocada por este trabalho).
