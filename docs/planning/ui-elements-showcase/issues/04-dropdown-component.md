Status: done

## Issue pai

[PRD — Menu UI Elements: Biblioteca de Componentes Reutilizáveis](../PRD.md)

## O que construir

Criar o `DropdownComponent` em `shared/ui/dropdown/` e a página `DropdownsPageComponent` em `/ui-elements/dropdowns`.

**DropdownComponent**: `@Input()` `label: string` (texto do botão de trigger), `items: DropdownItem[]` onde `DropdownItem = { label: string; icon?: string; action: () => void; disabled?: boolean }`. Toggle de visibilidade via clique no botão trigger; fecha ao clicar fora via `@HostListener('document:click', ['$event'])`. Lista de itens renderizada como menu flutuante abaixo do trigger.

**DropdownsPage**: 3–4 exemplos:
1. Dropdown simples com ações textuais.
2. Dropdown com ícones nos itens.
3. Dropdown com item desabilitado.
4. Dropdown com trigger de ícone (sem label textual).

## Critérios de aceite

- [ ] `DropdownComponent` e interface `DropdownItem` criados em `shared/ui/dropdown/`.
- [ ] Dropdown abre ao clicar no trigger.
- [ ] Dropdown fecha ao clicar fora do componente (`@HostListener` no document).
- [ ] Dropdown fecha ao selecionar um item (executa `action()` e fecha).
- [ ] Item com `disabled: true` não executa `action()` e tem estilo de desabilitado.
- [ ] `DropdownsPageComponent` acessível em `/ui-elements/dropdowns` com 3–4 exemplos.
- [ ] Breadcrumb exibe "UI Elements > Dropdowns".
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [ui-elements-showcase/01 — Routes + Alert + Badge](01-ui-elements-routes-e-alert-badge.md)
