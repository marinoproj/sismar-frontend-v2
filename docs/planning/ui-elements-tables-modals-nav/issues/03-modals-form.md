Status: done

# 03 — Modals: form

## Issue pai

`docs/planning/ui-elements-tables-modals-nav/PRD.md`

## O que construir

Adicionar um modal de formulário de cadastro de cliente à página "Modals" criada na issue 02, reutilizando o `ModalShellComponent` já existente.

Comportamento de ponta a ponta esperado:

- `CustomerFormDialogComponent`: dialog específico deste showcase (não genérico), usando `ModalShellComponent` internamente e `ReactiveFormsModule` + `FormBuilder` (mesmo padrão usado em `login.component.ts`). Campos: nome (texto, obrigatório), e-mail (obrigatório, validador de e-mail), telefone (texto), categoria (select com opções Varejo/Atacado/Distribuidor), ativo (checkbox). Botão "Salvar" fica desabilitado enquanto o formulário for inválido; ao salvar, fecha o dialog retornando os valores do formulário (sem chamada HTTP — não há persistência real).
- A página "Modals" ganha um quarto botão de exemplo que abre este dialog.
- O dialog fecha por ESC, clique no backdrop ou botão de fechar, assim como os dialogs da issue 02.

## Critérios de aceite

- [x] `CustomerFormDialogComponent` reutiliza `ModalShellComponent` para o painel/header/backdrop.
- [x] O formulário tem os 6 campos descritos (nome, e-mail, telefone, categoria, ativo, botão Salvar) com validação reativa.
- [x] O botão Salvar fica desabilitado enquanto o formulário estiver inválido (nome ou e-mail vazios, e-mail com formato inválido).
- [x] Ao salvar com dados válidos, o dialog fecha e os valores do formulário ficam disponíveis para quem chamou `Dialog.open()`.
- [x] `/ui-elements/modals` tem um quarto botão de exemplo que abre este dialog.
- [x] O dialog fecha por ESC, clique no backdrop e botão de fechar.
- [x] `npm run build` compila sem erros de tipo.

## Bloqueado por

- `docs/planning/ui-elements-tables-modals-nav/issues/02-modals-confirm-e-detail.md` (depende do `ModalShellComponent` e da página Modals criados ali)

## Comments

Implementado e validado em navegador real: botão Salvar fica desabilitado até nome e e-mail válidos serem preenchidos, habilita corretamente depois, e ao salvar fecha o dialog disparando o toast de sucesso via `ToastService`. Beneficiou-se diretamente dos dois fixes de `viewContainerRef`/centralização aplicados na issue 02 (mesmo `Dialog.open()`).
