Status: done

# Issue 02 — `TableComponent`: suporte a coluna de ações em dropdown

## Issue pai

`docs/planning/melhorias-acesso-portos-areas/PRD.md`

## O que construir

O `TableComponent` compartilhado (catálogo `shared/ui/table/`), que hoje só sabe renderizar `actions` como uma lista de botões lado a lado, ganha um segundo modo de renderização: uma coluna de ações em dropdown (menu suspenso), reaproveitando o `DropdownComponent` já existente (`DropdownItem { label, icon?, action, disabled? }`).

O modo é controlado por um novo input (ex.: `actionsMode: 'inline' | 'dropdown'`), com `'inline'` como padrão — todas as telas que já usam `actions` hoje devem continuar funcionando exatamente como antes, sem precisar de nenhuma mudança nelas. Cada `TableAction` já existente (`label`, `icon`, `variant`, `visible`, `action`) deve mapear naturalmente para um `DropdownItem` por linha quando `actionsMode` for `'dropdown'`: ações com `visible(row)` retornando `false` aparecem como item desabilitado no menu (não somem), e a variante `'danger'`, se presente numa ação, reflete visualmente no item do dropdown.

Esta fatia é só a infraestrutura compartilhada — nenhuma tela precisa migrar para o modo dropdown nesta issue (a tela de Áreas migra na issue seguinte).

## Critérios de aceite

- [ ] `TableComponent` aceita um input `actionsMode` com valores `'inline'` (padrão) e `'dropdown'`.
- [ ] Com `actionsMode` ausente ou `'inline'`, o comportamento e a renderização são idênticos aos atuais (nenhuma regressão nas telas existentes que usam `actions`).
- [ ] Com `actionsMode: 'dropdown'`, cada linha renderiza um único `app-dropdown` contendo um item por `TableAction`.
- [ ] Uma `TableAction` cuja `visible(row)` retorna `false` aparece no dropdown como item desabilitado (não é omitida da lista).
- [ ] Clicar num item do dropdown dispara a `action(row)` correspondente, igual ao clique no botão inline hoje.
- [ ] Teste automatizado cobrindo ambos os modos (`'inline'` sem regressão, `'dropdown'` com itens habilitados/desabilitados corretos).

## Bloqueado por

Nenhum — pode começar imediatamente.
