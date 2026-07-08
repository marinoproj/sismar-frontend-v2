Status: done

# Issue 03 — Corrigir recarregamento ao trocar de porto em `/ports/:id` + loading dos detalhes

## Issue pai

`docs/planning/estados-de-carregamento/PRD.md`

## O que construir

Hoje `PortDetailsPageComponent` carrega os detalhes do porto uma única vez, no construtor, usando o `:id` da rota no momento da criação do componente. Como o Angular reaproveita a mesma instância do componente ao navegar entre `/ports/1` e `/ports/2` (mesmo `routeConfig`, parâmetro diferente), essa busca nunca é refeita — os dados do porto anterior podem permanecer na tela indefinidamente ao trocar de porto sem sair da rota.

`PortDetailsPageComponent` passa a reagir a mudanças no parâmetro de rota (`ActivatedRoute.paramMap` ou equivalente) e disparar um novo carregamento a cada mudança de `:id`, não só na criação do componente.

`PortsService` ganha um sinal `detailsLoading: Signal<boolean>` (mesma convenção da issue 02), ligado ao carregamento de detalhes — `true` do início ao fim de cada chamada, incluindo as disparadas por mudança de parâmetro de rota.

## Critérios de aceite

- [ ] Navegar de `/ports/1` para `/ports/2` (sem sair da rota) dispara uma nova busca dos detalhes do porto 2, mesmo que o componente não seja destruído/recriado.
- [ ] `PortsService.detailsLoading` fica `true` durante qualquer busca de detalhes (inicial ou por troca de parâmetro) e `false` ao final, em sucesso ou erro.
- [ ] Os dados do porto anterior não continuam expostos como se fossem do novo porto após a troca (o sinal de dado é atualizado corretamente para o novo `:id`).
- [ ] Teste simulando uma mudança de `ActivatedRoute.paramMap` de um ID para outro, verificando que uma nova busca é disparada e `detailsLoading` alterna corretamente — sem depender de destruir/recriar o componente no teste.

## Bloqueado por

Nenhum — pode começar imediatamente.
