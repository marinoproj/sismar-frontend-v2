Status: done

# 03 — Terminais: Listagem, busca e filtro por porto

## Issue pai

`docs/planning/configuracoes-portos-terminais-bercos/PRD.md`

## O que construir

Adicionar o submenu "Terminais" dentro de "Configurações" (após "Portos"), visível para quem tem a feature `CONFIGURACAO_TERMINAL`. A página lista todos os terminais cadastrados (nome, código, tipo, porto ao qual pertence) numa tabela, com busca por nome e um filtro adicional por porto (select acima da tabela, alimentado pelo service de Portos da issue 01) — ambos consultando a API, sem filtro em memória. Assim como a issue 01, esta é a fatia somente leitura; cadastro/edição/exclusão ficam na issue 04.

Comportamento esperado de ponta a ponta:
- Usuário com `CONFIGURACAO_TERMINAL` vê "Terminais" dentro de "Configurações".
- Ao acessar `settings/terminals`, vê uma tabela com todos os terminais, populada via `GET /terminals`.
- Buscar por nome consulta `GET /terminals?name=<termo>`; escolher um porto no filtro consulta `GET /terminals?portId=<id>`; os dois filtros são combináveis (`GET /terminals?portId=<id>&name=<termo>`).
- A coluna de porto na tabela mostra o nome do porto (não o `portId` cru).

## Critérios de aceite

- [ ] Rota `settings/terminals` registrada, protegida por `featureGuard` com a feature `CONFIGURACAO_TERMINAL`.
- [ ] Item "Terminais" adicionado como segundo filho de "Configurações" em `nav-items.ts`, condicionado à feature `CONFIGURACAO_TERMINAL`; `nav-items.spec.ts` atualizado.
- [ ] Novo repository (abstrato + `InjectionToken` + implementação HTTP) para Terminal, com listagem aceitando filtros combináveis `name` e `portId`.
- [ ] Novo service que expõe listagem/busca/filtro de terminais para a página.
- [ ] Página `settings/terminals` usando `app-table`, com busca por nome e um select de porto (alimentado pelo service de Portos da issue 01) filtrando a listagem.
- [ ] Spec do `*HttpRepository` cobrindo listagem sem filtro, com `name`, com `portId`, e com os dois combinados.
- [ ] Spec do `*Service` cobrindo o comportamento de busca/filtro exposto.

## Bloqueado por

- Issue 01 (Portos: Listagem e busca) — reaproveita o service de Portos para o select de filtro.
