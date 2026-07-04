# Arquitetura — sismar-frontend-v2

> Documento vivo. Gerado por `/architecture-doc-generator`. Atualize executando a skill novamente após mudanças estruturais.
>
> Última atualização: 2026-07-04

---

## 1. Stack

| Grupo | Biblioteca | Versão |
|-------|-----------|--------|
| Framework | Angular | ^19.2 |
| Framework | RxJS | ~7.8 |
| Framework | Zone.js | ~0.15 |
| Componentes | @angular/cdk | ^19.2 |
| Web Components | @angular/elements | ^19.2 |
| Estilos | Tailwind CSS | ^3.4 |
| Gráficos | ApexCharts | ^5.15 |
| Gráficos | ng-apexcharts | ^1.11 |
| Mapas | Leaflet | ^1.9 |
| Ícones | Remixicon | ^4.9 |
| Testes | Jest | ^30.4 |
| Testes | jest-preset-angular | ^17.0 |
| Linting | ESLint + typescript-eslint + angular-eslint | ^10 / ^8 / ^22 |
| Formatação | Prettier | ^3.9 |
| Bundle WC | esbuild | ^0.28 |

Package manager: `pnpm` (detectado em `angular.json` › `cli.packageManager`)

---

## 2. Estrutura de pastas

```
src/
  app/
    core/              # serviços singleton, auth, guards, interceptors, config de tema
    features/          # features lazy-loaded (dashboard, charts, maps, ui-elements, auth, errors)
    layout/            # shell de layout (sidebar + header + router-outlet)
    shared/            # UI components, directives, pipes, models e utils reutilizáveis
    app.component.ts   # raiz da aplicação
    app.config.ts      # providers globais
    app.routes.ts      # rotas raiz
  environments/        # environment.ts (dev) e environment.prod.ts (prod), trocados via fileReplacements
  vendas-wc/           # wrapper do web component <sismar-vendas>
  assets/              # imagens e arquivos estáticos
  styles.css           # estilos globais + CSS custom properties
  main.ts              # bootstrap da aplicação principal (Zone.js)
  main-vendas-wc.ts    # bootstrap do web component (zoneless)
```

### `environments/`

**O que vai aqui:** `environment.ts` (usado por padrão, contém a config de desenvolvimento) e `environment.prod.ts` (usado apenas na configuration `production`). Ambos exportam um objeto `environment: { production: boolean, apiUrl: string }`. Compartilhado pelos dois projetos do `angular.json` (`sismar-frontend-v2` e `vendas-wc`), que têm o mesmo `sourceRoot`.

**O que NÃO vai aqui:** segredos ou credenciais — os arquivos são versionados no git. Ambientes além de dev/prod (ex.: staging) não são modelados.

**Por que existe separada:** mecanismo nativo do Angular CLI (`fileReplacements`) para alternar configuração por ambiente no build/serve, sem depender de `.env` ou variáveis de ambiente do sistema operacional. Ver `docs/planning/environment-config/PRD.md`.

### `core/`

**O que vai aqui:** serviços com `providedIn: 'root'` que são transversais à aplicação — autenticação, tema, layout, notificações. Também guards, interceptors HTTP, interfaces de repositório da camada de auth e configurações de injeção de dependência globais.

**O que NÃO vai aqui:** serviços de negócio específicos de uma feature (ex.: `DashboardService` fica em `features/dashboard/`). Componentes visuais tampouco pertencem aqui.

**Por que existe separada:** permite que `app.config.ts` registre providers globais a partir de um único ponto sem dispersar a configuração por features.

### `features/`

**O que vai aqui:** cada subpasta é uma feature lazy-loaded independente com seus próprios `routes.ts`, `pages/`, `services/`, `repositories/` e `models/`. Features são carregadas por `loadChildren` ou `loadComponent` a partir de `app.routes.ts`.

**O que NÃO vai aqui:** componentes compartilhados entre múltiplas features. Se um componente é usado em mais de um lugar, ele migra para `shared/ui/`.

