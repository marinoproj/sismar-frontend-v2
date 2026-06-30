Status: done

## Issue pai

[PRD — Infraestrutura de UI](../PRD.md)

## O que construir

Estender o modelo de navegação lateral para suportar grupos com cabeçalhos visuais. Hoje `navItems` é um array plano de `NavItem[]`. Esta fatia troca para `NavSection[]` (cada seção tem `group: string` e `items: NavItem[]`) e atualiza o `SidebarComponent` para renderizar um label de seção antes de cada grupo de itens.

O resultado observável: o menu lateral exibe cabeçalhos "MAIN" e "SISTEMA" separando os itens. Todos os itens existentes continuam funcionando. Quando a sidebar está colapsada, os cabeçalhos são ocultados.

A configuração inicial do `navItems` deve incluir todos os itens do novo menu planejado (Dashboards com filhos Vendas/Ações, Charts com 5 filhos, UI Elements com 9 filhos, Maps) apontando para suas rotas definitivas — mesmo que essas rotas ainda sejam stubs. Isso permite que as issues subsequentes apenas criem as páginas sem tocar no menu.

## Critérios de aceite

- [ ] Interface `NavSection` criada com campos `group: string` e `items: NavItem[]`.
- [ ] `nav-items.ts` exporta `navSections: NavSection[]` com grupos MAIN e SISTEMA.
- [ ] Grupo MAIN contém: Dashboards (com filhos Vendas `/dashboard/vendas` e Ações `/dashboard/acoes`), Charts (com 5 filhos), UI Elements (com 9 filhos), Maps `/maps`.
- [ ] Grupo SISTEMA contém: Configurações `/settings`.
- [ ] `SidebarComponent` itera sobre `navSections` e renderiza um `<span>` de cabeçalho de seção antes de cada grupo de itens (visível apenas quando sidebar expandida).
- [ ] Comportamento de collapse/expand dos submenus continua funcionando.
- [ ] Sidebar colapsada oculta os cabeçalhos e exibe apenas ícones, sem quebrar o layout.
- [ ] `routerLinkActive` e `routerLinkActiveOptions` funcionam corretamente nos itens existentes após a mudança.

## Bloqueado por

Nenhum — pode começar imediatamente.
