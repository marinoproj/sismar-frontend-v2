Status: done

# 01 — Environment switching no app principal

## Issue pai

`docs/planning/environment-config/PRD.md`

## O que construir

Introduzir dois arquivos de configuração de ambiente (dev e prod) para o projeto `frontend-admin-template`, trocados automaticamente pelo Angular CLI no build/serve conforme a configuration escolhida, e expor essa escolha através de scripts npm explícitos.

Comportamento de ponta a ponta esperado:

- Rodar o dev server na configuration de desenvolvimento usa o arquivo de ambiente de dev (com a `apiUrl` de dev embutida).
- Rodar o dev server na configuration de produção usa o arquivo de ambiente de prod (com a `apiUrl` de prod embutida).
- Gerar um build na configuration de desenvolvimento produz um bundle com a `apiUrl` de dev embutida.
- Gerar um build na configuration de produção produz um bundle com a `apiUrl` de prod embutida.
- Os comandos padrão de start/build (sem escolha explícita de ambiente) continuam se comportando como hoje.

Formato do objeto de ambiente: `{ production: boolean, apiUrl: string }`. Sem outros campos por enquanto.

Valores: dev usa uma URL de API local (`http://localhost:3000/api`); prod usa um placeholder de domínio (`https://api.SEUDOMINIO.com`) que será substituído pela URL real antes do primeiro deploy — isso é uma pendência conhecida, não bloqueia esta issue.

Os arquivos de ambiente devem seguir a localização convencional do Angular CLI dentro do `sourceRoot` do projeto, e a troca deve ser feita via o mecanismo nativo de substituição de arquivo por configuration (sem `.env`, sem variáveis de ambiente de sistema operacional, sem dependências novas).

Os scripts npm de start/build devem oferecer uma forma explícita de escolher dev ou prod, além das versões padrão já existentes.

## Critérios de aceite

- [x] Existem dois arquivos de ambiente (dev e prod) com o formato `{ production: boolean, apiUrl: string }`, com os valores de `apiUrl` especificados acima.
- [x] O build do projeto `frontend-admin-template` na configuration de produção embute o arquivo de ambiente de prod (bundle contém a `apiUrl` de prod, não a de dev).
- [x] O build do projeto `frontend-admin-template` na configuration de desenvolvimento embute o arquivo de ambiente de dev (bundle/dev server contém a `apiUrl` de dev).
- [x] `npm start` e `npm run build` continuam funcionando sem mudança de comportamento visível em relação a hoje.
- [x] Existem scripts npm que permitem escolher explicitamente dev ou prod tanto para servir quanto para buildar, sem precisar digitar flags do Angular CLI manualmente.
- [x] Nenhum segredo/credencial é introduzido nos arquivos de ambiente.

## Bloqueado por

Nenhum — pode começar imediatamente.

## Comments

Implementado: `src/environments/environment.ts` (dev) e `environment.prod.ts` (prod) criados; `fileReplacements` adicionado à configuration `production` de `frontend-admin-template` no `angular.json`; scripts `start:dev`, `start:prod`, `build:dev`, `build:prod` adicionados ao `package.json`. Validado embutindo temporariamente um `console.log(environment.apiUrl)` em `src/main.ts`, rodando build dev e prod, confirmando a URL correta em cada bundle (`localhost:3000` em dev, `api.SEUDOMINIO.com` em prod) e depois revertendo a sonda — `git status` confirma que `src/main.ts` ficou sem diff.