**Por que existe separada:** lazy loading — cada feature gera seu próprio chunk JS, reduzindo o bundle inicial. Isolamento de providers por rota (ver seção 5) evita vazamento de estado entre features.

### `layout/`

**O que vai aqui:** o shell visual da aplicação autenticada — `LayoutComponent` (que contém `<router-outlet>`), `SidebarComponent`, `HeaderComponent` e `nav-items.ts` (configuração de navegação). Esses componentes são carregados uma única vez e envolvem todas as rotas protegidas.

**O que NÃO vai aqui:** lógica de negócio ou componentes de feature. O layout apenas compõe estrutura e delega ao `LayoutService`.

**Por que existe separada:** separa a preocupação de "onde fica o conteúdo na tela" da preocupação de "qual conteúdo mostrar" (features).

### `shared/`

**O que vai aqui:** artefatos reutilizáveis sem dependência de domínio — `ui/` (componentes visuais genéricos), `directives/`, `pipes/`, `models/` (interfaces compartilhadas) e `utils/` (funções puras). Qualquer feature pode importar daqui.

**O que NÃO vai aqui:** componentes com lógica de negócio ou que conhecem o domínio da aplicação (esses ficam em `features/`).

**Por que existe separada:** reutilização sem acoplamento — features importam componentes do catálogo sem saber nada sobre outras features.

### `vendas-wc/`

**O que vai aqui:** `VendasWcComponent`, o wrapper Angular que expõe a página de vendas como Custom Element. Este diretório existe exclusivamente para o build de web component.

**O que NÃO vai aqui:** lógica de negócio nova. O componente apenas delega para `VendasPageComponent` de `features/dashboard/`.

**Por que existe separada:** o build do web component usa um `tsconfig` e um entry point distintos (`main-vendas-wc.ts`). Isolar o wrapper facilita manter o ciclo de build independente.

---

## 3. Padrão repositório

A aplicação usa o padrão **abstract class + InjectionToken** para desacoplar serviços de domínio das implementações de dados. Isso permite trocar a fonte de dados (mock → HTTP → cache) via binding na rota, sem alterar o serviço consumidor.

### Como funciona

```
abstract class FooRepository          ← contrato (interface de domínio)
  └─ abstract getSummary(): Observable<T>

const FOO_REPOSITORY =
  new InjectionToken<FooRepository>   ← token DI (sem valor padrão)

class FooMockRepository
  extends FooRepository               ← implementação mock (dados estáticos)

// em routes.ts da feature:
providers: [
  FooService,
  { provide: FOO_REPOSITORY, useClass: FooMockRepository }
]

// FooService consome via:
private readonly repo = inject(FOO_REPOSITORY)
```

### Como criar um repositório novo

1. Crie `<feature>/repositories/<nome>.repository.ts` com a `abstract class` e o `InjectionToken`.
2. Crie `<feature>/repositories/<nome>-mock.repository.ts` com a implementação mock.
3. No `routes.ts` da feature, adicione o provider no array `providers:` da rota correspondente.
4. Injete `FOO_REPOSITORY` no serviço via `inject(FOO_REPOSITORY)`.

Referências reais no projeto:
- `src/app/features/dashboard/repositories/dashboard.repository.ts`
- `src/app/features/dashboard/repositories/acoes.repository.ts`
- `src/app/core/auth/auth.repository.ts`

---

## 4. Sistema de tema

O tema é controlado pelo `ThemeService` (singleton), configurado via `THEME_CONFIG` (InjectionToken) e inicializado no boot da aplicação por `APP_INITIALIZER`.

### Configuração

Edite `src/app/core/config/theme.config.ts` para personalizar o projeto:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `defaultMode` | `'light' \| 'dark'` | Modo padrão na primeira visita |
| `primaryColor` | `string` | Cor primária (botões, links, destaques) em hex ou hsl |
| `menuColor` | `string` | Cor de fundo da sidebar no modo claro |
| `headerColor` | `string` | Cor de fundo do header no modo claro |
| `darkMenuColor?` | `string` | Cor da sidebar no modo escuro (opcional) |
| `darkHeaderColor?` | `string` | Cor do header no modo escuro (opcional) |
| `logoUrl` | `string` | Caminho do logo em `src/assets/` |
| `appName` | `string` | Nome da aplicação exibido no header |

