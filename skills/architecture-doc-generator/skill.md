---
name: architecture-doc-generator
description: Explora o codebase Angular ao vivo e gera ou atualiza docs/architecture/architecture.md com documentação técnica de arquitetura em PT-BR. Genérico — funciona em qualquer projeto Angular sem necessidade de ajuste. Use quando o usuário quiser gerar a documentação de arquitetura, atualizar o guia de estrutura ou criar um mapa técnico vivo do projeto.
---

## Objetivo

Explorar o codebase ao vivo, sintetizar o que foi encontrado e escrever (ou atualizar) `docs/architecture/architecture.md` usando o template embutido nesta skill.

Não entreviste o usuário. Derive tudo direto do código.

---

## Fase 1 — Exploração

Para cada etapa abaixo: se um arquivo ou pasta não existir, pule e continue. Não assuma que o projeto segue uma convenção específica — descubra o que existe.

### 1.1 Configuração do projeto

**`package.json`** — extraia:
- Package manager em uso (verifique também `.npmrc`, `pnpm-workspace.yaml`, `yarn.lock` para confirmar)
- Versão de `@angular/core`
- Todas as dependências relevantes agrupadas mentalmente: framework, estilos, UI/charts/mapas, testes, linting/formatação
- Lista completa de scripts (`scripts:`)

**`angular.json`** (ou `project.json` em monorepos Nx) — extraia:
- Todos os targets de build existentes: nome, `browser`/`main` (entry point), `outputPath`, `polyfills`, presença ou ausência de `index`
- Targets sem `index` provavelmente são web components ou libraries — anote separadamente
- Package manager declarado (`cli.packageManager`)

**`tsconfig.json`** + qualquer `tsconfig.app.json` — note flags relevantes (`strict`, `target`, `moduleResolution`).

### 1.2 Bootstrap e configuração de DI

Para cada entry point encontrado em 1.1, leia o arquivo correspondente e extraia:
- Como a aplicação é inicializada (`bootstrapApplication`, `platformBrowserDynamic`, `createApplication`)
- Providers globais declarados (router, HttpClient, interceptors, tokens DI, `APP_INITIALIZER`)
- Se usa Zone.js ou modo zoneless (`provideExperimentalZonelessChangeDetection`)

### 1.3 Estrutura de pastas

Liste o conteúdo do diretório `src/` (e subdiretórios de primeiro nível de `src/app/` se existir). Para cada pasta encontrada, identifique o papel pelo conteúdo:

| Sinal no código | Papel inferido |
|----------------|---------------|
| Arquivos com `providedIn: 'root'` | Serviços singleton (candidatos a `core/`) |
| Arquivos com `CanActivate` / `CanActivateFn` | Guards |
| Arquivos com `HttpInterceptor` / `HttpInterceptorFn` | Interceptors |
| Pastas com `routes.ts` + `pages/` | Features (lazy-loaded) |
| Pastas com muitos `@Component` importados por features diferentes | Biblioteca de UI compartilhada |
| Componente que contém `<router-outlet>` e é referenciado como raiz de rotas filhas | Shell de layout |
| Arquivos com `createCustomElement` / `customElements.define` | Web components |

### 1.4 Rotas

Encontre o arquivo de rotas raiz (geralmente `app.routes.ts`, `app.module.ts`, ou declarado no bootstrap). Leia-o e siga recursivamente:
- Referências com `loadChildren(() => import(...))` — leia o arquivo importado
- Referências com `loadComponent(() => import(...))` — note o componente e os `providers:` declarados por rota

Monte o diagrama completo de rotas: caminho → componente → providers → rotas filhas.

Identifique:
- Rotas públicas (sem guard)
- Rotas protegidas (quais guards e condições)
- Shell de layout (componente que envolve todas as rotas autenticadas via `children`)
- Rotas de erro (wildcard `**`, 404)

### 1.5 Serviços singleton

