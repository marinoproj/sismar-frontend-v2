Status: done

# Issue 02 — Cadastro e edição manual de Área

## Issue pai

`docs/planning/configuracoes-areas/PRD.md`

## O que construir

Adicionar o botão "Adicionar área" no topo da página (visível só com `CONFIGURACAO_AREA_ADICIONAR`), e a ação "Atualizar" na linha de cada área da tabela (visível só com `CONFIGURACAO_AREA_EDITAR`).

Ao clicar em "Adicionar área", perguntar ao usuário entre "Informar dados manualmente" ou "Desenhar no mapa" (esta última opção só será funcional na issue 5 — pode ficar desabilitada ou redirecionar para o modo mapa vazio por enquanto). Ao escolher manual (ou ao clicar "Atualizar" na tabela, que sempre vai direto para o modal manual), abrir um modal reutilizado para criar e editar, com campos: nome, porto (select opcional alimentado pelos portos cadastrados) e uma lista de coordenadas (latitude/longitude decimais) com botões para adicionar linha, remover linha e reordenar (subir/descer).

O modal fecha automaticamente o polígono ao montar o payload — adiciona a primeira coordenada como última antes de enviar, sem exigir que o usuário a digite manualmente. Bloqueia o salvamento quando há menos de 3 coordenadas únicas, quando alguma latitude/longitude é inválida, ou quando o polígono ficaria aberto. Segue o padrão já estabelecido nos dialogs de Porto/Terminal/Berço: o próprio dialog é dono da chamada à API (`create`/`update`), com signal `saving` controlando o indicador de carregamento no botão "Salvar", desabilitação durante a chamada, e toast de sucesso/erro ao final.

## Critérios de aceite

- [ ] Botão "Adicionar área" visível apenas com `CONFIGURACAO_AREA_ADICIONAR`; ação "Atualizar" visível apenas com `CONFIGURACAO_AREA_EDITAR`.
- [ ] Escolha entre "Informar dados manualmente" e "Desenhar no mapa" ao adicionar; "Atualizar" da tabela vai direto ao modal manual.
- [ ] Modal manual permite informar nome, porto (opcional) e lista de coordenadas, com adicionar/remover/reordenar linhas.
- [ ] Fechamento automático do polígono no payload enviado (primeira coordenada repetida como última), sem exigir digitação manual do usuário.
- [ ] Validações bloqueiam salvar com menos de 3 coordenadas únicas ou lat/lon inválidos.
- [ ] Modal de edição vem preenchido com os dados atuais da área, incluindo a lista de coordenadas (sem a duplicata de fechamento visível ao usuário).
- [ ] Botão "Salvar" mostra loading durante a chamada à API, reabilita em caso de erro, e bloqueia duplo-submit.
- [ ] Toast de sucesso ou erro aparece após criar/atualizar.

## Bloqueado por

- Issue 01 (menu, rota, repositório e listagem em tabela).
