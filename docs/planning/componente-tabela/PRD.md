Status: done

# PRD — Componente de Tabela Reutilizável

## Declaração do problema

Sistemas de dashboard exibem dados tabulares em diversas features: listas de usuários, registros de eventos, resultados de busca. Sem um componente de tabela reutilizável, cada feature implementa sua própria tabela com estilos inconsistentes, sem tratamento de estado vazio, sem loading e sem suporte a paginação server-side.

## Solução

Um `TableComponent` em `src/app/shared/ui/table/` baseado em HTML nativo com estilização Tailwind. O componente recebe definições de colunas e dados via `@Input()`, exibe estados de loading e vazio, e provê a estrutura para paginação server-side. A implementação é leve (sem dependência de grid de terceiros) e suficiente para a maioria dos casos de uso.

## User stories

1. Como desenvolvedor, quero usar `<app-table [columns]="cols" [rows]="dados" />` e obter uma tabela estilizada, para que não precise reescrever HTML de tabela em cada feature.
2. Como desenvolvedor, quero definir colunas com rótulo e chave de acesso ao dado, para que o mapeamento entre dado e coluna seja declarativo.
3. Como usuário, quero ver um indicador de loading enquanto os dados estão sendo carregados, para que o sistema não pareça travado.
4. Como usuário, quero ver uma mensagem amigável quando não há dados, para que eu entenda que a tabela está vazia intencionalmente.
5. Como desenvolvedor, quero um slot para célula customizada via template do Angular, para que colunas com badges, botões de ação ou ícones sejam possíveis sem alterar o componente base.
6. Como usuário, quero navegar entre páginas de dados via controles de paginação, para que tabelas com muitos registros sejam navegáveis.
7. Como desenvolvedor, quero que a paginação emita eventos de página para o componente pai, para que a busca server-side seja possível sem lógica dentro do `TableComponent`.
8. Como usuário, quero que a tabela seja responsiva e legível em mobile, para que os dados sejam acessíveis em qualquer dispositivo.

## Decisões de implementação

- **`TableComponent`**: standalone em `src/app/shared/ui/table/table.component.ts`.
- **`ColumnDef`**: interface em `src/app/shared/models/column-def.model.ts`. Campos: `key: string` (chave no objeto de dado), `label: string` (cabeçalho), `template?: TemplateRef<any>` (para células customizadas), `width?: string` (ex: `'120px'`), `align?: 'left' | 'center' | 'right'` (default: `'left'`).
- **Inputs**:
  - `columns: ColumnDef[]` — obrigatório
  - `rows: Record<string, unknown>[]` — obrigatório; dados das linhas
  - `loading?: boolean` — default: `false`; exibe skeleton loader no lugar das linhas
  - `emptyMessage?: string` — default: `'Nenhum registro encontrado.'`
  - `totalItems?: number` — total de registros no servidor (para paginação)
  - `pageSize?: number` — default: 10
  - `currentPage?: number` — default: 1
- **Output**: `pageChange: EventEmitter<number>` — emite o número da página solicitada ao clicar nos controles de paginação.
- **Paginação**: exibida apenas quando `totalItems` é fornecido. Controles: primeira página, anterior, números de página, próxima, última.
- **Skeleton loader**: quando `loading: true`, exibe linhas com blocos animados (pulse do Tailwind) no lugar dos dados reais.
- **Células customizadas**: quando `ColumnDef.template` é fornecido, o componente usa `ngTemplateOutlet` para renderizar o template, passando a linha como contexto implícito `$implicit`.
- **Responsividade**: wrapper com `overflow-x-auto` para scroll horizontal em telas pequenas.

## Decisões de teste

- Testar `TableComponent` com colunas e linhas simples → células renderizam com os valores corretos.
- Testar `loading: true` → skeleton exibido em vez das linhas.
- Testar `rows: []` → mensagem de vazio exibida.
- Testar clique no controle de paginação → `pageChange` emite o número correto.
- Não testar estilos CSS — testar presença/ausência de elementos e valores de texto.

## Fora de escopo

- Ordenação de colunas (click no header para ordenar) — implementar em projeto derivado se necessário
- Filtro inline de coluna
- Seleção de linhas (checkbox)
- Virtualização de linhas para grandes volumes — usar AG Grid em projetos que precisem
- Exportação para CSV/Excel

## Notas adicionais

- A interface `ColumnDef` com `template?: TemplateRef` cobre a maioria dos casos de células customizadas (badges de status, botões de ação, avatares) sem precisar de um sistema de renderizadores complexo.
