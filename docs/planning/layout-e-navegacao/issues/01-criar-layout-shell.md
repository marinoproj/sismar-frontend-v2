Status: done

# 01 — Criar layout shell com sidebar, header e área de conteúdo

## O que construir

Criar o `LayoutComponent` em `src/app/layout/` com a estrutura HTML do shell da aplicação: sidebar à esquerda, header fixo no topo e área de conteúdo com `<router-outlet>`. O layout deve usar CSS Grid ou Flexbox com Tailwind. As cores do sidebar e header devem ser aplicadas via classes Tailwind que usam as CSS custom properties definidas pelo `ThemeService`. Incluir os componentes `SidebarComponent` e `HeaderComponent` como filhos do `LayoutComponent`.

## Critérios de aceite

- [ ] `LayoutComponent` renderiza sidebar + header + área de conteúdo sem overflow ou scroll indesejado
- [ ] `<router-outlet>` na área de conteúdo renderiza a rota ativa corretamente
- [ ] Sidebar usa a cor configurada em `ThemeConfig.menuColor` via CSS custom property
- [ ] Header usa a cor configurada em `ThemeConfig.headerColor` via CSS custom property
- [ ] Header exibe o logo definido em `ThemeConfig.logoUrl`
- [ ] Estrutura é responsiva: sidebar e header ocupam as posições corretas em desktop (≥768px)

## Bloqueado por

- [setup-infraestrutura/issues/02](../../setup-infraestrutura/issues/02-configurar-tailwind-css.md)
- [sistema-de-tema/issues/03](../../sistema-de-tema/issues/03-aplicar-cores-como-css-custom-properties.md)