### CSS custom properties

Definidas em `src/styles.css` e atualizadas em runtime pelo `ThemeService`:

| Propriedade | Uso |
|-------------|-----|
| `--color-primary` | Cor primária (botões, links, destaques) |
| `--color-menu-bg` | Fundo da sidebar |
| `--color-header-bg` | Fundo do header |
| `--color-text` | Texto principal |
| `--color-bg` | Fundo da página |
| `--color-gray-50` … `--color-gray-950` | Escala de cinza (usada internamente pelos componentes) |

### Dark mode

Aplicado via **classe `.dark` no elemento `<html>`** — compatível com Tailwind CSS `darkMode: 'class'`. A preferência é persistida em `localStorage` (chave `theme-mode`).

Fluxo: `ThemeService.toggleMode()` → altera signal `currentMode` → adiciona/remove `.dark` no `<html>` → atualiza CSS custom properties via `element.style.setProperty`.

---

## 5. Roteamento

### Mapa de rotas

```
/login        → LoginComponent                (público, lazy)
/             → LayoutComponent               (guard: authGuard)
  /           → redireciona para /dashboard
  /dashboard  → dashboardRoutes (lazy)
    /         → redireciona para /dashboard/vendas
    /vendas   → VendasPageComponent           (providers: DashboardService, DASHBOARD_REPOSITORY=mock)
    /acoes    → AcoesPageComponent            (providers: AcoesService, ACOES_REPOSITORY=mock)
  /charts     → chartsRoutes (lazy)
    /         → redireciona para /charts/line
    /line     → LineChartsPageComponent
    /bar      → BarChartsPageComponent
    /mixed    → MixedChartsPageComponent
    /timeline → TimelineChartsPageComponent
    /pie      → PieChartsPageComponent
  /ui-elements → uiElementsRoutes (lazy)
    /         → redireciona para /ui-elements/alerts
    /alerts   → AlertsPageComponent
    /badges   → BadgesPageComponent
    /buttons  → ButtonsPageComponent
    /cards    → CardsPageComponent
    /dropdowns → DropdownsPageComponent
    /list-group → ListGroupPageComponent
    /modals   → ModalsPageComponent
    /progress → ProgressPageComponent
    /spinners → SpinnersPageComponent
    /tables   → TablesPageComponent
    /toasts   → ToastsPageComponent
  /maps       → MapsPageComponent             (lazy)
**            → NotFoundComponent             (lazy)
```

### Providers por rota

Features de dashboard usam **providers escopados à rota** para isolar serviços de negócio:

```typescript
// features/dashboard/routes.ts
{
  path: 'vendas',
  providers: [
    DashboardService,
    { provide: DASHBOARD_REPOSITORY, useClass: DashboardMockRepository },
  ],
  loadComponent: () => import('./pages/vendas-page/...'),
}
```

Isso significa que `DashboardService` **não é singleton global** — cada rota de dashboard tem sua própria instância, criada e destruída junto com o componente. Para trocar para uma implementação real HTTP, basta substituir `useClass: DashboardMockRepository` por `useClass: DashboardHttpRepository` em `routes.ts`.

### Guards e interceptors

| Nome | Tipo | Condição / Comportamento |
|------|------|------------------------|
| `authGuard` | `CanActivateFn` | Permite acesso se `AuthService.isAuthenticated()` for `true`; caso contrário, redireciona para `/login` |
| `authInterceptor` | `HttpInterceptorFn` | Injeta `Authorization: Bearer <token>` em todas as requisições HTTP, exceto rotas de login (`/auth/login`) |

---

## 6. Catálogo de componentes compartilhados

Todos os componentes estão em `src/app/shared/ui/` e são standalone — importe diretamente no componente que precisar.

### Dados e tabelas

