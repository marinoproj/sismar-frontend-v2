Status: done

# 02 — Adicionar skeleton loading e paginação server-side ao TableComponent

## O que construir

Estender o `TableComponent` com skeleton loader (quando `loading: true`) e controles de paginação server-side (quando `totalItems` é fornecido). O skeleton loader usa a animação `animate-pulse` do Tailwind. Os controles de paginação emitem eventos para o componente pai, que é responsável por buscar a nova página.

## Critérios de aceite

- [ ] `@Input() loading?: boolean` — quando `true`, exibe linhas de skeleton no lugar dos dados (mesma quantidade de colunas)
- [ ] Skeleton usa `animate-pulse` com blocos cinza nas células
- [ ] `@Input() totalItems?: number` — quando fornecido, controles de paginação aparecem abaixo da tabela
- [ ] `@Input() pageSize?: number` — default: 10
- [ ] `@Input() currentPage?: number` — default: 1
- [ ] `@Output() pageChange: EventEmitter<number>` — emite número da página ao clicar nos controles
- [ ] Controles: botão anterior (desabilitado na primeira página), números de página, botão próxima (desabilitado na última)
- [ ] Exibe texto `"Mostrando X a Y de Z registros"` acima ou abaixo da tabela
- [ ] Teste: `loading: true` → skeleton exibido; clique em próxima página → `pageChange` emite `2`

## Bloqueado por

- [01 — Criar TableComponent](./01-criar-table-component.md)
