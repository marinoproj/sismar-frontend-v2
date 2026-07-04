Status: done

# 02 — Environment switching no vendas-wc

## Issue pai

`docs/planning/environment-config/PRD.md`

## O que construir

Estender o mesmo mecanismo de troca de ambiente da issue 01 para o projeto `vendas-wc` (web component), reaproveitando os arquivos de ambiente já criados naquela issue — sem duplicá-los, já que os dois projetos compartilham o mesmo `sourceRoot`.

Comportamento de ponta a ponta esperado:

- Gerar um build do `vendas-wc` na configuration de desenvolvimento usa o arquivo de ambiente de dev.
- Gerar um build do `vendas-wc` na configuration de produção usa o arquivo de ambiente de prod.
- O comando de build padrão do `vendas-wc` (`build:vendas-wc`, sem escolha explícita de configuration) continua se comportando exatamente como hoje — ou seja, deve continuar resolvendo para a configuration de produção.

Esta issue não cria um target de `serve` para o `vendas-wc` (o projeto não tem um hoje e isso está fora de escopo). O trabalho se limita ao target de `build`.

## Critérios de aceite

- [x] O projeto `vendas-wc` no `angular.json` ganha configurations de desenvolvimento e produção equivalentes às do `frontend-admin-template`, usando os mesmos arquivos de ambiente da issue 01.
- [x] Buildar o `vendas-wc` explicitamente na configuration de desenvolvimento embute o arquivo de ambiente de dev.
- [x] Buildar o `vendas-wc` explicitamente na configuration de produção embute o arquivo de ambiente de prod.
- [x] `npm run build:vendas-wc` continua funcionando sem mudança de comportamento em relação a hoje (resolve para produção por padrão).

## Bloqueado por

- `docs/planning/environment-config/issues/01-environment-switching-app-principal.md` (os arquivos de ambiente precisam existir antes de serem referenciados aqui)

## Comments

Implementado: `architect.build.configurations` (`production`/`development`) adicionado ao projeto `vendas-wc` no `angular.json`, com o mesmo `fileReplacements` da issue 01, mantendo `defaultConfiguration: "production"`. Validado com a mesma técnica de sonda temporária em `src/main-vendas-wc.ts`: build dev embutiu `localhost:3000`, build prod e o `npm run build:vendas-wc` padrão (sem `--configuration`) embutiram `api.SEUDOMINIO.com`. Sonda revertida; `git status` confirma `src/main-vendas-wc.ts` sem diff. `npm run build:vendas-wc` completo (incluindo `scripts/bundle-wc.js`) também foi executado e produziu `dist/vendas-wc/sismar-vendas.js` normalmente.
