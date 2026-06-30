Status: done

## Issue pai

[PRD — Menu Maps: Mapa Interativo com Leaflet](../PRD.md)

## O que construir

Criar os componentes de elementos do mapa (`MapMarkerComponent`, `MapCircleComponent`, `MapPolygonComponent`) e atualizar a `MapsPageComponent` com dados fictícios de localizações brasileiras usando esses componentes.

Cada componente é um Angular component sem template visual próprio — ele injeta o `MapService` para obter a instância `L.Map` e adiciona/remove sua camada via `ngOnInit`/`ngOnDestroy`.

**MapMarkerComponent** (`shared/ui/map/`): `@Input()` `lat: number`, `lng: number`, `title?: string`, `popupContent?: string`. Adiciona `L.marker()` ao mapa; vincula `bindPopup(popupContent)` quando fornecido.

**MapCircleComponent** (`shared/ui/map/`): `@Input()` `center: [number, number]`, `radius: number` (metros), `color?: string` (default: cor primária do tema), `tooltipContent?: string`. Adiciona `L.circle()` com `bindPopup()` quando `tooltipContent` presente.

**MapPolygonComponent** (`shared/ui/map/`): `@Input()` `points: [number, number][]`, `color?: string`, `tooltipContent?: string`. Adiciona `L.polygon()` com `bindPopup()` quando `tooltipContent` presente.

**MapsPageComponent atualizada**: usa `<app-map>` com filhos declarados no template:
- 5 `<app-map-marker>` em capitais fictícias com popup descritivo (ex: "São Paulo — Filial SP")
- 2 `<app-map-circle>` representando áreas de cobertura (ex: raio de 200km de BH e de Recife)
- 1 `<app-map-polygon>` delimitando uma região fictícia (ex: triângulo no Centro-Oeste)

Clicando em qualquer elemento com `popupContent`/`tooltipContent`, um popup Leaflet aparece sobre o elemento.

O resultado observável: a página `/maps` exibe mapa com markers clicáveis, áreas circulares e um polígono, todos com tooltips ao clicar.

## Critérios de aceite

- [ ] `MapMarkerComponent` criado em `shared/ui/map/`.
- [ ] `MapCircleComponent` criado em `shared/ui/map/`.
- [ ] `MapPolygonComponent` criado em `shared/ui/map/`.
- [ ] Cada componente adiciona sua camada ao mapa no `ngOnInit` e remove no `ngOnDestroy`.
- [ ] `MapsPageComponent` usa os 3 tipos de componente com dados fictícios de localidades brasileiras.
- [ ] Ao menos 5 markers visíveis no mapa.
- [ ] Ao menos 2 círculos visíveis com cores distintas.
- [ ] Ao menos 1 polígono visível.
- [ ] Clicar em markers com `popupContent` exibe popup.
- [ ] Clicar em círculos/polígonos com `tooltipContent` exibe popup.
- [ ] Alguns elementos não têm popup (para demonstrar que é opcional).
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [maps-showcase/01 — Leaflet Base](01-maps-leaflet-base.md)
