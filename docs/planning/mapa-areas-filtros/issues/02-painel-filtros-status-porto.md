Status: done

# Issue 02 — Painel de filtros por Status e Porto no mapa

## Issue pai

`docs/planning/mapa-areas-filtros/PRD.md`

## O que construir

Um painel de filtros próprio do app (não o controle nativo `L.control.layers` do Leaflet) fixo no canto superior direito do mapa (modo Mapa da tela de Áreas), com duas seções:

- **Status**: checkboxes "Ativa" e "Inativa".
- **Porto**: um checkbox por porto que tenha ao menos uma área cadastrada (derivado das áreas carregadas, não da lista completa de portos do sistema), mais uma opção fixa "Sem porto" para áreas sem `portId`.

Todos os checkboxes vêm marcados por padrão ao entrar no modo Mapa (nada fica oculto de início). O painel pode ser recolhido/expandido através de um botão, e não conflita visualmente com o painel de "Modo de desenho" já existente (canto superior esquerdo).

Uma área só permanece visível se atender aos dois critérios simultaneamente (status marcado E porto marcado — combinação, não união). O cálculo de `fitBounds` passa a considerar apenas as áreas atualmente visíveis conforme os filtros aplicados, recalculando a cada mudança nos filtros.

O estado dos filtros vive localmente no componente do mapa, resetando para "tudo marcado" sempre que o modo Mapa é reaberto (não persiste entre sessões).

## Critérios de aceite

- [ ] Painel de filtros aparece no canto superior direito do mapa, com checkboxes de Status e Porto.
- [ ] Todos os checkboxes vêm marcados por padrão.
- [ ] Lista de portos no filtro inclui apenas portos com pelo menos uma área cadastrada, mais "Sem porto".
- [ ] Desmarcar "Inativa" oculta as áreas inativas sem afetar as ativas (e vice-versa).
- [ ] Desmarcar um porto oculta apenas as áreas daquele porto; desmarcar "Sem porto" oculta as áreas sem `portId`.
- [ ] Os dois filtros se combinam (uma área some se falhar em qualquer um dos dois critérios).
- [ ] `fitBounds` recalcula considerando só as áreas visíveis após cada mudança de filtro.
- [ ] Painel pode ser recolhido/expandido sem perder o estado dos filtros.
- [ ] Painel de filtros não sobrepõe o painel de "Modo de desenho".
- [ ] Lógica de "quais áreas passam pelos filtros" e "quais portos aparecem como opção" extraída em função(ões) pura(s) testável(is).
- [ ] Testes cobrindo: estado padrão (tudo marcado/visível), filtragem por status isolado, filtragem por porto isolado (incluindo "Sem porto"), combinação dos dois filtros.

## Bloqueado por

- Issue 01 (Exibir áreas inativas no mapa com estilo diferenciado)
