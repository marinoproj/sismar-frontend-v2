Status: done

# 04 — Nav scroll

## Issue pai

`docs/planning/ui-elements-tables-modals-nav/PRD.md`

## O que construir

Estilizar a barra de scroll do `<nav>` da sidebar (`sidebar.component.html`) com um visual customizado, fino e moderno, no lugar do scrollbar padrão do navegador.

Comportamento de ponta a ponta esperado:

- Thumb branco translúcido (~15-20% de opacidade), ~6px de largura, bordas arredondadas, sempre visível (não condicionado a hover).
- Suporte via `::-webkit-scrollbar` (Chrome/Edge/Safari) e `scrollbar-width`/`scrollbar-color` (Firefox).
- Aplicado apenas ao elemento de scroll do `<nav>` da sidebar — nenhuma outra área com scroll da aplicação (conteúdo principal, tabelas com `overflow-x-auto`, etc.) é afetada.
- Como o fundo da sidebar (`--color-menu-bg`) é fixo e escuro independente do tema light/dark ativo, o mesmo estilo de thumb funciona sem necessidade de variante por tema.

## Critérios de aceite

- [x] A barra de scroll do `<nav>` da sidebar tem o visual customizado (fino, arredondado, translúcido) em vez do padrão do navegador, em pelo menos Chromium (via `::-webkit-scrollbar`).
- [x] Firefox recebe o estilo equivalente via `scrollbar-width`/`scrollbar-color`.
- [x] Nenhuma outra área com scroll da aplicação (conteúdo principal, `overflow-x-auto` de tabelas, etc.) é afetada por esta mudança.
- [x] O visual do scrollbar permanece legível e consistente alternando entre os temas light e dark do app.

## Bloqueado por

Nenhum — pode começar imediatamente.

## Comments

Implementado como estilo `:host`-escopado em `sidebar.component.ts` (não CSS global), aplicado só ao `<nav>` do componente. Validado em navegador real: `nav.scrollHeight` (1154px) maior que `nav.clientHeight` (836px) confirma overflow real com muitos grupos expandidos; visual confirmado nos dois temas (o fundo do menu não muda com o toggle light/dark do app, então o thumb translúcido branco funciona igual nos dois).
