Status: done

## Issue pai

[PRD — Menu UI Elements: Biblioteca de Componentes Reutilizáveis](../PRD.md)

## O que construir

Criar `ButtonComponent`, `ProgressComponent` e `SpinnerComponent` em `shared/ui/` e as páginas de showcase correspondentes.

**ButtonComponent** (`shared/ui/button/`): `@Input()` `variant: 'primary'|'secondary'|'outline'|'danger'|'ghost'`, `size: 'sm'|'md'|'lg'`, `loading?: boolean`, `disabled?: boolean`, `type?: 'button'|'submit'|'reset'`. `@Output()` `clicked: EventEmitter<void>`. Quando `loading`, exibe `SpinnerComponent` inline e bloqueia o clique. Quando `disabled`, cursor not-allowed.

**ProgressComponent** (`shared/ui/progress/`): `@Input()` `value: number`, `max?: number` (default 100), `label?: string`, `variant?: 'primary'|'success'|'warning'|'danger'`. Calcula `percent = (value/max)*100` e preenche a barra.

**SpinnerComponent** (`shared/ui/spinner/`): `@Input()` `size: 'sm'|'md'|'lg'`, `color?: string`. Animação via `animate-spin` do Tailwind em um elemento circular com borda.

**ButtonsPage**: grid de botões por variante, por tamanho, loading state, disabled state. **ProgressPage**: barras com diferentes valores (0%, 25%, 50%, 75%, 100%), variantes e com/sem label. **SpinnersPage**: spinners nos 3 tamanhos e em cores diferentes.

## Critérios de aceite

- [ ] `ButtonComponent` criado com todas as props descritas.
- [ ] Cada `variant` tem estilo visual distinto.
- [ ] Estado `loading` exibe spinner e bloqueia o `@Output() clicked`.
- [ ] Estado `disabled` tem cursor not-allowed e opacidade reduzida.
- [ ] `ProgressComponent` criado; a barra de preenchimento reflete `value/max`.
- [ ] `SpinnerComponent` criado; visível e animado nos 3 tamanhos.
- [ ] `ButtonsPageComponent` acessível em `/ui-elements/buttons` com todas as variações.
- [ ] `ProgressPageComponent` acessível em `/ui-elements/progress` com múltiplas barras.
- [ ] `SpinnersPageComponent` acessível em `/ui-elements/spinners` com múltiplos tamanhos.
- [ ] Breadcrumbs corretos nas 3 páginas.
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [ui-elements-showcase/01 — Routes + Alert + Badge](01-ui-elements-routes-e-alert-badge.md) (routes.ts do módulo criado nessa issue)
