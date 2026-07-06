Status: done

# Issue 04 — Correção do reordenamento de coordenadas no formulário de área

## Issue pai

`docs/planning/melhorias-acesso-portos-areas/PRD.md`

## O que construir

No formulário manual de cadastro/edição de área, os botões de mover coordenada para cima/para baixo não produzem nenhum efeito visível ao clicar. A causa raiz é a troca de identidade dos `FormGroup`s dentro do `FormArray` (em vez de trocar os valores), combinada com iteração por `track $index` no template — a troca nunca se reflete na tela.

A correção troca os **valores** de latitude/longitude entre as duas linhas envolvidas (mantendo os mesmos `FormGroup`s/controles nas mesmas posições do DOM), em vez de trocar quais objetos ocupam quais posições no array.

## Critérios de aceite

- [ ] Clicar em "mover para cima" troca os valores de lat/lon da linha atual com a linha imediatamente acima, refletindo visualmente nos campos.
- [ ] Clicar em "mover para baixo" troca os valores de lat/lon da linha atual com a linha imediatamente abaixo, refletindo visualmente nos campos.
- [ ] O botão "mover para cima" continua desabilitado na primeira linha; "mover para baixo" continua desabilitado na última.
- [ ] Nenhuma mudança de comportamento em adicionar/remover coordenada, no fechamento automático do polígono, ou nas demais validações do formulário.
- [ ] Teste automatizado cobrindo a troca de valores (via `FormArray.getRawValue()`) e os casos de borda (primeira linha não sobe, última não desce).

## Bloqueado por

Nenhum — pode começar imediatamente.
