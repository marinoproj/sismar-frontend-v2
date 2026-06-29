Status: done

# 01 — Criar projeto Angular 19 com pnpm e estrutura de pastas

## O que construir

Inicializar o projeto Angular 19 via Angular CLI usando pnpm como gerenciador de pacotes. O projeto deve usar Standalone Components por padrão (sem NgModules), sem SSR, e com a estrutura de pastas da arquitetura feature-based já criada: `core/`, `shared/`, `features/`, `layout/` dentro de `src/app/`, cada uma com subpastas conforme a arquitetura definida.

O `package.json` deve ter os scripts `start`, `build`, `test:ci`, `lint` e `format` configurados.

## Critérios de aceite

- [ ] `pnpm install` executa sem erros
- [ ] `pnpm start` inicia o dev server e exibe a página padrão do Angular no navegador
- [ ] `pnpm build` gera bundle em `dist/` sem erros ou warnings
- [ ] Estrutura de pastas `src/app/core/`, `src/app/shared/`, `src/app/features/`, `src/app/layout/` existe no repositório com `.gitkeep` em cada subpasta
- [ ] `AppComponent` é `standalone: true` e não usa NgModules
- [ ] Arquivo `README.md` mínimo descreve como rodar o projeto

## Bloqueado por

Nenhum — pode começar imediatamente.
