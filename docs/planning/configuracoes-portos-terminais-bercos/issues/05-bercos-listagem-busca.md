Status: done

# 05 — Berços: Listagem e busca

## Issue pai

`docs/planning/configuracoes-portos-terminais-bercos/PRD.md`

## O que construir

Adicionar o submenu "Berços" dentro de "Configurações" (após "Terminais"), visível para quem tem a feature `CONFIGURACAO_BERCO`. A página lista todos os berços cadastrados (nome, terminal, área associada, comprimento, calado) numa tabela, com busca por nome consultando a API. Fatia somente leitura — cadastro/edição/exclusão (com a cascata Porto→Terminal→Área) ficam na issue 06.

Comportamento esperado de ponta a ponta:
- Usuário com `CONFIGURACAO_BERCO` vê "Berços" dentro de "Configurações".
- Ao acessar `settings/berths`, vê uma tabela com todos os berços, populada via `GET /berths`.
- Buscar por nome consulta `GET /berths?name=<termo>` (com debounce).
- As colunas de terminal e área mostram os nomes (não os IDs crus); a coluna de área fica vazia/indica "sem área" quando `areaId` for nulo.

## Critérios de aceite

- [ ] Rota `settings/berths` registrada, protegida por `featureGuard` com a feature `CONFIGURACAO_BERCO`.
- [ ] Item "Berços" adicionado como terceiro filho de "Configurações" em `nav-items.ts`, condicionado à feature `CONFIGURACAO_BERCO`; `nav-items.spec.ts` atualizado.
- [ ] Novo repository (abstrato + `InjectionToken` + implementação HTTP) para Berço, com listagem aceitando filtro opcional por `name` (o filtro por `terminalId` fica disponível no repository desde já, mesmo que a UI desta fatia não o exponha — será usado na issue 06 para a cascata).
- [ ] Novo service que expõe listagem/busca de berços para a página.
- [ ] Página `settings/berths` usando `app-table`, com busca por nome disparando a consulta à API com debounce.
- [ ] Exibição de terminal/área na tabela usando `GET /berths` (que já retorna os dados suficientes) ou o detalhe (`BerthDetailDTO`) se necessário para nomes legíveis.
- [ ] Spec do `*HttpRepository` cobrindo listagem sem filtro e com filtro por nome.
- [ ] Spec do `*Service` cobrindo o comportamento de busca exposto.

## Bloqueado por

- Issue 03 (Terminais: Listagem, busca e filtro por porto) — segue o mesmo padrão de rota/menu já estabelecido para Terminais.
