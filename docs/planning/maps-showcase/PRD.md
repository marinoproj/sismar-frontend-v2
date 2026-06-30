Status: done

# PRD — Menu Maps: Mapa Interativo com Leaflet

## Declaração do problema

O sistema não possui capacidade de exibir informações geoespaciais. Usuários que precisam visualizar dados com componente geográfico (localização de filiais, rotas, áreas de cobertura) não têm uma tela ou componente disponível para isso.

## Solução

Criar um menu "Maps" (sem submenus) que leva a uma página com mapa interativo usando a biblioteca Leaflet. A página exibe markers, círculos e polígonos com dados fictícios (capitais brasileiras e regiões), alguns com tooltip ao clicar. Cada elemento do mapa é encapsulado em um componente Angular reutilizável.

## User stories

1. Como usuário, quero acessar "Maps" no menu lateral e ver um mapa interativo, para que eu visualize dados geoespaciais do sistema.
2. Como usuário, quero que o mapa carregue centralizado no Brasil com zoom adequado, para que a área de interesse seja imediatamente visível.
3. Como usuário, quero ver markers no mapa em localizações de capitais brasileiras fictícias, para que eu identifique pontos de interesse geograficamente.
4. Como usuário, quero clicar em um marker e ver um tooltip com informações da localização, para que eu obtenha detalhes sem sair da tela.
5. Como usuário, quero ver círculos no mapa representando áreas de cobertura fictícias, para que eu visualize raios de alcance geográfico.
6. Como usuário, quero clicar em um círculo e ver um tooltip descrevendo a área, para que eu entenda o que aquela região representa.
7. Como usuário, quero ver um polígono no mapa representando uma região fictícia, para que eu visualize delimitações geográficas.
8. Como usuário, quero clicar no polígono e ver um tooltip com o nome da região, para que eu identifique a área delimitada.
9. Como usuário, quero que o mapa seja responsivo e se ajuste ao tamanho da tela, para que funcione em desktop e mobile.
10. Como usuário, quero ver o breadcrumb "Maps" no topo da página, para que eu saiba onde estou na navegação.
11. Como desenvolvedor, quero usar `<app-map-marker [lat] [lng] [popupContent]>`, para que eu adicione markers reutilizáveis em outros contextos.
12. Como desenvolvedor, quero usar `<app-map-circle [center] [radius] [tooltipContent]>`, para que eu adicione áreas circulares reutilizáveis.
13. Como desenvolvedor, quero usar `<app-map-polygon [points] [tooltipContent]>`, para que eu adicione polígonos reutilizáveis.
14. Como desenvolvedor, quero que o `MapComponent` aceite `@Input() center`, `zoom` e `height`, para que eu configure o mapa ao instanciá-lo.

## Decisões de implementação

- **Instalação** — `npm install leaflet @types/leaflet`. CSS do Leaflet importado via `angular.json` (styles array) ou via `@import` em `styles.css`.

- **MapComponent** — `shared/ui/map/map.component.ts`. Wrapper Angular manual sem biblioteca de terceiros. Inicializa o mapa via `ngAfterViewInit` usando a API do Leaflet diretamente. `@Input()`: `center: [number, number]` (padrão: [-15.78, -47.93] — Brasília), `zoom: number` (padrão: 5), `height: string` (padrão: '500px'). Referência ao elemento DOM via `@ViewChild` + `ElementRef`. Responsabilidade: inicializar `L.map()` e expor o objeto `map` para os componentes filho via serviço ou referência direta.

- **Estratégia de componentes filho** — `MapMarkerComponent`, `MapCircleComponent` e `MapPolygonComponent` são componentes Angular sem template visual próprio; eles recebem a instância `L.Map` via serviço `MapService` (providedIn scoped ao componente pai ou via `inject`) e adicionam suas camadas ao mapa via `ngOnInit`/`ngOnDestroy`. Remove a camada no `ngOnDestroy` para evitar vazamento de memória.

- **MapMarkerComponent** — `shared/ui/map/`. `@Input()`: `lat: number`, `lng: number`, `title?: string`, `popupContent?: string`. Adiciona `L.marker([lat, lng])` ao mapa; se `popupContent`, vincula `bindPopup()` (tooltip ao clicar).

- **MapCircleComponent** — `shared/ui/map/`. `@Input()`: `center: [number, number]`, `radius: number` (metros), `color?: string`, `tooltipContent?: string`. Adiciona `L.circle()` com `bindPopup()` quando `tooltipContent` presente.

- **MapPolygonComponent** — `shared/ui/map/`. `@Input()`: `points: [number, number][]`, `color?: string`, `tooltipContent?: string`. Adiciona `L.polygon()` com `bindPopup()` quando `tooltipContent` presente.

- **MapsPage** — `features/maps/pages/maps-page/`. Usa `<app-map>` com filhos `<app-map-marker>` x 5, `<app-map-circle>` x 2, `<app-map-polygon>` x 1. Todos com dados fictícios de cidades e regiões brasileiras.

- **Rota** — `/maps` lazy-loaded via `features/maps/routes.ts` com `data: { breadcrumb: 'Maps' }`.

- **Tile layer** — OpenStreetMap gratuito (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) com atribuição adequada.

## Decisões de teste

- Testes automatizados fora de escopo.
- Validação manual: acessar `/maps` e verificar que o mapa carrega; clicar em um marker e verificar que o popup aparece; clicar em um círculo e verificar tooltip; clicar no polígono e verificar tooltip; redimensionar a janela e verificar responsividade.

## Fora de escopo

- Dados reais de geolocalização.
- Clustering de markers.
- Rotas (polylines).
- Geocoding ou busca de endereços.
- Testes automatizados.

## Notas adicionais

Depende do PRD `infraestrutura-ui` para menu e breadcrumb. O `MapComponent` e seus filhos são os únicos componentes novos; não há dependência dos outros PRDs de showcase. O CSS do Leaflet deve ser importado globalmente para que os tiles e controles renderizem corretamente.
