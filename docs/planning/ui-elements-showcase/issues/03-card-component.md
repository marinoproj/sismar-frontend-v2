Status: done

## Issue pai

[PRD — Menu UI Elements: Biblioteca de Componentes Reutilizáveis](../PRD.md)

## O que construir

Criar o `CardComponent` em `shared/ui/card/` e a página `CardsPageComponent` em `/ui-elements/cards`.

**CardComponent**: usa `ng-content` com seletores nomeados para três slots: `[card-header]`, `[card-body]` e `[card-footer]`. Wrapper com borda, sombra leve e bordas arredondadas (Tailwind). Cada slot é opcional — o card funciona com qualquer combinação.

**CardsPage**: exibe 4–5 variações de cards:
1. Card somente com body.
2. Card com header + body.
3. Card com header + body + footer.
4. Card com header colorido (classe customizada por quem usa).
5. Card com imagem no header e conteúdo no body.

## Critérios de aceite

- [ ] `CardComponent` criado em `shared/ui/card/`.
- [ ] Slot `[card-header]` renderiza conteúdo acima do body com separador visual.
- [ ] Slot `[card-body]` renderiza conteúdo central com padding adequado.
- [ ] Slot `[card-footer]` renderiza conteúdo abaixo do body com separador visual.
- [ ] Slots opcionais: card sem header ou sem footer renderiza corretamente sem espaços em branco.
- [ ] `CardsPageComponent` acessível em `/ui-elements/cards` com 4–5 exemplos distintos.
- [ ] Breadcrumb exibe "UI Elements > Cards".
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [ui-elements-showcase/01 — Routes + Alert + Badge](01-ui-elements-routes-e-alert-badge.md)
