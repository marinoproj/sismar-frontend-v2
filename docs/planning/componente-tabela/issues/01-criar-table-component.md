Status: done

# 01 — Criar TableComponent com colunas, dados e célula customizável

## O que construir

Criar `TableComponent` em `src/app/shared/ui/table/` com HTML nativo estilizado com Tailwind. O componente deve aceitar definições de colunas (`ColumnDef[]`) e dados (`rows`), renderizar cabeçalho e corpo da tabela, e suportar célula customizável via `TemplateRef` quando `ColumnDef.template` for fornecido.

## Critérios de aceite

- [ ] Interface `ColumnDef` definida em `src/app/shared/models/column-def.model.ts`
- [ ] `@Input({ required: true }) columns: ColumnDef[]`
- [ ] `@Input({ required: true }) rows: Record<string, unknown>[]`
- [ ] `@Input() emptyMessage?: string` — default: `'Nenhum registro encontrado.'`
- [ ] Cabeçalho da tabela renderiza os `label` de cada `ColumnDef`
- [ ] Linhas renderizam os valores acessados por `ColumnDef.key`
- [ ] Quando `ColumnDef.template` é fornecido, usa `ngTemplateOutlet` com a linha como `$implicit`
- [ ] `rows: []` exibe mensagem de vazio centralizada
- [ ] Wrapper com `overflow-x-auto` para responsividade em mobile
- [ ] Estilo zebra (linhas alternadas) e hover highlight via Tailwind
- [ ] Componente é `standalone: true`

## Bloqueado por

- [setup-infraestrutura/issues/02](../../setup-infraestrutura/issues/02-configurar-tailwind-css.md)
