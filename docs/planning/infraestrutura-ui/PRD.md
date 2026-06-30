Status: done

# PRD — Infraestrutura de UI

## Declaração do problema

O sistema atual possui um menu lateral sem agrupamento visual de seções, sem breadcrumb de navegação, sem sistema de notificação por toast e uma tabela que não suporta colunas de ação configuráveis dinamicamente. Isso limita a expansão da interface para múltiplos módulos e reduz a experiência de navegação do usuário, que não consegue identificar sua posição hierárquica nem acionar feedback visual de operações.

## Solução

Implementar a fundação de UI que sustentará todos os novos módulos do sistema:

1. **NavSection com cabeçalhos de grupo** — o menu lateral passa a suportar seções visuais (ex: MAIN, SISTEMA) com cabeçalhos renderizados entre os grupos de itens.
2. **Esqueleto de roteamento** — todas as rotas dos novos módulos (Dashboards, Charts, UI Elements, Maps) são registradas no roteador, com dados de breadcrumb embutidos, e um redirect de `/dashboard` para `/dashboard/vendas`.
3. **BreadcrumbComponent global** — componente inserido no layout que lê os dados de rota (`data.breadcrumb`) e exibe o caminho hierárquico de navegação em todas as páginas internas.
4. **ToastService singleton + ToastContainerComponent** — serviço injetável que empilha notificações toast; container renderizado no layout, disponível para qualquer componente da aplicação.
5. **TableAction — ações dinâmicas na tabela** — o `TableComponent` existente é estendido com `@Input() actions: TableAction[]`, gerando automaticamente uma coluna "Ações" com botões configuráveis por linha.

## User stories

1. Como usuário, quero ver cabeçalhos de seção no menu lateral, para que eu possa identificar rapidamente a categoria de cada grupo de itens de navegação.
2. Como usuário, quero que os itens do menu lateral estejam agrupados em "MAIN" e "SISTEMA", para que a navegação fique organizada por contexto.
3. Como usuário, quero ver um breadcrumb no topo de cada página interna, para que eu saiba exatamente onde estou na hierarquia do sistema.
4. Como usuário, quero clicar em um item do breadcrumb e navegar para aquela seção, para que eu possa voltar a um nível anterior sem usar o botão "voltar" do browser.
5. Como usuário, quero ver o nome da página atual no breadcrumb sem link, para que o último item da trilha identifique minha posição atual.
6. Como usuário, quero receber notificações toast ao realizar operações (cadastrar, atualizar, deletar), para que eu tenha feedback imediato sobre o resultado da ação.
7. Como usuário, quero que os toasts desapareçam automaticamente após alguns segundos, para que não precisem ser fechados manualmente.
8. Como usuário, quero poder fechar um toast manualmente antes do tempo, para que eu possa limpar a interface quando quiser.
9. Como usuário, quero ver toasts com variações visuais (sucesso, erro, alerta, informação), para que eu identifique rapidamente a natureza do feedback.
10. Como desenvolvedor, quero injetar o `ToastService` em qualquer componente e chamar `show({ message, type })`, para que eu possa disparar notificações de qualquer lugar da aplicação sem duplicar lógica.
11. Como desenvolvedor, quero passar `actions: TableAction[]` para o `TableComponent`, para que eu possa configurar as ações disponíveis por linha sem criar templates repetitivos.
12. Como desenvolvedor, quero que cada `TableAction` aceite `disabled` e `visible` como funções que recebem a linha, para que eu possa condicionar ações dinamicamente por linha.
13. Como desenvolvedor, quero que o `TableComponent` renderize automaticamente a coluna "Ações" quando `actions.length > 0`, para que eu não precise criar um `ColumnDef` manual para ações.
14. Como desenvolvedor, quero que o `NavSection[]` substitua o `NavItem[]` plano na configuração do sidebar, para que a estrutura de seções seja tipada e declarativa.
15. Como desenvolvedor, quero que todas as rotas dos novos módulos já estejam registradas com `data.breadcrumb`, para que o `BreadcrumbComponent` funcione assim que cada feature for implementada.
16. Como usuário, quero que o menu lateral colapsado oculte os cabeçalhos de seção mas mantenha os ícones dos itens, para que a sidebar compacta continue funcional.
17. Como usuário, quero que o breadcrumb seja omitido nas páginas de login e de erro, para que ele apareça apenas nas páginas autenticadas com layout completo.
18. Como desenvolvedor, quero que o `BreadcrumbComponent` seja um standalone component importado pelo `LayoutComponent`, para que não haja dependência de módulo externo.

## Decisões de implementação

- **NavSection** — nova interface `{ group: string; items: NavItem[] }`. O `SidebarComponent` passa a iterar sobre `NavSection[]` em vez de `NavItem[]`, renderizando um cabeçalho `<span>` para cada grupo antes de renderizar seus itens. Quando a sidebar está colapsada, os cabeçalhos são omitidos. Dois grupos iniciais: `MAIN` (Dashboards, Charts, UI Elements, Maps) e `SISTEMA` (Configurações).

- **Esqueleto de roteamento** — `app.routes.ts` ganha entradas lazy para `/charts`, `/ui-elements` e `/maps`. A rota `/dashboard` passa a usar `redirectTo: 'dashboard/vendas'`; o `dashboardRoutes` é reestruturado para ter rotas filhas `vendas` e `acoes` (stubs inicialmente). Cada rota carrega `data: { breadcrumb: 'Label' }`.

- **BreadcrumbComponent** — lê `ActivatedRoute` recursivamente do root ao leaf coletando `snapshot.data['breadcrumb']` de cada segmento. Renderiza `<nav>` com links para todos exceto o último item. Adicionado ao template do `LayoutComponent` entre o header e o `<router-outlet>`.

- **ToastService** — `Injectable({ providedIn: 'root' })`, mantém `BehaviorSubject<Toast[]>`. Interface `Toast`: `{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info'; duration?: number }`. Métodos: `show(options)` gera UUID, empilha e agenda `dismiss(id)` após `duration` (padrão: 4000ms). `ToastContainerComponent`: standalone, fixed top-right, assina `toasts$` e renderiza pilha com animação de entrada/saída.

- **TableAction** — nova interface `TableAction<T = Record<string, unknown>>`: `{ label: string; icon?: string; variant?: 'default' | 'danger' | 'warning' | 'primary'; action: (row: T) => void; disabled?: (row: T) => boolean; visible?: (row: T) => boolean }`. `TableComponent` ganha `@Input() actions: TableAction[] = []`; quando `actions.length > 0`, uma coluna "Ações" é acrescentada ao final da tabela com botões de ícone para cada action onde `visible(row) !== false`.

## Decisões de teste

- Testes automatizados estão fora de escopo.
- Validação manual: navegar entre todas as rotas stub e verificar que o breadcrumb exibe o caminho correto; disparar toast via `ToastService.show()` em qualquer page e verificar que aparece e desaparece; passar `actions` para o `TableComponent` em alguma página e verificar que a coluna é renderizada com botões funcionais.

## Fora de escopo

- Conteúdo real das páginas de Charts, UI Elements e Maps (serão stubs redirecionando para "em breve").
- Animações avançadas de toast.
- Testes automatizados.
- Página de Configurações (rota referenciada mas sem implementação).

## Notas adicionais

Esta feature é pré-requisito para todos os outros PRDs. Deve ser concluída antes de qualquer implementação de conteúdo das novas páginas.
