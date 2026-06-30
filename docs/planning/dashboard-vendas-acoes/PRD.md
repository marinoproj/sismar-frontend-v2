Status: done

# PRD — Dashboards: Vendas e Ações

## Declaração do problema

O sistema possui um único dashboard genérico em `/dashboard` que não diferencia métricas de vendas de indicadores de portfólio financeiro. Usuários que precisam analisar desempenho comercial e acompanhar ações/ativos operam na mesma tela sem contexto adequado, dificultando a leitura e interpretação dos dados.

## Solução

Transformar o Dashboard em um menu pai com dois submenus especializados:

- **Vendas** (`/dashboard/vendas`): conteúdo atual do dashboard (KPIs de produtos/usuários/receita, gráficos de vendas, tabela de pedidos) refatorado e renomeado.
- **Ações** (`/dashboard/acoes`): nova página com tema financeiro — KPIs de portfólio, cards de cotação fictícios (tickers), gráfico de composição de carteira (donut), gráfico de evolução de portfólio (linha) e tabela de operações recentes.

## User stories

1. Como usuário, quero acessar "Dashboard > Vendas" no menu, para que eu veja métricas de desempenho comercial (produtos, receita, pedidos).
2. Como usuário, quero acessar "Dashboard > Ações" no menu, para que eu veja indicadores do meu portfólio de ativos financeiros.
3. Como usuário, quero que `/dashboard` me redirecione automaticamente para `/dashboard/vendas`, para que links antigos continuem funcionando.
4. Como usuário, quero ver 4 KPI cards no topo da página Vendas (Total Produtos, Total Usuários, Receita Total, Total Vendas), para que eu tenha uma visão rápida dos principais indicadores.
5. Como usuário, quero ver gráficos de linha, barra e área na página Vendas, para que eu visualize tendências ao longo do tempo.
6. Como usuário, quero ver uma tabela de pedidos recentes na página Vendas com colunas de cliente, produto, quantidade, valor, status e data, para que eu acompanhe as transações mais recentes.
7. Como usuário, quero ver 4 KPI cards no topo da página Ações (Valor Total da Carteira, Rentabilidade, Número de Ativos, Operações no Mês), para que eu tenha visão consolidada do portfólio.
8. Como usuário, quero ver cards de cotação de tickers fictícios na página Ações (ex: PETR4, VALE3, ITUB4, BBDC4, WEGE3, MGLU3) com valor atual e variação percentual, para que eu acompanhe a performance individual de cada ativo.
9. Como usuário, quero que os cards de cotação mostrem variação positiva em verde e negativa em vermelho, para que eu identifique rapidamente ganhos e perdas.
10. Como usuário, quero ver um gráfico donut na página Ações mostrando a composição da carteira (Ações, FIIs, Renda Fixa), para que eu entenda a diversificação do portfólio.
11. Como usuário, quero ver um gráfico de linha na página Ações mostrando a evolução do valor da carteira nos últimos 12 meses, para que eu acompanhe o desempenho histórico.
12. Como usuário, quero ver uma tabela de operações recentes na página Ações com colunas de data, ticker, tipo (Compra/Venda), quantidade, preço unitário e total, para que eu revise o histórico de transações.
13. Como usuário, quero que ambos os dashboards exibam o breadcrumb correto (ex: "Dashboards > Vendas"), para que eu saiba onde estou na navegação.
14. Como desenvolvedor, quero que o `TickerCardComponent` aceite `@Input()` para symbol, name, currentValue, change e trend, para que seja reutilizável em outras páginas.
15. Como desenvolvedor, quero que os dados dos dashboards venham de repositórios mock separados (VendasMockRepository, AcoesMockRepository), para que a substituição por dados reais de API seja feita no futuro sem alterar as páginas.

## Decisões de implementação

- **VendasPageComponent** — o `DashboardPageComponent` atual é movido para `features/dashboard/pages/vendas-page/`. A rota `dashboard/vendas` aponta para ele. Mínimas alterações de conteúdo: apenas atualização de breadcrumb data na rota e ajuste de título interno.

- **AcoesPageComponent** — nova página em `features/dashboard/pages/acoes-page/`. Layout: linha de 4 KPI cards → linha de 6 TickerCards → linha com PieChart (donut, 1/3 da largura) + LineChart (2/3) → TableComponent com operações recentes.

- **TickerCardComponent** — novo componente em `features/dashboard/components/ticker-card/`. Inputs: `symbol: string`, `name: string`, `currentValue: number`, `change: number` (percentual), `trend: 'up' | 'down'`. Exibe: símbolo em negrito, nome, valor formatado como moeda, badge de variação com cor condicional (verde/vermelho) e mini ícone de seta.

- **Dados mock** — `AcoesMockRepository` em `features/dashboard/repositories/` retorna dados fictícios de portfólio via serviço. Tickers fictícios com valores e variações estáticas.

- **Rota** — `/dashboard` redireciona para `/dashboard/vendas` (configurado no PRD de infraestrutura-ui). As rotas `vendas` e `acoes` carregam `data: { breadcrumb: 'Vendas' }` e `data: { breadcrumb: 'Ações' }` respectivamente.

- **Reutilização de gráficos** — `AcoesPageComponent` usa `PieChartComponent` com configuração de donut via `@Input()` e `LineChartComponent` com dados de evolução mensal. Nenhum novo componente de gráfico é criado.

## Decisões de teste

- Testes automatizados estão fora de escopo.
- Validação manual: acessar `/dashboard/vendas` e verificar KPIs + gráficos + tabela; acessar `/dashboard/acoes` e verificar KPIs + tickers + donut + linha + tabela de operações; acessar `/dashboard` e confirmar redirect para `/dashboard/vendas`.

## Fora de escopo

- Dados reais de mercado financeiro (tudo é mock estático).
- Filtros de data ou período nos dashboards.
- Exportação de dados.
- Testes automatizados.

## Notas adicionais

Depende do PRD `infraestrutura-ui` para que as rotas, o menu com submenus e o breadcrumb estejam disponíveis.