Busque em todo o projeto por `providedIn: 'root'`. Para cada serviço encontrado:
- Nome e localização
- Responsabilidade em uma linha (infira pelo nome dos métodos e propriedades)
- Se usa signals, observables ou estado simples

Busque também por `InjectionToken` — liste cada token, a interface associada e onde é provido (em `app.config.ts`, por rota, ou em um módulo).

### 1.6 Guards e interceptors

Busque por `CanActivate`, `CanActivateFn`, `CanMatch`, `CanMatchFn` — descreva a condição verificada por cada um.

Busque por `HttpInterceptor`, `HttpInterceptorFn` — descreva o que cada um injeta ou modifica nas requisições.

### 1.7 Biblioteca de UI compartilhada

Se existir um diretório de componentes reutilizáveis (identificado em 1.3), liste todos os componentes presentes. Para cada um, leia o arquivo `.ts` e extraia:
- `selector`
- `@Input()` com tipos (obrigatórios em evidência)
- Propósito em uma linha

Agrupe por categoria inferida pelo nome e propósito: **dados/tabelas**, **feedback**, **ações**, **layout/containers**, e qualquer outra categoria observada.

### 1.8 Sistema de tema

Busque por: `ThemeService`, `theme.config`, `ThemeConfig`, `darkMode`, `color-scheme`, `InjectionToken` relacionado a tema. Se encontrar:
- Quais campos configuram o tema (interface ou objeto de configuração)
- Como o dark mode é aplicado (classe CSS no `<html>`, media query, outro)
- Quais CSS custom properties são definidas (busque em `styles.css` / `global.css`)
- Onde a preferência é persistida (localStorage, cookie, nenhum)

Se não houver sistema de tema, note a ausência.

### 1.9 Web components

Busque `createCustomElement` e `customElements.define` em todos os arquivos TypeScript. Para cada custom element encontrado:
- Tag HTML registrada
- Componente Angular que envolve
- `@Input()` disponíveis como atributos
- Entry point de bootstrap e providers declarados
- Script de build correspondente em `package.json` (se existir)

Se nenhum web component for encontrado, a seção correspondente no documento final deve ser omitida.

### 1.10 Padrão repositório

Busque por `InjectionToken` + `abstract class` no mesmo arquivo (ou em arquivos relacionados). Se encontrar:
- Nome do padrão (abstract class → token → implementação mock → binding na rota)
- Exemplo real: um arquivo de repositório concreto do projeto
- Como trocar a implementação

Se não houver padrão repositório, omita a seção.

### 1.11 Documentação existente

Se existirem, leia:
- `docs/context/context.md` — use a terminologia canônica no documento gerado
- `docs/adr/*.md` — liste pelo número e título (não sugira criar ADRs)
- `docs/architecture/architecture.md` — se já existir, preserve blocos `<!-- nota: ... -->` e atualize apenas o que divergiu do código atual

---

## Fase 2 — Síntese

Antes de escrever, resolva mentalmente:

1. **Stack exata** — versões reais de `package.json`; agrupe por função (framework, estilos, testes etc.)
2. **Responsabilidades de pasta** — para cada pasta raiz encontrada: o que pertence aqui, o que NÃO pertence, por que existe separada das demais
3. **Hierarquia de DI** — o que é `providedIn: 'root'` vs scoped à rota vs declarado em `app.config.ts` / módulo raiz
4. **Fluxo de roteamento** — do entry point até cada página: lazy loading, guards, providers por rota
5. **Catálogo de UI** — agrupamento por categoria inferida dos componentes encontrados
6. **Tema** — se existir, como personalizar; se não existir, omitir
7. **Web components** — se existirem, como usar; se não existirem, omitir seção

Regras de escrita:
- Tabelas > parágrafos quando há lista de itens comparáveis
- Frases curtas, voz ativa
- Foco em invariantes arquiteturais — não documente valores que mudam a cada sprint
- Use a terminologia de `docs/context/context.md` se existir
- Não duplique o que está em ADRs — apenas liste-os

