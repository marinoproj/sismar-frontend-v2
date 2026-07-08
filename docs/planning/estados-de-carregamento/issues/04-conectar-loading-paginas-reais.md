Status: done

# Issue 04 — Conectar loading real nas páginas de produto

## Issue pai

`docs/planning/estados-de-carregamento/PRD.md`

## O que construir

Cada página real de produto conecta o sinal `loading` do seu serviço (issues 02 e 03) aos componentes que exibe (issue 01):

- `PortsListPageComponent`: `[loading]` da tabela ligado a `PortsService.summaryLoading` (ou equivalente).
- `GeneralTabComponent` (aba "Geral" de `/ports/:id`): substitui o gate manual atual (esconder a aba inteira com divs de pulso escritos à mão) por `[loading]` conectado individualmente em cada `StatCard`/gráfico que ele usa, usando `PortsService.detailsLoading`.
- `PortsConfigPageComponent`, `TerminalsConfigPageComponent`, `BerthsConfigPageComponent`, `AreasConfigPageComponent`: `[loading]` da respectiva tabela ligado ao `loading` do serviço correspondente (`PortConfigService`, `TerminalConfigService`, `BerthConfigService`, `AreaService`).

Páginas de demonstração/mock não são tocadas nesta issue.

## Critérios de aceite

- [ ] Lista de Portos mostra o efeito de carregamento na tabela ao (re)carregar.
- [ ] Aba "Geral" de detalhes do porto mostra o efeito de carregamento nos cards/gráfico individualmente (não mais escondendo a aba inteira), tanto no carregamento inicial quanto ao trocar de porto.
- [ ] Telas de configuração (Portos, Terminais, Berços, Áreas) mostram o efeito de carregamento na tabela ao (re)carregar, incluindo buscas/filtros.
- [ ] Nenhuma página de demonstração/mock foi alterada.
- [ ] Testes (ou ajustes nos specs existentes) confirmando o binding de `[loading]` em cada página listada.

## Bloqueado por

- Issue 01 (Loading/skeleton nos componentes compartilhados)
- Issue 02 (Convenção de sinal `loading` nas services de listagem)
- Issue 03 (Corrigir recarregamento ao trocar de porto + loading dos detalhes)
