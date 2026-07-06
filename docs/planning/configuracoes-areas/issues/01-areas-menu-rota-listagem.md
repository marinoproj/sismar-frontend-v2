Status: done

# Issue 01 — Menu, rota e listagem em tabela de Áreas

## Issue pai

`docs/planning/configuracoes-areas/PRD.md`

## O que construir

Adicionar o item "Áreas" ao grupo "Configurações" no menu, gated pela feature `CONFIGURACAO_AREA`, levando à rota `settings/areas` (lazy-loaded, `canActivate: [featureGuard]`, providers escopados à rota, seguindo o mesmo padrão de `settings/ports`/`settings/terminals`/`settings/berths`).

Criar o model e repositório completo de `Area` em `features/settings/areas/` (`id`, `name`, `coordinates: {lat, lon}[]`, `portId?`, `active` somente leitura), com métodos `getAll()`, `getById(id)`, `create(input)`, `update(id, input)`, `activate(id)`, `getLastRetroactiveJob(id)`, `triggerRetroactiveJob(id, {periodDays?, catchUp?})`, `cancelRetroactiveJob(id)` contra os endpoints de `Area` documentados em `docs/api/api-reference.md`. Esse repositório substitui o `Area`/`AreaRepository` read-only hoje existente em `settings/berths/`; o formulário de Berço passa a importar `Area`/`AREA_REPOSITORY` de `settings/areas/`.

Construir o Modo Tabela da página: lista todas as áreas cadastradas com busca por nome (debounced, mesmo padrão de Porto/Terminal/Berço), exibindo colunas nome, porto, status (badge Ativa/Inativa) e quantidade de coordenadas. Sem ações de edição/ativação/job nesta issue (entram nas issues seguintes) — a coluna de ações pode ficar vazia ou ser adicionada só quando as próximas issues chegarem.

Adicionar também a estrutura de alternância Tabela/Mapa (toggle no topo da página) com o Modo Mapa como placeholder vazio nesta issue — a renderização real do mapa é da issue 4.

## Critérios de aceite

- [ ] Usuário com a feature `CONFIGURACAO_AREA` vê o item "Áreas" dentro de "Configurações" no menu; usuário sem a feature não vê o item, e o grupo "Configurações" não aparece se nenhuma feature filha estiver liberada.
- [ ] Rota `settings/areas` acessível apenas com `CONFIGURACAO_AREA` (feature guard).
- [ ] `Area`/`AREA_REPOSITORY` completo criado em `features/settings/areas/`; duplicata read-only em `settings/berths/` removida; formulário de Berço continua funcionando (importando de `settings/areas/`).
- [ ] Tabela lista todas as áreas cadastradas com nome, porto, status e quantidade de coordenadas.
- [ ] Busca por nome funciona com debounce, seguindo o padrão dos módulos irmãos.
- [ ] Toggle Tabela/Mapa presente no topo da página, alternando o conteúdo exibido (Modo Mapa pode ser um placeholder vazio nesta issue).

## Bloqueado por

Nenhum — pode começar imediatamente.
