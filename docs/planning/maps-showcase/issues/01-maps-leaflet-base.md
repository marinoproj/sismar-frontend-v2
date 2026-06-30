Status: done

## Issue pai

[PRD — Menu Maps: Mapa Interativo com Leaflet](../PRD.md)

## O que construir

Instalar o Leaflet, criar o `MapComponent` (wrapper Angular manual) e o `MapService`, criar o módulo de rotas `features/maps/routes.ts` e a `MapsPageComponent` com o mapa inicializado — sem elementos geográficos ainda (markers, círculos, polígonos vêm na issue 02).

**Instalação**: `npm install leaflet @types/leaflet`. CSS do Leaflet adicionado ao array `styles` em `angular.json`.

**MapService** (`shared/ui/map/map.service.ts`): serviço não-root (fornecido no nível do `MapComponent` ou da página) que mantém a referência ao objeto `L.Map` e expõe métodos para que componentes filho adicionem e removam camadas.

**MapComponent** (`shared/ui/map/map.component.ts`): `@Input()` `center: [number, number]` (default: [-15.78, -47.93]), `zoom: number` (default: 5), `height: string` (default: '500px'). Inicializa `L.map()` via `ngAfterViewInit` usando `@ViewChild` para o elemento DOM. Adiciona tile layer OpenStreetMap. Destrói o mapa em `ngOnDestroy`.

**MapsPageComponent** (`features/maps/pages/maps-page/`): usa `<app-map>` com as configs default. O mapa renderiza vazio (sem elementos) nesta issue.

O resultado observável: acessar `/maps` exibe um mapa interativo centralizado no Brasil com tiles do OpenStreetMap carregados.

## Critérios de aceite

- [ ] `leaflet` e `@types/leaflet` instalados no `package.json`.
- [ ] CSS do Leaflet importado globalmente (sem erros de estilo nos controles do mapa).
- [ ] `MapComponent` criado em `shared/ui/map/`.
- [ ] `MapService` criado em `shared/ui/map/` (não providedIn root; escopo de mapa).
- [ ] `features/maps/routes.ts` criado com rota `/maps` → `MapsPageComponent`.
- [ ] `MapsPageComponent` criada e acessível em `/maps`.
- [ ] Mapa renderiza centralizado em Brasília com zoom 5 e tiles OpenStreetMap visíveis.
- [ ] Mapa é destruído corretamente no `ngOnDestroy` (sem erros ao sair e voltar para a página).
- [ ] Breadcrumb exibe "Maps".
- [ ] Funciona em tema claro e escuro (tiles do mapa são independentes do tema da app).

## Bloqueado por

- [infraestrutura-ui/02 — Routing skeleton](../../infraestrutura-ui/issues/02-routing-skeleton.md)
- [infraestrutura-ui/03 — Breadcrumb](../../infraestrutura-ui/issues/03-breadcrumb-component.md)
