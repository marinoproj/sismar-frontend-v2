Status: done

# 04 — Terminais: Cadastro, edição e exclusão

## Issue pai

`docs/planning/configuracoes-portos-terminais-bercos/PRD.md`

## O que construir

Completar a página de Terminais (`settings/terminals`) com as ações de escrita: cadastrar, editar e excluir um terminal — cada ação condicionada à sua própria feature (`CONFIGURACAO_TERMINAL_ADICIONAR`, `CONFIGURACAO_TERMINAL_EDITAR`, `CONFIGURACAO_TERMINAL_EXCLUIR`).

Comportamento esperado de ponta a ponta:
- Usuário com `CONFIGURACAO_TERMINAL_ADICIONAR` vê um botão "Novo terminal"; ao clicar, abre um modal com os campos `name`, `code`, `terminalType` (texto livre), `portId` (select alimentado pelo service de Portos), `imageTerminal`/`latitude`/`longitude` (opcionais). Ao salvar, chama `POST /terminals`.
- Erro `404` da API (porto selecionado não existe mais) exibido via toast com a mensagem retornada.
- Usuário com `CONFIGURACAO_TERMINAL_EDITAR` vê a ação "Editar", com o modal pré-preenchido (incluindo o porto atual selecionado no dropdown), podendo trocar o porto ao salvar via `PUT /terminals/{id}`.
- Usuário com `CONFIGURACAO_TERMINAL_EXCLUIR` vê a ação "Excluir", com confirmação prévia (`ConfirmDialogComponent`) antes de `DELETE /terminals/{id}`; erros de exclusão (ex.: em uso) exibidos via toast.

## Critérios de aceite

- [ ] Botão "Novo terminal" visível apenas com `CONFIGURACAO_TERMINAL_ADICIONAR`.
- [ ] Modal de formulário com os campos do `TerminalDTO` descritos acima, incluindo select de porto, reaproveitado para criar e editar.
- [ ] Ação "Editar" visível apenas com `CONFIGURACAO_TERMINAL_EDITAR`, pré-preenchendo o modal (usando `TerminalDetailDTO` para obter os dados completos, incluindo o porto atual).
- [ ] Ação "Excluir" visível apenas com `CONFIGURACAO_TERMINAL_EXCLUIR`, usando `ConfirmDialogComponent` antes de chamar a API.
- [ ] Erros `400`/`404`/`409` exibidos via `ToastService` com a mensagem retornada pelo backend.
- [ ] Repository/service de Terminal (criados na issue 03) estendidos com métodos de criar/atualizar/excluir/detalhar.
- [ ] Spec do `*HttpRepository` cobrindo `POST`/`PUT`/`DELETE`/`GET` por id.
- [ ] Spec do `*Service` cobrindo o comportamento exposto, incluindo propagação de erro.

## Bloqueado por

- Issue 03 (Terminais: Listagem, busca e filtro por porto) — reaproveita rota, repository e service.
