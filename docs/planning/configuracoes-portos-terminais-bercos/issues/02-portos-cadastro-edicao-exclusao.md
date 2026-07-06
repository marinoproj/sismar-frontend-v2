Status: done

# 02 — Portos: Cadastro, edição e exclusão

## Issue pai

`docs/planning/configuracoes-portos-terminais-bercos/PRD.md`

## O que construir

Completar a página de Portos (`settings/ports`) com as ações de escrita: cadastrar um novo porto, editar um porto existente e excluir um porto — cada ação condicionada à sua própria feature (`CONFIGURACAO_PORTO_ADICIONAR`, `CONFIGURACAO_PORTO_EDITAR`, `CONFIGURACAO_PORTO_EXCLUIR`).

Comportamento esperado de ponta a ponta:
- Usuário com `CONFIGURACAO_PORTO_ADICIONAR` vê um botão "Novo porto" no topo da página; ao clicar, abre um modal com os campos `name`, `country`, `imagePort` (URL), `countryFlag` (URL), `latitude`/`longitude` (opcionais). Ao salvar, chama `POST /ports` e a tabela reflete o novo porto sem recarregar a página.
- Validação de obrigatoriedade no formulário (nome, país, imagem do porto, bandeira) antes de enviar, e exibição da mensagem de erro da API (`400`/`409`) via toast se o envio for rejeitado (ex.: nome+país duplicado).
- Usuário com `CONFIGURACAO_PORTO_EDITAR` vê a ação "Editar" na linha de cada porto; o modal abre pré-preenchido com os dados atuais e salva via `PUT /ports/{id}`.
- Usuário com `CONFIGURACAO_PORTO_EXCLUIR` vê a ação "Excluir" na linha de cada porto; a exclusão pede confirmação num diálogo antes de chamar `DELETE /ports/{id}`, e qualquer erro (ex.: `409` por Equipamento associado) aparece como toast com a mensagem da API.
- Usuário sem a feature correspondente não vê o botão/ação respectivo.

## Critérios de aceite

- [ ] Botão "Novo porto" visível apenas com `CONFIGURACAO_PORTO_ADICIONAR`.
- [ ] Modal de formulário (padrão `modal-shell` + CDK `Dialog` + `ReactiveFormsModule`, localizado junto da página) com os campos do `PortDTO` descritos acima, reaproveitado para criar e editar.
- [ ] Ação "Editar" na coluna de ações da tabela, visível apenas com `CONFIGURACAO_PORTO_EDITAR`, abrindo o modal pré-preenchido.
- [ ] Ação "Excluir" na coluna de ações, visível apenas com `CONFIGURACAO_PORTO_EXCLUIR`, usando o `ConfirmDialogComponent` existente (`variant: 'danger'`) antes de chamar a API.
- [ ] Erros `400`/`404`/`409` da API em qualquer uma das três ações exibidos via `ToastService` com a mensagem retornada pelo backend.
- [ ] Repository/service de Porto (criados na issue 01) estendidos com os métodos de criar/atualizar/excluir.
- [ ] Spec do `*HttpRepository` cobrindo `POST`/`PUT`/`DELETE` (método e URL corretos).
- [ ] Spec do `*Service` cobrindo o comportamento exposto de criar/atualizar/excluir, incluindo propagação de erro.

## Bloqueado por

- Issue 01 (Portos: Listagem e busca) — reaproveita a rota, o repository e o service já criados.
