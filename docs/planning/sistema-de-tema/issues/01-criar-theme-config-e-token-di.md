Status: done

# 01 — Criar interface ThemeConfig e token de injeção de dependência

## O que construir

Criar a interface TypeScript `ThemeConfig` com todos os campos de configuração visual do projeto (modo padrão, cores, logo, nome da aplicação). Criar o `InjectionToken<ThemeConfig>` e o objeto de configuração padrão. Registrar o token em `app.config.ts` para que seja injetável em qualquer componente ou serviço.

## Critérios de aceite

- [ ] Interface `ThemeConfig` definida em `src/app/core/config/theme.config.ts` com campos: `defaultMode`, `primaryColor`, `menuColor`, `headerColor`, `logoUrl`, `appName`
- [ ] `InjectionToken<ThemeConfig>` exportado do mesmo arquivo
- [ ] Objeto `themeConfig` padrão exportado com valores de exemplo (cor primária azul, modo claro, logo placeholder)
- [ ] Token provido em `app.config.ts` via `{ provide: THEME_CONFIG, useValue: themeConfig }`
- [ ] `inject(THEME_CONFIG)` em qualquer componente retorna os valores configurados
- [ ] Todos os campos têm JSDoc descrevendo o propósito e o formato esperado

## Bloqueado por

- [setup-infraestrutura/issues/01](../../setup-infraestrutura/issues/01-criar-projeto-angular-19.md)