| Componente | Selector | Inputs principais | Uso |
|-----------|----------|------------------|-----|
| Table | `app-table` | `columns*`, `rows*`, `actions`, `loading`, `totalItems`, `pageSize`, `currentPage`, `striped` (default `true`), `searchable`, `searchPlaceholder` | Tabela genérica com colunas dinâmicas (incl. `ColumnDef.template` para células customizadas como badge/progress), ações por linha, paginação, striping opcional e busca embutida (`(searchChange)`) |
| KPI Card | `app-kpi-card` | `label*`, `value*`, `change*`, `icon*` | Card de métrica com variação percentual e ícone |
| Ticker Card | `app-ticker-card` | `symbol*`, `name*`, `currentValue*`, `change*`, `trend*`, `currency` | Card de ativo financeiro com tendência de alta/baixa |

### Gráficos (ApexCharts via ng-apexcharts)

| Componente | Selector | Inputs principais | Tipo |
|-----------|----------|------------------|------|
| Line Chart | `app-line-chart` | `data*`, `title*`, `description`, `height`, `colors`, `showLegend` | Linha |
| Bar Chart | `app-bar-chart` | `data*`, `title*`, `orientation`, `height`, `colors`, `showLegend` | Barras (vertical/horizontal) |
| Area Chart | `app-area-chart` | `data*`, `title*`, `stacked`, `height`, `colors`, `showLegend` | Área (empilhada ou não) |
| Mixed Chart | `app-mixed-chart` | `data*`, `title*`, `height`, `colors`, `showLegend` | Linha + barras combinados |
| Timeline Chart | `app-timeline-chart` | `data*`, `title*`, `height`, `colors` | Timeline / Gantt |
| Pie Chart | `app-pie-chart` | `labels*`, `series*`, `title*`, `donut`, `height`, `colors` | Pizza ou donut |
| Time Series | `app-time-series-chart` | `data*`, `title*`, `zoomEnabled`, `height`, `colors` | Série temporal com zoom |

### Mapas (Leaflet)

| Componente | Selector | Inputs principais | Uso |
|-----------|----------|------------------|-----|
| Map | `app-map` | `center`, `zoom`, `height` | Mapa base |
| Map Marker | `app-map-marker` | `lat*`, `lng*`, `title`, `popupContent` | Marcador no mapa |
| Map Circle | `app-map-circle` | `center*`, `radius*`, `color`, `tooltipContent` | Área circular no mapa |
| Map Polygon | `app-map-polygon` | `points*`, `color`, `tooltipContent` | Polígono no mapa |

> Componentes de mapa são usados como filhos de `<app-map>` via content projection / serviço compartilhado (`MapService`).

### Feedback

| Componente | Selector | Inputs principais | Uso |
|-----------|----------|------------------|-----|
| Alert | `app-alert` | `message*`, `type` (info/success/warning/danger), `dismissible` | Alerta inline |
| Toast Container | `app-toast-container` | — | Container de toasts (consome `ToastService`) |
| Spinner | `app-spinner` | `size` (sm/md/lg), `color` | Indicador de carregamento |
| Progress | `app-progress` | `value*`, `max`, `label`, `variant` (primary/success/warning/danger) | Barra de progresso |

### Ações e navegação

| Componente | Selector | Inputs principais | Uso |
|-----------|----------|------------------|-----|
| Button | `app-button` | `variant` (primary/secondary/outline/danger/ghost), `size` (sm/md/lg), `loading`, `disabled`, `type` | Botão de ação |
| Dropdown | `app-dropdown` | `items*`, `label` | Menu suspenso com lista de ações |
| Breadcrumb | `app-breadcrumb` | — | Navegação hierárquica automática (lê `route.data.breadcrumb`) |

### Modais (`@angular/cdk/dialog`)

Localizados em `src/app/shared/ui/modal/`. Construídos sobre `@angular/cdk/dialog` (não `@angular/cdk/overlay` cru, não hand-rolled) — abertos via `inject(Dialog).open(Component, config)`.

