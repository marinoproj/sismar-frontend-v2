Status: done

# PRD — Menu Charts: Showcase de Tipos de Gráfico

## Declaração do problema

Desenvolvedores que trabalham no sistema não têm uma referência visual centralizada dos tipos de gráficos disponíveis, suas variações e as propriedades de configuração aceitas. Isso gera escolhas inconsistentes de visualização e retrabalho ao integrar gráficos em novas telas.

## Solução

Criar um menu "Charts" com cinco subpáginas de showcase, cada uma dedicada a um tipo de gráfico e exibindo duas ou três variações com dados fictícios. Os componentes ApexCharts já existentes em `shared/ui/charts/` são reutilizados diretamente, sem modificação.

## User stories

1. Como desenvolvedor, quero acessar "Charts > Line Charts" no menu, para que eu veja exemplos de gráficos de linha com variações de dados e título.
2. Como desenvolvedor, quero acessar "Charts > Bar Charts" no menu, para que eu veja exemplos de gráficos de barra (vertical e horizontal).
3. Como desenvolvedor, quero acessar "Charts > Mixed Charts" no menu, para que eu veja exemplos de gráficos combinados (linha + barra no mesmo eixo).
4. Como desenvolvedor, quero acessar "Charts > Timeline Charts" no menu, para que eu veja exemplos de gráficos de linha do tempo com faixas de evento.
5. Como desenvolvedor, quero acessar "Charts > Pie Charts" no menu, para que eu veja exemplos de gráficos de pizza e donut.
6. Como usuário, quero que cada página de charts exiba o breadcrumb correto (ex: "Charts > Line Charts"), para que eu saiba onde estou na navegação.
7. Como desenvolvedor, quero que cada instância de gráfico em uma página de showcase tenha um título e dados distintos, para que eu perceba as possibilidades de personalização.
8. Como desenvolvedor, quero que os gráficos de showcase respondam ao tema claro/escuro da aplicação, para que eu veja como ficam em ambos os modos.
9. Como usuário, quero que as páginas de Charts sejam acessíveis via menu lateral com submenus colapsáveis, para que a navegação seja consistente com o restante do sistema.

## Decisões de implementação

- **Rotas** — `/charts/line`, `/charts/bar`, `/charts/mixed`, `/charts/timeline`, `/charts/pie`. Lazy-loaded via `features/charts/routes.ts`. Cada rota com `data: { breadcrumb: 'Line Charts' }` etc.

- **Componentes de gráfico** — zero novos componentes de gráfico são criados. Cada página usa os componentes já existentes:
  - `LineChartComponent` → páginas de Line Charts e como base visual em outros
  - `BarChartComponent` → Bar Charts
  - `MixedChartComponent` → Mixed Charts
  - `TimelineChartComponent` → Timeline Charts
  - `PieChartComponent` → Pie Charts (configurado para pizza e para donut)

- **Dados mock inline** — cada page component define arrays de dados fictícios localmente (sem serviço separado), suficientes para preencher 2–3 instâncias do componente de gráfico.

- **Layout das páginas** — grade responsiva: 1 coluna em mobile, 2 colunas em desktop. Cada gráfico em card com título e subtítulo explicativo.

- **Sem novos componentes compartilhados** — os charts pages são standalone components em `features/charts/pages/` que importam diretamente os chart components de `shared/ui/charts/`.

## Decisões de teste

- Testes automatizados fora de escopo.
- Validação manual: navegar por cada submenu e verificar que o tipo correto de gráfico é exibido com dados visíveis e responsivo ao tema.

## Fora de escopo

- Gráficos de área e time-series (já existem como componentes mas não fazem parte dos 5 tipos solicitados; permanecem disponíveis para uso em outros contextos).
- Interatividade avançada (filtros, exportação de imagem).
- Testes automatizados.

## Notas adicionais

Depende do PRD `infraestrutura-ui` para que o menu "Charts" com submenus e o breadcrumb estejam disponíveis. As páginas são independentes entre si e podem ser implementadas em paralelo após a infraestrutura estar pronta.
