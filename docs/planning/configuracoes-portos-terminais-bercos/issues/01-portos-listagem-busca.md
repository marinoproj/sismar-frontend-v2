Status: done

# 01 — Portos: Listagem e busca

## Issue pai

`docs/planning/configuracoes-portos-terminais-bercos/PRD.md`

## O que construir

Transformar o item de menu "Configurações" (hoje único, sem submenu, apontando para uma rota inexistente) em um grupo expansível com um primeiro submenu "Portos", visível apenas para quem tem a feature `CONFIGURACAO_PORTO`. A página de Portos deve listar todos os portos cadastrados (nome, país, coordenadas) numa tabela, com campo de busca por nome que consulta a API filtrando por nome (não é filtro em memória). Sem cadastro/edição/exclusão ainda — essa fatia é somente leitura, mas já estabelece o padrão de rota (`settings/ports`), guard de feature e o repository/service que a próxima fatia (cadastro/edição/exclusão) vai reaproveitar.

Comportamento esperado de ponta a ponta:
- Usuário com `CONFIGURACAO_PORTO` vê "Configurações" no menu, e dentro dele "Portos".
- Usuário sem `CONFIGURACAO_PORTO` (e sem as features de Terminal/Berço, ainda não implementadas) não vê o grupo "Configurações" no menu.
- Ao acessar `settings/ports`, vê uma tabela com todos os portos, populada via `GET /ports`.
- Ao digitar um termo no campo de busca, a tabela atualiza consultando `GET /ports?name=<termo>` (com debounce, não a cada tecla).
- Sem resultado para o termo buscado, a tabela mostra um estado vazio compreensível.

## Critérios de aceite

- [ ] Rota `settings/ports` registrada, protegida por `featureGuard` com a feature `CONFIGURACAO_PORTO`.
- [ ] Menu "Configurações" em `nav-items.ts` passa a ter `children`, com "Portos" como primeiro item, condicionado à feature `CONFIGURACAO_PORTO`.
- [ ] `nav-items.spec.ts` cobre: item "Portos" visível com a feature presente, ausente sem ela; grupo "Configurações" ausente quando nenhuma feature de Configurações estiver presente.
- [ ] Novo repository (abstrato + `InjectionToken` + implementação HTTP) para o cadastro de Porto, com método de listagem aceitando filtro opcional por nome (`GET /ports` / `GET /ports?name=`).
- [ ] Novo service que expõe a listagem/busca de portos para a página.
- [ ] Página `settings/ports` usando `app-table`, com busca (`searchable`, `searchChange`) disparando a consulta à API com debounce.
- [ ] Spec do `*HttpRepository` mockando HTTP via `HttpTestingController` (padrão de `ports-http.repository.spec.ts`), cobrindo listagem sem filtro e com filtro por nome.
- [ ] Spec do `*Service` cobrindo o comportamento de busca exposto.

## Bloqueado por

Nenhum — pode começar imediatamente.