---

## Fase 3 — Geração

Crie `docs/architecture/` se não existir. Escreva `docs/architecture/architecture.md` usando o template abaixo como estrutura.

**Regras de preenchimento:**
- Substitua cada `{...}` com o valor real extraído do código — nunca copie o placeholder
- Se uma informação não foi encontrada no código, escreva `(não identificado no código)` e continue
- Seções marcadas com `[CONDICIONAL]` só devem aparecer no documento final se o artefato correspondente foi encontrado na exploração
- Se o arquivo já existir: leia primeiro, preserve blocos `<!-- nota: ... -->` exatamente onde estão, atualize apenas seções que divergiram do código

<architecture-template>
# Arquitetura — {NOME_DO_PROJETO}

> Documento vivo. Gerado por `/architecture-doc-generator`. Atualize executando a skill novamente após mudanças estruturais.
>
> Última atualização: {DATA_ATUAL}

---

## 1. Stack

{TABELA_DERIVADA_DE_PACKAGE_JSON}
<!--
Instrução: gere uma tabela com as dependências relevantes agrupadas por função.
Exemplos de grupos: Framework, Estilos, Gráficos, Mapas, Ícones, Testes, Linting.
Use apenas o que realmente existe no package.json — não invente linhas.
Exemplo de formato:
| Grupo | Biblioteca | Versão |
|-------|-----------|--------|
| Framework | Angular | 19.x |
| Estilos | Tailwind CSS | 3.x |
-->

Package manager: `{npm|pnpm|yarn}` (detectado em `angular.json` > `cli.packageManager` ou lockfile)

---

## 2. Estrutura de pastas

{ARVORE_REAL_DE_SRC}
<!--
Instrução: gere a árvore real encontrada em src/, com dois níveis de profundidade.
Use comentários inline para identificar o papel de cada pasta/arquivo chave.
-->

{PARA_CADA_PASTA_RAIZ_ENCONTRADA_DESCREVA}:

### `{nome-da-pasta}/`

**O que vai aqui:** {descrição baseada no conteúdo encontrado — serviços, guards, componentes de UI, features lazy-loaded etc.}

**O que NÃO vai aqui:** {o que pertenceria a outras pastas, com base na separação de responsabilidades observada}

**Por que existe separada:** {justificativa derivada do papel — lazy loading, singleton, reutilização, isolamento}

<!--
Repita este bloco para cada pasta de primeiro nível com papel arquitetural distinto.
-->

---

## 3. Padrão repositório

[CONDICIONAL — inclua apenas se o padrão abstract class + InjectionToken foi encontrado na exploração 1.10]

{EXPLICACAO_DO_PADRAO_ENCONTRADO}

### Como funciona

```
{DIAGRAMA_BASEADO_NO_PADRAO_REAL_ENCONTRADO}
```

### Como criar um repositório novo

{PASSOS_BASEADOS_NO_PADRAO_OBSERVADO_NO_CODIGO}

Referência real no projeto: `{CAMINHO_DO_REPOSITORIO_EXEMPLO_ENCONTRADO}`

---

## 4. Sistema de tema

[CONDICIONAL — inclua apenas se sistema de tema foi encontrado na exploração 1.8]

{DESCRICAO_DO_SISTEMA_DE_TEMA_ENCONTRADO}

### Configuração

{TABELA_DE_CAMPOS_DA_INTERFACE_DE_CONFIGURACAO_ENCONTRADA}

### CSS custom properties

{LISTA_DAS_VARIAVEIS_ENCONTRADAS_EM_STYLES_CSS_OU_EQUIVALENTE}

### Dark mode

{MECANISMO_ENCONTRADO — classe CSS, media query, outro}

---

## 5. Roteamento

### Mapa de rotas