| Componente | Uso | `DIALOG_DATA` |
|-----------|-----|---------------|
| `ModalShellComponent` (`app-modal-shell`) | Casca visual compartilhada (painel, backdrop, header com título + X, slot de conteúdo, slot `[modal-footer]`). Usada internamente pelos 3 dialogs abaixo — não é aberta diretamente via `Dialog.open()`. | — (`@Input title`, `@Input panelClass`) |
| `ConfirmDialogComponent` (`app-confirm-dialog`) | Confirmação de ação (exclusão ou genérica), reaproveitável — muda só o `data` passado | `{ title, message, confirmLabel?, cancelLabel?, variant?: 'danger'\|'primary' }`, retorna `boolean` no `DialogRef.close()` |
| `DetailModalComponent` (`app-detail-modal`) | Modal de detalhes genérico — renderiza um `TemplateRef` arbitrário via `NgTemplateOutlet`, permitindo compor qualquer combinação de componentes existentes (KPI cards, tabelas, gráficos) sem criar um novo componente de dialog | `{ title, template: TemplateRef<unknown> }` |

**⚠️ Ao chamar `dialog.open(...)`, sempre passe `viewContainerRef: this.viewContainerRef`** (injetando `ViewContainerRef` no componente chamador). Sem isso, o componente do dialog é criado fora da árvore de change detection da aplicação e seu conteúdo (interpolações, bindings) não renderiza — ver `docs/planning/ui-elements-tables-modals-nav/issues/02-modals-confirm-e-detail.md` para o diagnóstico completo.

A centralização do modal depende de um fallback CSS em `src/styles.css` (`.cdk-global-overlay-wrapper { justify-content: center; align-items: center; }`), pois o `GlobalPositionStrategy` do CDK não aplicou a centralização via JS de forma confiável neste app.

O CSS estrutural do overlay (`node_modules/@angular/cdk/overlay-prebuilt.css`) é registrado em `angular.json` › `styles` do projeto `sismar-frontend-v2` — obrigatório para o backdrop/posicionamento funcionarem.

Exemplo de uso específico de feature (não genérico): `CustomerFormDialogComponent` em `src/app/features/ui-elements/pages/modals-page/customer-form-dialog/` — dialog de formulário com `ReactiveFormsModule` colocado junto da página que o usa, já que formulários variam por caso de uso e não fazem sentido como componente genérico em `shared/ui/`.

### Layout e containers

| Componente | Selector | Inputs principais | Uso |
|-----------|----------|------------------|-----|
| Card | `app-card` | — | Container com shadow e bordas arredondadas (content projection) |
| List Group | `app-list-group` | `items*` | Lista de itens estilizada |
| Badge | `app-badge` | `label*`, `variant` (default/primary/success/warning/danger) | Tag/rótulo visual |

> `*` = `@Input({ required: true })`

---

## 7. Serviços singleton

Todos registrados com `providedIn: 'root'` — uma única instância compartilhada por toda a aplicação.

| Serviço | Responsabilidade | State |
|---------|-----------------|-------|
| `ThemeService` | Alterna dark/light mode, aplica CSS custom properties, persiste preferência em localStorage | Signal (`currentMode`) |
| `AuthService` | Gerencia token JWT e usuário atual; delega login/logout para `AUTH_REPOSITORY` | Signals (`token`, `currentUser`, `isAuthenticated`) |
| `LayoutService` | Controla estado do sidebar (expanded/collapsed/mobile); reage a breakpoints via CDK | Signal (`sidebarState`) |
| `ToastService` | Fila de notificações toast com auto-dismiss configurável | Signal (`_toasts`) |

### Tokens DI globais

| Token | Interface / Tipo | Onde é provido |
|-------|-----------------|---------------|
| `THEME_CONFIG` | `ThemeConfig` | `app.config.ts` (e no bootstrap do web component) |
| `AUTH_REPOSITORY` | `AuthRepository` (abstract) | `app.config.ts` (mock em desenvolvimento) |
| `DASHBOARD_REPOSITORY` | `DashboardRepository` (abstract) | Por rota em `features/dashboard/routes.ts` |
| `ACOES_REPOSITORY` | `AcoesRepository` (abstract) | Por rota em `features/dashboard/routes.ts` |

