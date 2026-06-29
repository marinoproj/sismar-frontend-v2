Status: done

# 02 — Implementar ThemeService com toggle dark/light e persistência

## O que construir

Criar `ThemeService` em `src/app/core/services/` que gerencia o modo de cor atual (claro/escuro) via Signal. O serviço deve ler a preferência salva no `localStorage` na inicialização, aplicar a classe `dark` no `document.documentElement` conforme o modo ativo e persistir a preferência ao alternar. O `APP_INITIALIZER` em `app.config.ts` deve chamar o serviço antes do primeiro render para evitar flash de tema incorreto.

## Critérios de aceite

- [ ] `ThemeService` tem Signal `currentMode: Signal<'light' | 'dark'>` com valor inicial lido do `localStorage`
- [ ] `toggleMode()` alterna o Signal e adiciona/remove a classe `dark` no `document.documentElement`
- [ ] Preferência é salva no `localStorage` após cada alternância
- [ ] `APP_INITIALIZER` aplica o tema salvo antes do primeiro render (sem flash visual)
- [ ] Ao abrir o sistema pela primeira vez (sem `localStorage`), o modo padrão vem de `ThemeConfig.defaultMode`
- [ ] Teste unitário verifica: toggle adiciona classe `dark`; toggle novamente remove; `localStorage` é atualizado

## Bloqueado por

- [01 — Criar ThemeConfig e token DI](./01-criar-theme-config-e-token-di.md)
