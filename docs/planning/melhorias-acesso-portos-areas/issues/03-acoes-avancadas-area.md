Status: done

# Issue 03 — Ações avançadas de Área (Editar/Ativar/Inativar/Job retroativo/Excluir via dropdown)

## Issue pai

`docs/planning/melhorias-acesso-portos-areas/PRD.md`

## O que construir

Na tela de configuração de Áreas, a coluna de ações da tabela passa a usar o modo dropdown introduzido na issue 02 (`actionsMode: 'dropdown'`), com os seguintes itens por linha:

- **Editar** (renomeado de "Atualizar") — sempre habilitado, atrás de `CONFIGURACAO_AREA_EDITAR`, comportamento igual ao atual.
- **Ativar** — habilitado apenas quando a área está inativa, atrás de `CONFIGURACAO_AREA_EDITAR`, comportamento igual ao atual (só muda de botão sempre-visível para item desabilitado quando não aplicável).
- **Inativar** (novo) — habilitado apenas quando a área está ativa, atrás de `CONFIGURACAO_AREA_EDITAR`. Abre um modal de confirmação (`ConfirmDialogComponent`) antes de chamar `POST /area/{id}/deactivate`. Sucesso exibe toast e recarrega a lista; erro da API (ex.: job retroativo em andamento) é exibido pelo interceptor global, sem tratamento adicional.
- **Job retroativo** — sem mudança de comportamento, sempre habilitado atrás de `CONFIGURACAO_AREA_EDITAR`.
- **Excluir** (novo) — habilitado apenas quando a área está inativa, atrás de uma feature própria `CONFIGURACAO_AREA_EXCLUIR` (nova, seguindo o mesmo precedente de `CONFIGURACAO_PORTO_EXCLUIR`). Abre um modal de confirmação com `variant: 'danger'` antes de chamar `DELETE /area/{id}`. Sucesso exibe toast e remove a linha da lista (via recarregamento); erro da API (ex.: 409 por vínculo com `PortConfig`/`Berth`, ou job em andamento) é exibido pelo interceptor global.

`AreaService`/`AreaRepository` ganham os métodos `deactivate(id)` e `delete(id)`, seguindo o mesmo padrão já usado por `activate(id)` (recarregam a lista após sucesso).

## Critérios de aceite

- [ ] A coluna de ações da tabela de Áreas usa o dropdown (não mais botões inline).
- [ ] O item antes chamado "Atualizar" agora se chama "Editar", com o mesmo comportamento.
- [ ] "Ativar" aparece desabilitado quando a área já está ativa (em vez de oculto).
- [ ] "Inativar" aparece habilitado só quando a área está ativa; confirma via modal antes de chamar `POST /area/{id}/deactivate`; mostra toast de sucesso e recarrega a lista.
- [ ] "Excluir" aparece habilitado só quando a área está inativa; confirma via modal de perigo antes de chamar `DELETE /area/{id}`; mostra toast de sucesso e recarrega a lista.
- [ ] "Excluir" fica desabilitado/oculto para usuários sem a feature `CONFIGURACAO_AREA_EXCLUIR`.
- [ ] Erros de API em Inativar/Excluir aparecem como toast (via interceptor global), sem toast duplicado.
- [ ] Testes cobrindo: item desabilitado conforme estado da linha/feature; confirmação real via CDK Dialog antes de disparar a chamada; recarregamento da lista após sucesso.

## Bloqueado por

- Issue 02 (`TableComponent`: suporte a coluna de ações em dropdown)
