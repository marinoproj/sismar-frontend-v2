Status: done

# 04 — Responsividade mobile: sidebar como drawer com overlay

## O que construir

Integrar o `BreakpointObserver` do Angular CDK ao `LayoutService` para detectar automaticamente quando a tela está abaixo de 768px e ativar o modo mobile. Em modo mobile, o sidebar desaparece e só aparece como drawer deslizante ao clicar no hamburguer. Um overlay escuro semitransparente cobre o conteúdo quando o drawer está aberto; clicar no overlay fecha o drawer.

## Critérios de aceite

- [ ] Em telas < 768px, sidebar é oculto por padrão (não ocupa espaço no layout)
- [ ] Clicar no botão hamburguer abre o sidebar como drawer deslizante da esquerda
- [ ] Overlay escuro semitransparente aparece sobre o conteúdo quando o drawer está aberto
- [ ] Clicar no overlay fecha o drawer
- [ ] Clicar em um item de menu fecha o drawer automaticamente
- [ ] Em telas ≥ 768px, o estado mobile é ignorado e o estado desktop (localStorage) é restaurado
- [ ] Transição de abertura/fechamento do drawer é animada (slide in/out)
- [ ] `@angular/cdk` instalado e `BreakpointObserver` integrado ao `LayoutService`

## Bloqueado por

- [02 — Implementar sidebar 3 estados](./02-implementar-sidebar-3-estados.md)
- [03 — Implementar header](./03-implementar-header.md)
