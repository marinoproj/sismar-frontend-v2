Status: done

# Issue 04 — Modo Mapa (visualização)

## Issue pai

`docs/planning/configuracoes-areas/PRD.md`

## O que construir

Implementar o conteúdo real do Modo Mapa (substituindo o placeholder da issue 01), reutilizando `MapComponent`/`MapPolygonComponent` já existentes em `shared/ui/map/`. Renderizar todas as áreas com `active === true` como polígonos com borda verde e preenchimento verde translúcido, exibindo o nome da área junto à primeira coordenada do seu perímetro (tooltip/label).

Ao entrar no Modo Mapa (ou ao carregar a página, se o mapa já estiver montado), calcular o bounding box a partir das coordenadas de todas as áreas ativas (`L.latLngBounds` + `map.fitBounds`) e ajustar zoom/centro automaticamente para enquadrar todo o conjunto. Se não houver nenhuma área ativa, manter o center/zoom padrão já existente no `MapComponent` (Brasília, zoom 5) em vez de tentar calcular bounds vazios.

A alternância entre Modo Tabela e Modo Mapa não deve perder a busca/filtro já aplicado no Modo Tabela (estado local do componente da página, sem recarregar dados desnecessariamente).

## Critérios de aceite

- [ ] Modo Mapa desenha todas as áreas ativas como polígonos com borda verde e preenchimento verde translúcido.
- [ ] Nome da área aparece junto à primeira coordenada do seu perímetro.
- [ ] Áreas inativas não são desenhadas no mapa.
- [ ] Ao abrir/entrar no Modo Mapa, zoom e centro se ajustam automaticamente para enquadrar todas as áreas ativas.
- [ ] Sem nenhuma área ativa, o mapa cai no center/zoom padrão do `MapComponent`, sem erro.
- [ ] Alternar entre Tabela e Mapa preserva a busca/filtro aplicado na tabela.

## Bloqueado por

- Issue 01 (menu, rota, repositório e listagem em tabela).
