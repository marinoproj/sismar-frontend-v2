Status: done

# 01 — Tables showcase

## Issue pai

`docs/planning/ui-elements-tables-modals-nav/PRD.md`

## O que construir

Estender o `TableComponent` existente com dois novos inputs opcionais e criar a página "Tables" em `ui-elements/`, demonstrando o componente com dados mock de "Pedidos".

Comportamento de ponta a ponta esperado:

- `TableComponent` ganha `@Input striped` (default `true`): quando `false`, as linhas ficam com fundo uniforme/transparente em vez de alternar cor. O comportamento atual (sempre striped) permanece o padrão para qualquer uso já existente do componente no projeto.
- `TableComponent` ganha `@Input searchable` (default `false`) + `@Output searchChange`: quando `true`, renderiza um campo de busca acima da tabela; ao digitar, emite o termo via `searchChange`. O componente não filtra nada sozinho — quem usa o componente decide o que fazer com o termo emitido.
- Nova página acessível em `/ui-elements/tables`, com breadcrumb "Tables" e entrada no menu lateral dentro do grupo "UI Elements", contendo 5 tabelas de demonstração sobre um único array mock de pedidos (id, cliente, status, valor, progresso de entrega, data):
  1. Básica, sem paginação, sem striping.
  2. Com paginação (usando `totalItems`/`pageSize`/`currentPage`/`pageChange`).
  3. Com busca (usando `searchable`/`searchChange`, filtrando o array mock localmente na página).
  4. Com coluna de status renderizada como badge (`app-badge`, variant conforme o status) e coluna de progresso renderizada com `app-progress`, via `ColumnDef.template`.
  5. Duas tabelas lado a lado com os mesmos dados, uma `striped` e outra não, para comparação visual.

## Critérios de aceite

- [x] `TableComponent` aceita `@Input striped` (default `true`) e altera a classe de fundo das linhas conforme o valor.
- [x] `TableComponent` aceita `@Input searchable` (default `false`); quando `true`, exibe um campo de busca e emite `searchChange` a cada alteração do valor digitado.
- [x] Nenhuma tabela existente no projeto (dashboard de vendas/ações, etc.) muda de aparência ou comportamento após esta mudança.
- [x] `/ui-elements/tables` está acessível pelo menu lateral (grupo "UI Elements") e exibe as 5 tabelas descritas acima.
- [x] A tabela com busca filtra corretamente os pedidos mock ao digitar.
- [x] A tabela com paginação navega corretamente entre páginas dos pedidos mock.
- [x] A coluna de status exibe um `app-badge` com variant coerente por status; a coluna de progresso exibe um `app-progress` coerente com o valor do pedido.
- [x] A comparação striped/não-striped mostra visualmente a diferença entre as duas tabelas.
- [x] `npm run build` compila sem erros de tipo.

## Bloqueado por

Nenhum — pode começar imediatamente.

## Comments

Implementado e validado num navegador real (Playwright + dev server): busca filtra corretamente (ex.: "Ana" retorna 2 pedidos), paginação navega entre páginas, colunas customizadas renderizam `app-badge`/`app-progress` via `ColumnDef.template`, comparação striped/não-striped visível. `npm run build` (prod) e `build:vendas-wc` passam sem erros.