---

## 8. Web components

### `<sismar-vendas>`

**Wrapper:** `VendasWcComponent` (`src/vendas-wc/vendas-wc.component.ts`)

**Uso:**
```html
<script src="sismar-vendas.js"></script>
<sismar-vendas theme="dark"></sismar-vendas>
```

**Atributos disponíveis:**

| Atributo | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `theme` | `'light' \| 'dark'` | — | Ativa/desativa dark mode via classe `.dark` no host element |

**Bootstrap:** `createApplication` com `provideExperimentalZonelessChangeDetection` (sem Zone.js). Providers declarados em `main-vendas-wc.ts`:
- `THEME_CONFIG` com `themeConfig` padrão
- `DashboardService`
- `DASHBOARD_REPOSITORY` → `DashboardMockRepository`

**Build:** `pnpm build:vendas-wc` → executa `ng build vendas-wc` (ESM) + `node scripts/bundle-wc.js`. Resolve para a configuration `production` por padrão (usa `environment.prod.ts`); rode `ng build vendas-wc --configuration=development` diretamente para embutir `environment.ts` (dev) — sem script npm dedicado ainda.

O script `bundle-wc.js` realiza três etapas:
1. Converte ESM → IIFE via esbuild (`bundle: false, format: 'iife'`)
2. Injeta o CSS inline como `<style>` via banner JS
3. Embute a fonte Remixicon (woff2) como base64 data URI no CSS — eliminando dependência de arquivos externos

**Saída:** `dist/vendas-wc/sismar-vendas.js` (~1400 KB, autocontido — nenhum arquivo externo necessário)

**Demo:** `pnpm serve:vendas-wc` → `http://localhost:4300/demo.html`

---

## 9. Scripts

| Script | Comando | O que faz |
|--------|---------|----------|
| `start` | `pnpm ng serve` | Inicia servidor de desenvolvimento na porta padrão (4200), configuration `development` por padrão |
| `start:dev` | `pnpm ng serve --configuration=development` | Igual a `start`, mas explícito — usa `environment.ts` |
| `start:prod` | `pnpm ng serve --configuration=production` | Dev server servindo com `environment.prod.ts` (para testar prod localmente) |
| `build` | `pnpm ng build` | Build de produção da app principal em `dist/sismar-frontend-v2/`, configuration `production` por padrão, usa `environment.prod.ts` |
| `build:dev` | `pnpm ng build --configuration=development` | Build com `environment.ts` (apiUrl de desenvolvimento embutida) |
| `build:prod` | `pnpm ng build --configuration=production` | Igual a `build`, mas explícito — usa `environment.prod.ts` |
| `watch` | `pnpm ng build --watch --configuration development` | Build incremental em modo dev (sem otimizações) |
| `test` | `pnpm jest --watchAll` | Executa testes Jest em modo watch interativo |
| `test:ci` | `pnpm jest --ci` | Executa testes Jest sem interatividade (para CI/CD) |
| `lint` | `pnpm eslint .` | Verifica problemas de lint em todo o projeto |
| `lint:fix` | `pnpm eslint . --fix` | Corrige automaticamente problemas de lint corrigíveis |
| `format` | `pnpm prettier --write "src/**/*.{ts,html,css}"` | Formata arquivos TypeScript, HTML e CSS com Prettier |
| `build:vendas-wc` | `pnpm ng build vendas-wc && node scripts/bundle-wc.js` | Build do web component: compila com Angular CLI + converte para IIFE + embute CSS/fontes |
| `serve:vendas-wc` | `pnpm npx serve dist/vendas-wc --listen 4300` | Serve o demo do web component em `http://localhost:4300/demo.html` |

---

*Gerado por `/architecture-doc-generator` a partir do código-fonte. Para atualizar, execute a skill novamente.*
