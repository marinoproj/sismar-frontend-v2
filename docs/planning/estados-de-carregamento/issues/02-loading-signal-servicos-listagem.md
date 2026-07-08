Status: done

# Issue 02 — Convenção de sinal `loading` nas services de listagem

## Issue pai

`docs/planning/estados-de-carregamento/PRD.md`

## O que construir

`PortConfigService`, `TerminalConfigService`, `BerthConfigService`, `AreaService` e `PortsService` (sinal `summary`) passam a expor um sinal `loading: Signal<boolean>` explícito, independente do dado em si — `true` do início ao fim de qualquer busca disparada por esses serviços (inicial, ou recarregamento via busca/filtro/`reload$`), `false` ao final tanto em sucesso quanto em erro.

Esta issue estabelece a convenção e a aplica aos serviços orientados a `toSignal`/`switchMap` (listagens). O serviço de detalhes de porto (`PortsService.details`, carregado de forma imperativa) e a correção do bug de recarregamento por parâmetro de rota ficam na issue 03, por serem um caso à parte (bug fix, não só adição de sinal).

## Critérios de aceite

- [ ] `PortConfigService`, `TerminalConfigService`, `BerthConfigService`, `AreaService` e `PortsService.summary` expõem `loading: Signal<boolean>`.
- [ ] `loading` fica `true` assim que uma busca é disparada (inicial ou recarregamento) e volta para `false` ao final, tanto em sucesso quanto em erro.
- [ ] `loading` reflete corretamente buscas repetidas na mesma instância do serviço (ex.: digitar numa busca/filtro), não só a busca inicial.
- [ ] Testes cobrindo a alternância de `loading` em cada um desses serviços, usando um observable controlado manualmente para inspecionar o estado intermediário.

## Bloqueado por

Nenhum — pode começar imediatamente.
