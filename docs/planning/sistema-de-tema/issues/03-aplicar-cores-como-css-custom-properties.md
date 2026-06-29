Status: done

# 03 — Aplicar cores do ThemeConfig como CSS custom properties

## O que construir

Estender o `ThemeService` para aplicar as cores do `ThemeConfig` como variáveis CSS no `:root` (`--color-primary`, `--color-menu-bg`, `--color-header-bg`) durante a inicialização da aplicação. Configurar o Tailwind para usar essas variáveis CSS como tokens de cor, permitindo o uso de classes como `bg-primary`, `text-primary` em qualquer componente.

## Critérios de aceite

- [ ] Variáveis CSS `--color-primary`, `--color-menu-bg`, `--color-header-bg` presentes no `:root` ao inspecionar o DOM
- [ ] Valores das variáveis correspondem aos definidos no `themeConfig` padrão
- [ ] Tailwind configurado para mapear `bg-primary` → `var(--color-primary)` e equivalentes para menu e header
- [ ] Ao trocar o `primaryColor` no `theme.config.ts` e recompilar, a cor primária muda em toda a aplicação
- [ ] Classes `dark:bg-menu-bg` funcionam corretamente quando a classe `dark` está no `<html>`

## Bloqueado por

- [02 — Implementar ThemeService](./02-implementar-theme-service.md)
