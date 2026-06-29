Status: done

# 02 — Configurar Tailwind CSS v4

## O que construir

Instalar e configurar Tailwind CSS v4 no projeto Angular 19 usando a integração via `@tailwindcss/vite`. O dark mode deve ser configurado com a estratégia `class`, ou seja, a presença da classe `dark` no elemento `<html>` ativa o modo escuro em todos os componentes. Remix Icons deve ser instalado via npm e seu CSS importado globalmente.

## Critérios de aceite

- [ ] Classes Tailwind (`bg-white`, `text-gray-900`, etc.) funcionam em qualquer componente sem importação adicional
- [ ] Classes de dark mode (`dark:bg-gray-900`, `dark:text-white`) são aplicadas quando a classe `dark` está no `<html>`
- [ ] `pnpm build` não gera erros relacionados ao Tailwind
- [ ] Remix Icons disponíveis via classe CSS (`ri-home-line`, `ri-settings-3-line`, etc.) em qualquer componente
- [ ] Arquivo de estilos globais (`styles.css`) está limpo e organizado com as diretivas Tailwind

## Bloqueado por

- [01 — Criar projeto Angular 19](./01-criar-projeto-angular-19.md)
