Status: done

# 03 — Implementar header com ações globais

## O que construir

Implementar o `HeaderComponent` completo com: botão de toggle do sidebar (hamburguer/seta), logo do sistema, campo de busca decorativo, botão de toggle dark/light mode (injeta `ThemeService`), ícone de notificações com badge de contagem e avatar do usuário com menu dropdown. O header deve ser responsivo e funcionar em desktop e mobile.

## Critérios de aceite

- [ ] Botão de toggle do sidebar chama `LayoutService.toggle()`
- [ ] Logo exibido vem de `ThemeConfig.logoUrl`
- [ ] Botão dark/light mode alterna o ícone (sol/lua) e chama `ThemeService.toggleMode()`
- [ ] Badge de notificações exibe número (valor mockado no projeto base)
- [ ] Avatar do usuário abre dropdown com opções "Perfil" e "Sair" (ações sem implementação no projeto base)
- [ ] Em mobile, logo aparece centralizado e campo de busca é ocultado
- [ ] Ícone de hamburguer aparece em mobile para abrir o drawer do sidebar

## Bloqueado por

- [01 — Criar layout shell](./01-criar-layout-shell.md)
- [02 — Implementar sidebar 3 estados](./02-implementar-sidebar-3-estados.md)
