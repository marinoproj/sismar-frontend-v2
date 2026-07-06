Status: done

# Issue 05 — Configuração de áreas do porto (fundeio / canal de acesso / área do porto)

## Issue pai

`docs/planning/melhorias-acesso-portos-areas/PRD.md`

## O que construir

O dialog de cadastro/edição de porto (`port-form-dialog`) ganha uma seção "Áreas do porto", que permite associar ao porto:

- **Áreas de fundeio** — multi-seleção, dentre as `Area`s cujo `portId` é o do porto em edição.
- **Área de canal de acesso** — seleção única, mesmo escopo de áreas.
- **Área do porto** (perímetro) — seleção única, mesmo escopo de áreas.

Uma mesma área não pode ser escolhida em mais de um desses três papéis: ao selecioná-la em um papel, ela deixa de aparecer disponível nos outros seletores.

Essa seção só fica habilitada quando o porto já existe (tem `id` salvo) — na criação de um porto novo, ela aparece desabilitada ou com uma mensagem explicando que fica disponível após o primeiro salvamento. Ao abrir o dialog para editar um porto existente, a seção carrega a configuração atual via `GET /ports/{id}/config` (campos `anchorageAreas`, `accessChannelArea`, `portArea`) e permite salvá-la de forma independente do restante do formulário, via `PUT /ports/{id}/config` (corpo `{ anchorageAreaIds, accessChannelAreaId?, portAreaId? }`).

Requer um novo modelo e repositório (contrato + implementação HTTP) para essa configuração, distinto do `PortConfig`/`PortConfigRepository` já existentes hoje (que representam o CRUD básico do `Port`, apesar do nome — não renomear, fora de escopo).

Erros da API (404 se alguma área não existe ou está inativa; 400 se houver IDs duplicados ou sobreposição entre papéis) são exibidos via toast pelo interceptor global de erro já existente — sem necessidade de tratamento especial adicional além da prevenção client-side de sobreposição.

## Critérios de aceite

- [ ] Editar um porto existente exibe a seção "Áreas do porto", pré-preenchida com a configuração atual (`GET /ports/{id}/config`).
- [ ] Criar um porto novo mantém a seção desabilitada/com aviso até o porto ser salvo pela primeira vez.
- [ ] Os três seletores listam apenas áreas com `portId` igual ao do porto em edição.
- [ ] É possível selecionar múltiplas áreas de fundeio.
- [ ] Selecionar uma área como canal de acesso ou área do porto remove-a da disponibilidade nos outros seletores (e vice-versa).
- [ ] Salvar a seção chama `PUT /ports/{id}/config` com o payload esperado, independente do submit dos dados básicos do porto.
- [ ] Toast de sucesso ao salvar; erro da API exibido via toast (interceptor global), sem duplicação.
- [ ] Testes cobrindo: seção desabilitada na criação; carregamento da configuração existente; prevenção de sobreposição entre papéis; submit com payload correto.

## Bloqueado por

Nenhum — pode começar imediatamente.
