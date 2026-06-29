Status: done

# PRD — Página de Dashboard de Exemplo

## Declaração do problema

O projeto base precisa demonstrar, de forma concreta e funcional, como usar os componentes reutilizáveis de gráfico e tabela em uma feature real. Sem uma página de dashboard de exemplo, o desenvolvedor que clonar o projeto base não tem referência clara de como compor os componentes, quais dados passar e como estruturar uma feature completa seguindo a arquitetura definida.

## Solução

Uma feature `dashboard` em `src/app/features/dashboard/` que implementa uma página de dashboard completa com dados mockados. A página exibe todos os 7 tipos de gráfico (linha, barra, área, pizza, série temporal, timeline, misto) e a tabela com paginação, cada um usando os componentes reutilizáveis de `shared/ui/`. A feature segue a arquitetura completa: `pages/`, `components/`, `services/`, `repositories/`, `models/`, `routes.ts`.

## User stories

1. Como desenvolvedor clonando o projeto base, quero ver uma página de dashboard funcional ao acessar `/dashboard`, para que eu tenha referência visual e de código de como usar os componentes.
2. Como desenvolvedor, quero que o dashboard use dados mockados realistas, para que os gráficos demonstrem o visual completo com dados variados.
3. Como desenvolvedor, quero que cada gráfico no dashboard seja um componente filho com dados passados via `@Input()`, para que eu veja na prática o padrão de uso dos componentes reutilizáveis.
4. Como desenvolvedor, quero que o repositório do dashboard use a interface de repositório abstrato com implementação mock, para que eu entenda o padrão de camada de dados da arquitetura.
5. Como desenvolvedor, quero que a rota `/dashboard` seja lazy-loaded, para que eu veja o padrão de lazy loading da arquitetura em prática.
6. Como usuário, quero que o dashboard seja responsivo e funcional em mobile e desktop, para que o layout se comporte corretamente em qualquer tela.
7. Como desenvolvedor, quero que a estrutura de pastas da feature dashboard sirva de template para criar novas features, para que eu saiba exatamente o que criar ao adicionar um novo domínio ao sistema.
8. Como desenvolvedor, quero ver a tabela com skeleton loading inicial e dados mockados após um delay simulado, para que o comportamento de loading seja demonstrado.

## Decisões de implementação

- **Estrutura da feature**:
  ```
  src/app/features/dashboard/
  ├── pages/
  │   └── dashboard-page/
  ├── components/
  │   └── kpi-card/
  ├── services/
  │   └── dashboard.service.ts
  ├── repositories/
  │   ├── dashboard.repository.ts      (interface/classe abstrata)
  │   └── dashboard-mock.repository.ts (implementação mock)
  ├── models/
  │   └── dashboard.model.ts
  └── routes.ts
  ```
- **`DashboardRepository`**: classe abstrata com método `getSummary(): Observable<DashboardSummary>`. `DashboardMockRepository` implementa retornando dados estáticos com `delay(800)` para simular latência.
- **`DashboardService`**: injeta o repositório e expõe os dados como Signals via `toSignal()`.
- **`DashboardPageComponent`**: injeta `DashboardService` e passa os dados para cada componente filho.
- **`KpiCardComponent`**: componente em `components/kpi-card/` exibindo métrica com ícone, valor e variação percentual (inspirado nos cards do template Xintra).
- **Dados mock**: valores realistas para todos os tipos de gráfico. Exemplos:
  - LineChart: vendas mensais dos últimos 12 meses
  - BarChart: comparativo de categorias (vertical)
  - AreaChart: receita acumulada mensal
  - PieChart: distribuição por categoria de produto
  - TimeSeriesChart: série horária dos últimos 7 dias
  - TimelineChart: etapas de processo com início e fim
  - MixedChart: volume (barra) + tendência (linha)
  - Tabela: lista de 20 registros fictícios com paginação simulada (5 por página)
- **Layout da página**: grid responsivo com `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` para os KPI cards; seções de gráfico em `grid-cols-1 lg:grid-cols-2`; tabela em largura total.
- **Rota**: `/dashboard` lazy-loaded em `app.routes.ts` via `loadChildren` apontando para `dashboard/routes.ts`. Protegida por `authGuard`.
- **Token de repositório**: o `DashboardMockRepository` é provido via token em `routes.ts` para que o `DashboardService` dependa da abstração, não da implementação concreta.

## Decisões de teste

- Testar `DashboardService`: chama `DashboardRepository.getSummary()` e retorna os dados como Signal.
- Testar `DashboardPageComponent`: renderiza sem erros com dados mockados; todos os componentes de gráfico e a tabela estão presentes no DOM.
- Não testar o visual dos gráficos — o ApexCharts é uma dependência de terceiros.

## Fora de escopo

- Filtros de data interativos no dashboard
- Exportação de dados do dashboard
- Atualização automática dos dados (polling/WebSocket)
- Múltiplos dashboards (o projeto base inclui apenas um)
- Dados reais de backend — o dashboard usa exclusivamente dados mockados

## Notas adicionais

- A estrutura da feature `dashboard` deve ser comentada no `README.md` como referência para criação de novas features.
- O `DashboardMockRepository` permanece no projeto base como referência; projetos derivados substituem por `DashboardHttpRepository`.
