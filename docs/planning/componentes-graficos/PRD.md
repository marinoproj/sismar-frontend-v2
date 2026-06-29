Status: done

# PRD — Componentes de Gráficos Reutilizáveis (ApexCharts)

## Declaração do problema

Sistemas de dashboard como AIS e Meteorologia exibem dados em múltiplos tipos de gráfico. Sem componentes reutilizáveis, cada feature reimplementa a configuração do ApexCharts (opções de tema, responsividade, dark mode, cores), gerando duplicação e inconsistência visual entre gráficos do mesmo sistema.

## Solução

Uma biblioteca de componentes de gráfico em `src/app/shared/ui/charts/`, cada um encapsulando a configuração do ApexCharts para um tipo específico. Os componentes aceitam como `@Input()` os dados a serem renderizados, título e descrição (obrigatórios), e opções visuais como cores, orientação e altura (opcionais com defaults). Os componentes respondem automaticamente ao modo dark/light via `ThemeService`.

## User stories

1. Como desenvolvedor, quero usar `<app-line-chart [data]="dados" [title]="'Vendas'" />` e obter um gráfico de linha funcional, para que não precise configurar o ApexCharts manualmente.
2. Como desenvolvedor, quero que gráficos respondam ao toggle dark/light automaticamente, para que não precise adicionar lógica de tema em cada feature que usa gráficos.
3. Como desenvolvedor, quero que todos os inputs além de `data` e `title` sejam opcionais com defaults sensatos, para que o uso mínimo seja simples e o avançado seja possível.
4. Como desenvolvedor, quero que os componentes de gráfico sejam usáveis em qualquer feature sem imports adicionais além do componente, para que a reutilização seja simples.
5. Como usuário, quero que os gráficos usem a cor primária do sistema como cor principal, para que a identidade visual seja consistente.
6. Como usuário, quero que os gráficos sejam responsivos e se ajustem ao tamanho do container, para que funcionem em telas de diferentes tamanhos.
7. Como desenvolvedor, quero um componente de gráfico misto (linha + barra) para visualizar séries de diferentes tipos no mesmo gráfico, para que comparações entre métricas heterogêneas sejam possíveis.
8. Como desenvolvedor, quero um componente de série temporal com zoom e pan para dados de telemetria densa, para que o usuário possa explorar grandes volumes de dados temporais.
9. Como desenvolvedor, quero um componente de timeline para visualizar eventos ao longo do tempo, para que fluxos e processos sequenciais sejam apresentados de forma clara.
10. Como desenvolvedor, quero componentes de gráfico de pizza e donut para visualizar distribuições percentuais, para que proporções entre categorias sejam apresentadas visualmente.

## Decisões de implementação

- **Instalação**: `ng-apexcharts` instalado via pnpm. Módulo/componente standalone importado diretamente nos componentes de gráfico.
- **Localização**: todos os componentes em `src/app/shared/ui/charts/`. Cada componente em sua própria pasta (`line-chart/`, `bar-chart/`, etc.).
- **Interface `ChartData`**: interface compartilhada em `src/app/shared/models/chart-data.model.ts` descrevendo a forma dos dados aceitos por todos os componentes.
- **Inputs obrigatórios**: `data: ChartData[]` e `title: string`.
- **Inputs opcionais com defaults**: `description?: string`, `height?: number` (default: 350), `colors?: string[]` (default: usa `ThemeConfig.primaryColor`), `showLegend?: boolean` (default: `true`), `orientation?: 'horizontal' | 'vertical'` (onde aplicável).
- **Dark mode**: cada componente injeta `ThemeService` e usa `computed()` para derivar as opções do ApexCharts (`theme: { mode: currentMode() }`). Quando o modo muda, o Signal atualiza as opções automaticamente.
- **Componentes a criar**:
  - `LineChartComponent` — gráfico de linha simples e multi-série
  - `BarChartComponent` — gráfico de barras (vertical e horizontal via `orientation`)
  - `AreaChartComponent` — gráfico de área com gradiente
  - `PieChartComponent` — gráfico de pizza e donut (via `donut?: boolean` input)
  - `TimeSeriesChartComponent` — série temporal com zoom/pan habilitado
  - `TimelineChartComponent` — gráfico de Gantt/timeline para eventos sequenciais
  - `MixedChartComponent` — combinação de linha + barra em um único gráfico
- **Responsividade**: todos os componentes usam `width: '100%'` no ApexCharts para ocupar o espaço disponível no container.

## Decisões de teste

- Testar que cada componente renderiza sem erros com o conjunto mínimo de inputs (`data` e `title`).
- Testar que inputs opcionais ausentes resultam nos defaults esperados nas opções do ApexCharts.
- Testar que o modo dark/light altera a propriedade `theme.mode` nas opções geradas.
- Não testar o DOM visual do ApexCharts (SVG renderizado) — o ApexCharts é uma dependência de terceiros, testar apenas os inputs que o componente passa a ele.

## Fora de escopo

- Exportação de gráfico para PNG/PDF
- Gráficos com edição interativa de dados (drag to resize, click to edit)
- Integração com WebSocket para dados em tempo real — cada projeto implementa conforme necessidade
- Tipos de gráfico não listados (candlestick, heatmap, treemap, etc.)

## Notas adicionais

- O `TimeSeriesChartComponent` é especialmente importante para sistemas como AIS (posições de embarcações ao longo do tempo) e Meteorologia (séries de temperatura, pressão, vento).
- Os dados mock usados nos componentes do dashboard devem ser suficientemente realistas para demonstrar o visual completo.
