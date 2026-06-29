Status: done

# 04 — Substituir Karma por Jest

## O que construir

Remover Karma e Jasmine do projeto e configurar Jest com `jest-preset-angular` como runner de testes. A configuração deve suportar testes de componentes Angular com `TestBed`, testes de serviços e testes unitários puros. Incluir um teste de exemplo por tipo de artefato para servir de referência ao dev.

## Critérios de aceite

- [ ] Karma e Jasmine removidos das dependências (`@angular/core` jest não conflita)
- [ ] `pnpm test` executa Jest em modo watch
- [ ] `pnpm test:ci` executa Jest em modo single-run (para pipelines CI)
- [ ] Teste de exemplo `app.component.spec.ts` verifica que o componente raiz renderiza — passa com `pnpm test:ci`
- [ ] `jest.config.ts` na raiz configura `jest-preset-angular` e aponta para `tsconfig.spec.json`
- [ ] Coverage report gerado em `coverage/` ao executar `pnpm test:ci --coverage`

## Bloqueado por

- [01 — Criar projeto Angular 19](./01-criar-projeto-angular-19.md)
