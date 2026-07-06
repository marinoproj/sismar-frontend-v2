Status: done

# Issue 03 — Ativar área e gerenciar job retroativo

## Issue pai

`docs/planning/configuracoes-areas/PRD.md`

## O que construir

Adicionar duas ações na linha de cada área da tabela, ambas visíveis apenas com `CONFIGURACAO_AREA_EDITAR`:

- **"Ativar"** — visível apenas quando `active === false`. Chama `POST /area/{id}/activate` diretamente, sem disparar nenhum reprocessamento antes. Erros de negócio da API (ex.: nenhum job retroativo concluído ainda) aparecem via toast (interceptor global de erro já trata isso).
- **"Gerenciar job retroativo"** — abre um modal específico daquela área com:
  - Status do último job (`GET /area/{id}/retroactive-jobs/last`, tratando 404 como "nenhum job disparado ainda" e não como erro): modo (Completo/Incremental), status, período coberto, progresso (mmsisProcessed/mmsisTotal, progressPercent), erro se houver.
  - Formulário para disparar um novo job: toggle "Completo" (FULL, com campo obrigatório "Período (dias)") ou "Incremental" (CATCHUP, sem esse campo).
  - Botão "Atualizar status" que reconsulta o último job sob demanda (sem polling automático).
  - Botão "Cancelar job" habilitado quando o último job está em andamento (`RUNNING`/`PENDING`/`CANCELLING`, conforme o que a API expõe).
  - Mensagens de erro da API (job em andamento, incremental sem job completo anterior concluído, etc.) exibidas de forma clara no próprio modal ou via toast.

## Critérios de aceite

- [ ] Ação "Ativar" some da linha quando a área já está ativa.
- [ ] "Ativar" chama a ativação diretamente, sem disparar job antes; erro de negócio aparece em toast compreensível.
- [ ] Modal de job retroativo mostra o status do último job da área (ou estado "nenhum job ainda").
- [ ] É possível disparar um job em modo Completo informando período em dias.
- [ ] É possível disparar um job em modo Incremental sem informar período.
- [ ] Botão "Atualizar status" reconsulta e exibe o progresso mais recente.
- [ ] É possível cancelar um job em andamento a partir do modal.
- [ ] Erros de negócio da API (job em andamento, incremental sem FULL anterior concluído) são exibidos com mensagem clara.
- [ ] Ambas as ações (Ativar, Gerenciar job) ficam ocultas para usuários sem `CONFIGURACAO_AREA_EDITAR`.

## Bloqueado por

- Issue 01 (menu, rota, repositório e listagem em tabela).
