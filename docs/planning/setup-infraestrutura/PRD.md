Status: done

# PRD — Setup e Infraestrutura do Projeto Base Angular

## Declaração do problema

Todo novo sistema construído para um cliente (AIS, Meteorologia, etc.) começa do zero: configuração do Angular CLI, tooling de qualidade de código, framework CSS e framework de testes precisam ser configurados manualmente a cada projeto. Isso gera inconsistência entre projetos, retrabalho e tempo perdido antes de escrever a primeira linha de negócio.

## Solução

Um projeto base Angular 19 pré-configurado com todas as ferramentas essenciais prontas: pnpm como gerenciador de pacotes, Tailwind CSS para estilização, ESLint + Prettier para qualidade de código e Jest como runner de testes. Ao clonar o repositório, o dev executa `pnpm install` e já tem um ambiente funcional, padronizado e pronto para desenvolvimento.

## User stories

1. Como desenvolvedor, quero clonar o projeto base e executar `pnpm install` sem erros, para que possa começar a desenvolver imediatamente.
2. Como desenvolvedor, quero executar `pnpm build` e obter um bundle de produção sem warnings, para que o projeto esteja pronto para deploy desde o início.
3. Como desenvolvedor, quero executar `pnpm test` e ver todos os testes de exemplo passando, para que eu saiba que o ambiente de testes está funcionando corretamente.
4. Como desenvolvedor, quero executar `pnpm lint` e obter zero erros ou warnings, para que o padrão de código esteja garantido desde o primeiro commit.
5. Como desenvolvedor, quero que o Tailwind CSS esteja disponível globalmente, para que eu possa usar classes utilitárias em qualquer componente sem configuração adicional.
6. Como desenvolvedor, quero que o Prettier formate automaticamente os arquivos ao salvar, para que o estilo de código seja consistente sem esforço manual.
7. Como desenvolvedor, quero que o ESLint detecte erros específicos do Angular (uso incorreto de Signals, componentes sem `standalone: true`), para que más práticas sejam detectadas em tempo de desenvolvimento.
8. Como desenvolvedor, quero que o Jest execute testes em menos tempo do que o Karma, para que o ciclo de feedback seja mais rápido.
9. Como desenvolvedor, quero encontrar um arquivo `.editorconfig` configurado, para que o editor respeite indent, charset e line ending sem configuração manual.
10. Como tech lead, quero que a estrutura de pastas do projeto já esteja criada (`core/`, `shared/`, `features/`, `layout/`), para que o time saiba onde colocar cada tipo de código desde o início.

## Decisões de implementação

- **Gerenciador de pacotes**: pnpm. Scripts do `package.json` usam `pnpm` como padrão. O arquivo `pnpm-workspace.yaml` não é necessário (projeto único).
- **Angular**: versão 19, criado via Angular CLI com `--standalone` e sem `--ssr`. Todos os componentes usam `standalone: true` por padrão.
- **Tailwind CSS**: versão 4 integrada via `@tailwindcss/vite` (Angular 19 usa Vite por padrão). Dark mode configurado via estratégia `class` (a classe `dark` no elemento `<html>` ativa o modo escuro).
- **ESLint**: `@angular-eslint/eslint-plugin` + `@typescript-eslint`. Configuração via `eslint.config.mjs` (formato flat config do ESLint v9+).
- **Prettier**: arquivo `.prettierrc` na raiz. Integração com ESLint via `eslint-config-prettier` para evitar conflitos de regras.
- **Jest**: substitui Karma/Jasmine. Usa `jest-preset-angular` com `ts-jest`. Configuração em `jest.config.ts`. Scripts: `pnpm test` (watch), `pnpm test:ci` (single run).
- **Estrutura de pastas**: diretórios `core/`, `shared/`, `features/`, `layout/` criados dentro de `src/app/` com arquivos `.gitkeep` para preservar a estrutura no git.
- **Scripts do `package.json`**: `start`, `build`, `test`, `test:ci`, `lint`, `lint:fix`, `format`.

## Decisões de teste

- Um bom teste verifica comportamento observável (o que o componente exibe, o que o serviço retorna), não detalhes de implementação (nomes de métodos privados, estrutura interna).
- O projeto base inclui um teste de exemplo por camada: `app.component.spec.ts` verifica que o componente raiz renderiza sem erro.
- Testes são unitários com Jest; integração com o DOM usa `TestBed` + `ComponentFixture`.

## Fora de escopo

- Configuração de CI/CD (GitHub Actions, GitLab CI, etc.)
- Docker ou containerização
- Configuração de ambientes múltiplos (`environment.prod.ts`, etc.) — isso é responsabilidade de cada projeto derivado
- Instalação de bibliotecas de negócio (ApexCharts, autenticação, etc.) — coberto em PRDs específicos

## Notas adicionais

- Angular 19 usa Vite como bundler por padrão, o que simplifica a integração com Tailwind CSS v4.
- O projeto base não tem nenhuma lógica de negócio; é apenas o esqueleto configurado.
