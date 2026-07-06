Status: done

# Issue 05 — Desenho de perímetro no mapa (criar/atualizar)

## Issue pai

`docs/planning/configuracoes-areas/PRD.md`

## O que construir

Habilitar a opção "Desenhar no mapa" (tanto ao adicionar uma nova área quanto ao optar por atualizar uma existente por desenho), construída à mão sobre a API do Leaflet, sem plugin novo (`leaflet-draw`/Geoman) — consistente com a decisão já tomada no PRD de Maps.

Ao entrar em modo de desenho: cada clique no mapa adiciona um novo vértice, exibindo uma polyline de preview ligando os pontos e um marcador em cada vértice. Quando o cursor/clique estiver dentro de uma tolerância fixa em pixels (constante no código) da posição do primeiro vértice, esse primeiro marcador é destacado visualmente, indicando que o próximo clique fechará o polígono — o usuário não precisa acertar exatamente o primeiro ponto. Ao fechar, a coordenada de fechamento (primeira repetida) é adicionada automaticamente ao array de vértices. A tecla ESC cancela o desenho em andamento a qualquer momento, limpando vértices e preview.

Ao fechar um polígono válido (mínimo 3 vértices únicos — bloquear e não abrir o modal seguinte se não atingir esse mínimo), abrir um modal perguntando o destino: "Criar nova área" ou "Atualizar área existente".

- **Criar nova área**: reaproveita a lógica de criação da issue 2, mas com um modal reduzido pedindo apenas nome e porto (opcional) — as coordenadas desenhadas já vêm preenchidas automaticamente.
- **Atualizar área existente**: combobox listando todas as áreas cadastradas (ativas e inativas, via `getAll()` sem filtro de status). Ao confirmar, substitui completamente o perímetro anterior pelas coordenadas desenhadas, mantendo os demais dados da área (nome, porto, status) intactos.

## Critérios de aceite

- [ ] Clique sucessivo no mapa adiciona vértices, com preview de linhas e marcador em cada ponto.
- [ ] Aproximar o cursor/clique do primeiro vértice destaca esse ponto visualmente antes do fechamento.
- [ ] Clicar próximo do primeiro ponto (dentro da tolerância) fecha o polígono, adicionando a coordenada de fechamento automaticamente.
- [ ] ESC cancela o desenho em andamento a qualquer momento.
- [ ] Fechar um polígono com menos de 3 vértices únicos não avança para o modal de destino (bloqueado).
- [ ] Ao fechar um polígono válido, modal pergunta entre "Criar nova área" e "Atualizar área existente".
- [ ] "Criar nova área" abre modal só com nome/porto, coordenadas já preenchidas pelo desenho.
- [ ] "Atualizar área existente" lista todas as áreas (ativas e inativas) num combobox e, ao confirmar, substitui o perímetro mantendo nome/porto/status da área selecionada.
- [ ] Validação manual: fluxo completo de desenho, fechamento, criação e atualização testado manualmente no navegador (automação de interação de mapa está fora de escopo, conforme o PRD).

## Bloqueado por

- Issue 02 (cadastro e edição manual — reaproveita lógica de criação/atualização).
- Issue 04 (modo mapa — precisa da visualização de mapa já funcionando para desenhar sobre ela).
