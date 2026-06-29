Status: done

# 02 — Implementar sidebar com 3 estados via Signal e persistência

## O que construir

Criar o `LayoutService` com Signal `sidebarState` e implementar os 3 estados do sidebar: `expanded` (ícone + label), `collapsed` (apenas ícones com tooltip) e `mobile-open`/`mobile-closed` (drawer). O `SidebarComponent` deve reagir ao Signal e aplicar as classes CSS corretas para cada estado. O estado desktop (expanded/collapsed) deve persistir no `localStorage`.

O menu de navegação deve ser definido como array de `NavItem` em `src/app/layout/nav-items.ts` e renderizado dinamicamente, suportando itens com e sem filhos (submenus colapsáveis).

## Critérios de aceite

- [ ] Botão de toggle no header/sidebar alterna entre `expanded` e `collapsed` em desktop
- [ ] Estado `expanded`: sidebar com ~240px de largura, ícone Remix + label visíveis
- [ ] Estado `collapsed`: sidebar com ~64px de largura, apenas ícone; tooltip com o label ao hover
- [ ] Estado persiste no `localStorage`: ao recarregar, sidebar retorna ao último estado desktop
- [ ] Menu de exemplo inclui ao menos: "Dashboard" e "Configurações" como `NavItem`
- [ ] Item de menu ativo (rota atual) tem estilo visual destacado
- [ ] Submenus colapsam/expandem ao clicar no item pai
- [ ] Teste unitário de `LayoutService`: `toggle()` alterna entre `expanded` e `collapsed`; `localStorage` é atualizado

## Bloqueado por

- [01 — Criar layout shell](./01-criar-layout-shell.md)
