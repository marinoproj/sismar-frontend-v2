Status: done

## Issue pai

[PRD — Infraestrutura de UI](../PRD.md)

## O que construir

Estender o `TableComponent` existente em `shared/ui/table/` com suporte a uma coluna de ações dinâmicas, sem quebrar nenhum consumidor atual da tabela.

Nova interface `TableAction<T>`: `{ label: string; icon?: string; variant?: 'default' | 'danger' | 'warning' | 'primary'; action: (row: T) => void; disabled?: (row: T) => boolean; visible?: (row: T) => boolean }`.

`TableComponent` ganha `@Input() actions: TableAction[] = []`. Quando `actions.length > 0`, a tabela acrescenta automaticamente uma coluna "Ações" no final. Cada linha renderiza os botões das actions onde `visible(row) !== false`, desabilitados quando `disabled(row) === true`.

O resultado observável: qualquer consumidor que passe `[actions]="[{ label: 'Deletar', icon: 'ri-delete-bin-line', variant: 'danger', action: row => delete(row) }]"` vê a coluna de ações aparecer automaticamente na tabela, sem precisar definir um `ColumnDef` com `template`.

## Critérios de aceite

- [ ] Interface `TableAction` criada em `shared/models/table-action.model.ts` e exportada.
- [ ] `TableComponent` tem novo `@Input() actions: TableAction[] = []`.
- [ ] Quando `actions` é vazio (default), nenhuma coluna extra é renderizada (backwards compatible).
- [ ] Quando `actions` tem itens, coluna "Ações" aparece no final da tabela com alinhamento centralizado.
- [ ] Cada botão de ação exibe `icon` (se fornecido) e/ou `label`.
- [ ] `variant` aplica estilo de cor ao botão: default = cinza, primary = primária, danger = vermelho, warning = amarelo.
- [ ] `disabled(row)` retornando `true` desabilita o botão da linha correspondente.
- [ ] `visible(row)` retornando `false` oculta o botão da linha correspondente.
- [ ] `action(row)` é chamado ao clicar no botão (quando não desabilitado).
- [ ] Coluna de ações aparece no skeleton de loading junto com as outras colunas.
- [ ] Consumidores existentes do `TableComponent` sem `[actions]` continuam funcionando sem alteração.

## Bloqueado por

Nenhum — pode começar imediatamente (paralelo às outras issues de infraestrutura).