```
{DIAGRAMA_DERIVADO_DOS_ARQUIVOS_DE_ROTAS_ENCONTRADOS}
<!--
Formato sugerido:
/caminho  → Componente  (guard: nome, providers: TOKEN)
  /filho  → Filho
-->
```

### Providers por rota

{SE_O_PROJETO_USA_PROVIDERS_POR_ROTA_EXPLIQUE_O_PADRAO_AQUI}

### Guards e interceptors

{TABELA_DE_GUARDS_E_INTERCEPTORS_ENCONTRADOS}
<!--
| Nome | Tipo | Condição / Comportamento |
|------|------|------------------------|
-->

---

## 6. Catálogo de componentes compartilhados

[CONDICIONAL — inclua apenas se biblioteca de UI compartilhada foi encontrada na exploração 1.7]

{TABELAS_POR_CATEGORIA_INFERIDA}
<!--
Para cada categoria encontrada, gere uma tabela:
| Componente | Selector | Inputs principais | Uso |
|-----------|----------|------------------|-----|

Categorias são inferidas do conteúdo, não pré-definidas.
-->

---

## 7. Serviços singleton

{TABELA_DE_SERVICOS_COM_PROVIDED_IN_ROOT_ENCONTRADOS}
<!--
| Serviço | Responsabilidade | State (signal/observable/simples) |
|---------|-----------------|----------------------------------|
-->

Tokens DI globais:

{TABELA_DE_INJECTION_TOKENS_ENCONTRADOS}
<!--
| Token | Interface / Tipo | Onde é provido |
|-------|-----------------|---------------|
-->

---

## 8. Web components

[CONDICIONAL — inclua apenas se web components foram encontrados na exploração 1.9]

{PARA_CADA_WEB_COMPONENT_ENCONTRADO}:

### `<{TAG_REGISTRADA}>`

**Wrapper:** `{COMPONENTE_ANGULAR}`

**Uso:**
```html
<script src="{ARTEFATO_DE_BUILD}"></script>
<{TAG_REGISTRADA} {ATRIBUTOS}></{TAG_REGISTRADA}>
```

**Atributos disponíveis:**

{TABELA_DE_INPUTS_DO_WEB_COMPONENT}

**Build:** `{SCRIPT_DE_BUILD_DO_PACKAGE_JSON}` → produz `{OUTPUT_PATH}` ({DESCRICAO_DO_QUE_O_SCRIPT_FAZ})

---

## 9. Scripts

| Script | Comando | O que faz |
|--------|---------|----------|
{LINHAS_DERIVADAS_DE_PACKAGE_JSON_SCRIPTS}
<!--
Liste todos os scripts de package.json.
Infira o que cada um faz pelo comando — não invente descrições.
Use o package manager correto (npm run X / pnpm X / yarn X).
-->

---

## 10. ADRs

[CONDICIONAL — inclua apenas se docs/adr/ existe e contém arquivos]

Decisões registradas em `docs/adr/`:

| ADR | Título |
|-----|--------|
{LISTA_DE_ADRs_ENCONTRADOS}

[Se docs/adr/ não existir ou estiver vazio, omita esta seção completamente]

---

*Gerado por `/architecture-doc-generator` a partir do código-fonte. Para atualizar, execute a skill novamente.*
</architecture-template>

---

## Fase 4 — Pós-geração

### 4.1 Verificar CLAUDE.md

Se existir um `CLAUDE.md` na raiz e ele tiver uma tabela de skills, verifique se `architecture-doc-generator` está listado. Se não estiver, adicione a linha correspondente.

### 4.2 Confirmar ao usuário

Ao terminar, informe:
- Caminho do arquivo gerado (`docs/architecture/architecture.md`)
- Quais seções condicionais foram incluídas e quais foram omitidas (e por quê)
- Se alguma informação não foi encontrada no código
- Se alguma anotação manual foi preservada

Não crie commits, não abra PRs, não altere outros arquivos além de `docs/architecture/architecture.md` (e `CLAUDE.md` se necessário).
