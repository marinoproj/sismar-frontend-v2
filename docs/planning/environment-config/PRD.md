Status: done

# Configuração de ambiente (dev/prod)

## Declaração do problema

Ao rodar ou buildar a aplicação, o desenvolvedor não tem hoje uma forma de indicar se está trabalhando contra o ambiente de desenvolvimento ou o de produção. Valores que variam por ambiente — a começar pela URL base da API — estão fadados a ser hardcoded ou editados manualmente antes de cada build, o que é propenso a erro (ex.: subir para produção com a URL de dev).

## Solução

Dois arquivos de configuração de ambiente, um para dev e um para prod, escritos em TypeScript e trocados automaticamente pelo Angular CLI na hora do build/serve via `fileReplacements`, conforme a `configuration` escolhida (`development` ou `production`). O desenvolvedor escolhe o ambiente através de scripts npm explícitos (`start:dev`, `start:prod`, `build:dev`, `build:prod`), sem precisar lembrar de flags do Angular CLI.

Este é o mecanismo nativo do Angular CLI para este problema — não depende de variáveis de ambiente do sistema operacional nem de arquivos `.env`, que exigiriam tooling adicional não presente no projeto hoje.

## User stories

1. Como desenvolvedor, quero rodar `npm run start:dev`, para que o dev server suba usando a configuração de desenvolvimento (incluindo a `apiUrl` de dev).
2. Como desenvolvedor, quero rodar `npm run start:prod`, para que eu possa testar localmente o app servindo com a configuração de produção (incluindo a `apiUrl` de prod).
3. Como desenvolvedor preparando um deploy, quero rodar `npm run build:prod`, para que o bundle gerado contenha a `apiUrl` de produção embutida.
4. Como desenvolvedor testando um bundle de não-produção, quero rodar `npm run build:dev`, para que o bundle gerado contenha a `apiUrl` de desenvolvimento embutida.
5. Como desenvolvedor, quero manter `npm start` e `npm run build` funcionando como hoje (sem argumentos), para que scripts e hábitos existentes não quebrem.
6. Como desenvolvedor, quero que o objeto de ambiente seja tipado, para que o TypeScript acuse em tempo de compilação se um campo estiver faltando ou com o tipo errado.
7. Como desenvolvedor, quero que os arquivos de ambiente fiquem em `src/environments/`, para que sigam a convenção padrão do Angular CLI e sejam facilmente localizáveis por quem já conhece o framework.
8. Como desenvolvedor mantendo o web component `vendas-wc`, quero que o mesmo mecanismo de troca de ambiente esteja disponível no build desse projeto, para que ele não fique divergente do app principal quando precisar consumir `apiUrl` no futuro.
9. Como desenvolvedor, quero que a URL de produção fique como um placeholder claramente identificável (`https://api.SEUDOMINIO.com`), para que eu não corra o risco de publicar em produção apontando silenciosamente para `localhost`.
10. Como desenvolvedor, quero que nenhum segredo ou credencial seja modelado neste mecanismo, para que os arquivos de ambiente possam ser versionados no git sem risco de vazamento.
11. Como desenvolvedor revisando o `angular.json`, quero que as configurations `development`/`production` já existentes no projeto `frontend-admin-template` sejam reaproveitadas (não duplicadas), para que o build continue com uma única fonte de verdade para otimização e para environment.

## Decisões de implementação

- Mecanismo: `fileReplacements` do Angular CLI, wireado nas configurations `development` e `production` de cada projeto no `angular.json`. Nenhuma dependência nova é adicionada.
- Formato do objeto de ambiente: `{ production: boolean, apiUrl: string }`. Nenhum outro campo é modelado agora — novos campos entram quando a necessidade aparecer.
- Local dos arquivos: `src/environments/environment.ts` (dev, arquivo padrão referenciado pelo código) e `src/environments/environment.prod.ts` (prod, usado via `fileReplacements` só na configuration `production`).
- Escopo: os dois projetos do `angular.json` — `frontend-admin-template` (app principal, já tem configurations `development`/`production`, só falta o `fileReplacements`) e `vendas-wc` (web component, hoje sem configurations nenhuma; ganha `development`/`production` com o mesmo padrão de `fileReplacements`, mantendo `defaultConfiguration: "production"` para não alterar o comportamento atual do `build:vendas-wc`). Os dois projetos compartilham os mesmos arquivos de ambiente (mesmo `sourceRoot: "src"`).
- `vendas-wc` não tem target `serve` hoje — não é criado um agora; o trabalho se limita ao target `build`.
- Scripts em `package.json`: adicionar `start:dev`, `start:prod`, `build:dev`, `build:prod` (usando `--configuration=development` / `--configuration=production`). Os scripts `start` e `build` existentes continuam sem alteração, usando os `defaultConfiguration` já definidos (`development` para serve, `production` para build).
- Valores iniciais: dev `apiUrl: 'http://localhost:3000/api'`; prod `apiUrl: 'https://api.SEUDOMINIO.com'` (placeholder a ser substituído pelo domínio real antes do primeiro deploy).

## Decisões de teste

- Não há comportamento de runtime para testar unitariamente ainda: nenhum serviço real consome `environment.apiUrl` hoje (o app usa `AuthMockRepository` e `DashboardMockRepository`). Este PRD não introduz testes unitários novos.
- Validação é feita no nível de build: rodar `ng build --configuration=development` e `ng build --configuration=production` (via `npm run build:dev` / `build:prod`) para os dois projetos e inspecionar o bundle de saída, confirmando que a `apiUrl` correta foi embutida em cada configuration.
- Quando um serviço futuro passar a importar `environment`, os testes desse serviço devem mockar/stubar o módulo de environment, seguindo o padrão já usado no projeto para outras dependências injetadas (ex.: os repositórios mock existentes).

## Fora de escopo

- Consumir `environment.apiUrl` em serviços reais (a troca de `AuthMockRepository`/`DashboardMockRepository` por implementações reais é um trabalho futuro separado).
- Arquivos `.env` ou variáveis de ambiente do sistema operacional.
- Ambientes além de `dev`/`prod` (ex.: staging).
- Gestão de segredos ou credenciais.
- Criar um target `serve` para o projeto `vendas-wc`.

## Notas adicionais

- O placeholder `https://api.SEUDOMINIO.com` em `environment.prod.ts` precisa ser substituído pela URL real de produção antes do primeiro deploy — isso não é responsabilidade deste PRD, mas deve ficar registrado como pendência conhecida.
- Este PRD nasceu de uma sessão `grill-me` conduzida diretamente na conversa (sem necessidade de nova rodada de perguntas para este PRD).
