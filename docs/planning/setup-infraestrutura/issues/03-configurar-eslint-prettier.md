Status: done

# 03 — Configurar ESLint + Prettier + .editorconfig

## O que construir

Instalar e configurar ESLint v9 com flat config (`eslint.config.mjs`) usando `@angular-eslint` para regras específicas do Angular e `@typescript-eslint` para TypeScript. Integrar Prettier via `eslint-config-prettier` para evitar conflitos entre as duas ferramentas. Criar `.prettierrc` com configuração padrão e `.editorconfig` cobrindo indent, charset e line endings.

## Critérios de aceite

- [ ] `pnpm lint` executa sem erros no projeto recém-criado
- [ ] `pnpm lint:fix` corrige automaticamente problemas auto-fixáveis
- [ ] `pnpm format` formata todos os arquivos TypeScript, HTML e CSS com Prettier
- [ ] ESLint detecta uso de `NgModule` e alerta (regra `@angular-eslint/prefer-standalone`)
- [ ] `.editorconfig` define: `indent_style = space`, `indent_size = 2`, `charset = utf-8`, `end_of_line = lf`
- [ ] `.prettierrc` define: `singleQuote: true`, `semi: true`, `printWidth: 100`, `tabWidth: 2`

## Bloqueado por

- [01 — Criar projeto Angular 19](./01-criar-projeto-angular-19.md)
