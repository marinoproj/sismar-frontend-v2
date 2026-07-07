Status: done

# PRD — Áreas inativas e filtros (Status/Porto) no modo Mapa

## Declaração do problema

Hoje o modo Mapa da tela de configuração de Áreas (`settings/areas`) só desenha as áreas **ativas** — áreas inativas simplesmente não aparecem, mesmo estando cadastradas. Isso torna o mapa uma visão parcial do cadastro: um usuário não consegue, por exemplo, verificar visualmente o perímetro de uma área recém-criada (que nasce sempre inativa) sem ativá-la antes, nem comparar áreas ativas e inativas lado a lado. Também não existe nenhuma forma de filtrar o que é exibido no mapa — conforme a quantidade de áreas e portos cresce, o mapa tende a ficar poluído sem uma forma de restringir a visualização.

## Solução

O modo Mapa passa a desenhar **todas** as áreas, ativas e inativas, com um estilo visual claramente distinto para cada estado:

- **Ativas**: mantém o estilo atual (verde, preenchimento translúcido).
- **Inativas**: polígono cinza tracejado (preenchimento translúcido), e o rótulo do nome ganha um badge "Inativo" ao final — replicando visualmente o badge já usado na tabela, mas como HTML inline (o rótulo do mapa é renderizado via `divIcon` do Leaflet, fora da árvore de componentes Angular, então não pode depender de classes Tailwind/tema — mesma razão pela qual o rótulo de nome já usa estilos inline hoje).

Um painel de filtros próprio do app (não o controle nativo do Leaflet) fica fixo no canto superior direito do mapa, com duas seções:

- **Status**: checkboxes "Ativa" e "Inativa".
- **Porto**: um checkbox por porto que tenha ao menos uma área cadastrada, mais uma opção fixa "Sem porto" para áreas sem `portId`.

Todos os checkboxes vêm marcados por padrão (nada fica oculto ao entrar no modo Mapa). O painel pode ser recolhido/expandido através de um botão, e não conflita com o painel de "Modo de desenho" já existente (canto superior esquerdo). O auto-zoom do mapa (`fitBounds`) passa a considerar as áreas atualmente visíveis conforme os filtros aplicados, em vez de sempre considerar só as ativas.

## User stories

1. Como usuário no modo Mapa, quero ver as áreas inativas desenhadas no mapa (não só as ativas), para que eu tenha uma visão completa do cadastro sem precisar ativar cada área antes.
2. Como usuário, quero que as áreas inativas apareçam com um estilo visual diferente das ativas (cor cinza, traço tracejado), para que eu identifique de relance quais áreas ainda não estão ativas.
3. Como usuário, quero ver um badge "Inativo" ao final do nome de cada área inativa no mapa, para que fique inequívoco o status daquela área mesmo sem prestar atenção à cor do polígono.
4. Como usuário, quero que áreas ativas continuem exibidas exatamente como hoje (nome sem badge, polígono verde), para que não haja ruído visual extra onde não é necessário.
5. Como usuário no modo Mapa, quero um painel de filtros no canto superior direito do mapa, para que eu possa restringir o que é exibido.
6. Como usuário, quero filtrar por Status (Ativa/Inativa) através de checkboxes, para que eu veja só o que me interessa no momento.
7. Como usuário, quero filtrar por Porto através de checkboxes (um por porto com área cadastrada, mais "Sem porto"), para que eu foque no(s) porto(s) que estou analisando.
8. Como usuário, quero que todos os filtros venham marcados por padrão ao entrar no modo Mapa, para que eu veja tudo de início e só restrinja se quiser.
9. Como usuário, quero poder recolher/expandir o painel de filtros, para que ele não ocupe espaço na tela quando eu não precisar ajustá-lo.
10. Como usuário, quero que o zoom automático do mapa considere apenas as áreas atualmente visíveis (conforme os filtros aplicados), para que o mapa não centralize em áreas que estou ocultando.
11. Como usuário, quero que os filtros de Status e Porto se combinem (uma área só aparece se atender aos dois: status marcado E porto marcado), para que eu consiga cruzar os dois critérios.

## Decisões de implementação

- O painel de filtros é implementado como componente Angular próprio (floating panel, mesmo padrão visual do painel "Modo de desenho" já existente em `AreaMapViewComponent`), não o controle nativo `L.control.layers` do Leaflet — evita a limitação de combinar dois filtros independentes (status × porto) num widget pensado para camadas nomeadas isoladas.
- O estado dos filtros (quais status e quais portos estão marcados) vive localmente no componente do mapa (`AreaMapViewComponent` ou um filho dedicado), resetando para "tudo marcado" sempre que o modo Mapa é reaberto — não precisa persistir entre sessões nem sincronizar com a tabela.
- A lista de portos do filtro é derivada das áreas atualmente carregadas (só portos com pelo menos uma área), não da lista completa de portos do sistema — evita mostrar portos irrelevantes no filtro.
- `AreaNameLabelComponent` (ou um novo componente equivalente) recebe um indicador de status para decidir se renderiza o badge "Inativo" inline; o HTML do badge é construído com estilos inline (mesma técnica já usada para o nome, por causa da limitação de `divIcon` do Leaflet não herdar Tailwind/tema).
- A lógica de "quais áreas estão visíveis dado o estado atual dos filtros" deve ser extraída em funções puras testáveis (mesmo padrão de `area-map-bounds.ts`), evitando lógica de filtragem espalhada dentro do componente Angular/Leaflet.
- O cálculo de `fitBounds` passa a operar sobre o conjunto de áreas visíveis (pós-filtro), recalculando quando os filtros mudam — não só uma vez ao carregar o mapa.

## Decisões de teste

- Funções puras de filtragem (quais áreas passam pelos filtros de status/porto, quais portos aparecem como opção) devem ser testadas isoladamente, sem depender de Leaflet/DOM — mesmo padrão de `area-map-bounds.spec.ts`/`area-draw.spec.ts` já existentes no módulo.
- Teste de que, por padrão (sem interação do usuário), todas as áreas (ativas e inativas) e todos os checkboxes de status/porto aparecem marcados.
- Teste de que desmarcar "Inativa" oculta as áreas inativas do conjunto visível sem afetar as ativas, e vice-versa.
- Teste de que desmarcar um porto oculta apenas as áreas daquele porto, incluindo o comportamento do bucket "Sem porto".
- Teste de que os dois filtros se combinam corretamente (uma área só permanece visível se ambos os critérios — status e porto — estiverem marcados).

## Fora de escopo

- Qualquer mudança no modo Tabela (a tabela já lista ativas e inativas hoje; este PRD é só sobre o modo Mapa).
- Persistir o estado dos filtros entre sessões ou entre alternâncias de modo Tabela/Mapa.
- Filtro nativo do Leaflet (`L.control.layers`) — decisão explícita de não usar, ver "Decisões de implementação".
- Alterar o fluxo de desenho de perímetro ou o painel "Modo de desenho" além de garantir que os dois painéis (desenho e filtros) não se sobreponham visualmente.

## Notas adicionais

Este PRD nasceu de uma sessão `grill-me` com o usuário. As decisões de estilo (cinza tracejado para inativas) e de posicionamento (painel de filtros no canto superior direito, recolhível) foram confirmadas explicitamente nessa sessão.
