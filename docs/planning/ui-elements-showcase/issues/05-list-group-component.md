Status: done

## Issue pai

[PRD — Menu UI Elements: Biblioteca de Componentes Reutilizáveis](../PRD.md)

## O que construir

Criar o `ListGroupComponent` em `shared/ui/list-group/` e a página `ListGroupPageComponent` em `/ui-elements/list-group`.

**ListGroupComponent**: `@Input()` `items: ListGroupItem[]` onde `ListGroupItem = { label: string; description?: string; badge?: string; badgeVariant?: string; active?: boolean; icon?: string }`. Renderiza lista vertical com separadores, item ativo destacado com cor primária.

**ListGroupPage**: 3 exemplos:
1. Lista simples de texto.
2. Lista com badges nos itens (ex: contagem de mensagens).
3. Lista com ícones e descrições secundárias, um item marcado como ativo.

## Critérios de aceite

- [ ] `ListGroupComponent` e interface `ListGroupItem` criados em `shared/ui/list-group/`.
- [ ] Item com `active: true` tem estilo de destaque (fundo com cor primária ou borda lateral).
- [ ] Item com `badge` exibe `BadgeComponent` à direita.
- [ ] Item com `icon` exibe ícone Remixicon à esquerda.
- [ ] Item com `description` exibe texto secundário menor abaixo do label.
- [ ] `ListGroupPageComponent` acessível em `/ui-elements/list-group` com 3 exemplos.
- [ ] Breadcrumb exibe "UI Elements > List group".
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [ui-elements-showcase/01 — Routes + Alert + Badge](01-ui-elements-routes-e-alert-badge.md) (BadgeComponent usado internamente pelo ListGroup)
