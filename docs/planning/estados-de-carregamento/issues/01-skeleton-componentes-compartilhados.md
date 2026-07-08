Status: done

# Issue 01 — Loading/skeleton nos componentes compartilhados (cards + gráficos)

## Issue pai

`docs/planning/estados-de-carregamento/PRD.md`

## O que construir

Novo componente compartilhado `SkeletonComponent` (`shared/ui/skeleton/`), com uma variação de tamanho/forma por tipo de consumidor (`variant: 'card' | 'chart'`), usando o mesmo efeito `animate-pulse` já usado pelas linhas de esqueleto do `TableComponent`.

`KpiCardComponent`, `StatCardComponent`, `TickerCardComponent` e os 7 componentes de gráfico (`LineChart`, `BarChart`, `AreaChart`, `MixedChart`, `PieChart`, `TimelineChart`, `TimeSeriesChart`) ganham um novo input `loading` (padrão `false`). Quando `true`, cada um renderiza o `SkeletonComponent` (variante apropriada) no lugar do conteúdo real; quando `false` (padrão), o comportamento visual permanece idêntico ao atual.

Esta issue é só sobre os componentes do catálogo — nenhuma página precisa ser conectada ainda (isso é a issue 04).

## Critérios de aceite

- [ ] `SkeletonComponent` existe no catálogo compartilhado, com variantes `card` e `chart`.
- [ ] `KpiCardComponent`, `StatCardComponent`, `TickerCardComponent` aceitam `[loading]`; quando `true`, mostram o esqueleto em vez do conteúdo.
- [ ] Os 7 componentes de gráfico aceitam `[loading]`; quando `true`, mostram o esqueleto em vez do gráfico.
- [ ] Com `loading` ausente ou `false`, nenhum componente muda de comportamento em relação ao estado atual (sem regressão nas páginas de demonstração existentes).
- [ ] Testes cobrindo `loading=true`/`false` para `SkeletonComponent`, os 3 cards e ao menos um representante de gráfico (padrão a replicar nos demais).

## Bloqueado por

Nenhum — pode começar imediatamente.
