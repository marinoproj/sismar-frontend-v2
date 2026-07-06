Status: done

# 06 — Berços: Cadastro, edição e exclusão

## Issue pai

`docs/planning/configuracoes-portos-terminais-bercos/PRD.md`

## O que construir

Completar a página de Berços (`settings/berths`) com as ações de escrita: cadastrar, editar e excluir um berço — cada ação condicionada à sua própria feature (`CONFIGURACAO_BERCO_ADICIONAR`, `CONFIGURACAO_BERCO_EDITAR`, `CONFIGURACAO_BERCO_EXCLUIR`). Esta fatia introduz o repository de Área (somente leitura) e o fluxo em cascata do formulário.

Comportamento esperado de ponta a ponta:
- Usuário com `CONFIGURACAO_BERCO_ADICIONAR` vê um botão "Novo berço"; ao clicar, abre um modal onde primeiro escolhe um **Porto** (client-side, só para filtrar o passo seguinte — não é campo do `BerthDTO`), depois um **Terminal** (select alimentado por `GET /terminals?portId=<porto escolhido>`, reaproveitando o service da issue 03), depois uma **Área** opcional (select alimentado por `GET /area`, filtrado no cliente para mostrar as áreas com `portId` igual ao porto escolhido mais as áreas com `portId` nulo), e por fim os campos `name`, `length`, `draft` (opcionais).
- Ao salvar, chama `POST /berths` com `terminalId` e `areaId` (se selecionada). Erros `404` (terminal ou área não existem mais) exibidos via toast.
- Usuário com `CONFIGURACAO_BERCO_EDITAR` vê a ação "Editar"; o modal pré-seleciona porto, terminal e área atuais (obtidos via `GET /berths/{id}` → `BerthDetailDTO`, usando `terminal.portId` para saber o porto) e salva via `PUT /berths/{id}`.
- Usuário com `CONFIGURACAO_BERCO_EXCLUIR` vê a ação "Excluir", com confirmação prévia antes de `DELETE /berths/{id}`; erros exibidos via toast.

## Critérios de aceite

- [ ] Novo repository (abstrato + `InjectionToken` + implementação HTTP), somente leitura, para Área (`GET /area`).
- [ ] Botão "Novo berço" visível apenas com `CONFIGURACAO_BERCO_ADICIONAR`.
- [ ] Modal de formulário com a cascata Porto → Terminal → Área descrita acima, e os campos `name`/`length`/`draft`, reaproveitado para criar e editar.
- [ ] Select de Área inclui as áreas do porto escolhido mais as áreas sem `portId` (área "genérica"), e é opcional.
- [ ] Ação "Editar" visível apenas com `CONFIGURACAO_BERCO_EDITAR`, pré-preenchendo porto/terminal/área a partir do `BerthDetailDTO`.
- [ ] Ação "Excluir" visível apenas com `CONFIGURACAO_BERCO_EXCLUIR`, usando `ConfirmDialogComponent` antes de chamar a API.
- [ ] Erros `400`/`404`/`409` exibidos via `ToastService` com a mensagem retornada pelo backend.
- [ ] Repository/service de Berço (criados na issue 05) estendidos com métodos de criar/atualizar/excluir/detalhar.
- [ ] Spec do repository de Área cobrindo a listagem via `HttpTestingController`.
- [ ] Spec do `*HttpRepository` de Berço cobrindo `POST`/`PUT`/`DELETE`/`GET` por id.
- [ ] Spec do `*Service` de Berço cobrindo o comportamento exposto, incluindo propagação de erro.

## Bloqueado por

- Issue 04 (Terminais: Cadastro, edição e exclusão) — precisa do service de Terminais estável para o select filtrado.
- Issue 05 (Berços: Listagem e busca) — reaproveita rota, repository e service.
