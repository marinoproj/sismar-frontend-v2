Status: done

# Issue 01 — Exibir áreas inativas no mapa com estilo diferenciado

## Issue pai

`docs/planning/mapa-areas-filtros/PRD.md`

## O que construir

O modo Mapa da tela de Áreas passa a desenhar **todas** as áreas (ativas e inativas), não só as ativas:

- **Ativas**: mantém o estilo atual (polígono verde `#22c55e`, preenchimento translúcido, rótulo com o nome sem badge).
- **Inativas**: polígono cinza tracejado (`color: '#9ca3af'`, `dashArray: '6 4'`, preenchimento translúcido), e o rótulo do nome ganha um badge "Inativo" ao final, construído com HTML/estilos inline (o rótulo é renderizado via `divIcon` do Leaflet, fora da árvore Angular — mesma técnica já usada para o nome em si, já que não pode depender de classes Tailwind/tema).

O cálculo de `fitBounds` (auto-zoom) passa a considerar todas as áreas exibidas (ativas + inativas), não só as ativas como hoje.

Esta issue não inclui o painel de filtros (issue 02) — todas as áreas ficam sempre visíveis ao final desta issue.

## Critérios de aceite

- [ ] Áreas inativas aparecem no mapa (hoje não aparecem).
- [ ] Áreas inativas têm polígono cinza tracejado, visualmente distinto do verde das ativas.
- [ ] O rótulo de áreas inativas mostra o nome seguido de um badge "Inativo".
- [ ] O rótulo de áreas ativas permanece igual ao atual (sem badge).
- [ ] `fitBounds` do mapa considera tanto áreas ativas quanto inativas ao ajustar zoom/centro.
- [ ] Lógica de estilo/rótulo por status é extraída em função(ões) pura(s) testável(is), seguindo o padrão de `area-map-bounds.ts`.
- [ ] Testes cobrindo a função pura de resolução de estilo por status e o comportamento do `fitBounds` considerando ambos os status.

## Bloqueado por

Nenhum — pode começar imediatamente.
