Status: done

# PRD — Menu UI Elements: Biblioteca de Componentes Reutilizáveis

## Declaração do problema

O sistema não possui uma biblioteca padronizada de componentes base (alertas, badges, botões, cards, dropdowns, etc.), forçando cada feature a reimplementar esses elementos de forma inconsistente. Isso gera divergências visuais entre telas e aumenta o custo de manutenção.

## Solução

Criar 9 componentes reutilizáveis em `shared/ui/` e um menu "UI elements" com subpáginas de showcase que documentam visualmente cada componente e suas variações. Cada componente é configurável via `@Input()` e pode ser importado por qualquer feature da aplicação.

## User stories

1. Como desenvolvedor, quero usar `<app-alert type="success" message="...">` em qualquer página, para que eu exiba alertas padronizados sem duplicar HTML.
2. Como desenvolvedor, quero usar `<app-badge label="Novo" variant="primary">`, para que eu exiba badges com estilo consistente.
3. Como desenvolvedor, quero usar `<app-button variant="primary" [loading]="isLoading">`, para que eu tenha botões com estado de loading e variações de estilo unificadas.
4. Como desenvolvedor, quero usar `<app-card>` com slots de header, body e footer via `ng-content`, para que eu componha cards sem repetir estrutura HTML.
5. Como desenvolvedor, quero usar `<app-dropdown [items]="opcoes">`, para que eu exiba menus dropdown funcionais sem reimplementar toggle de visibilidade.
6. Como desenvolvedor, quero usar `<app-list-group [items]="lista">`, para que eu renderize listas de itens com estilo padronizado e suporte a item ativo e badge.
7. Como desenvolvedor, quero usar `<app-progress [value]="65" [max]="100">`, para que eu exiba barras de progresso sem estilos inline.
8. Como desenvolvedor, quero usar `<app-spinner size="md">`, para que eu exiba indicadores de carregamento sem reimplementar animação CSS.
9. Como desenvolvedor, quero injetar `ToastService` e chamar `show({ message, type })`, para que eu dispare notificações toast já implementadas no PRD de infraestrutura.
10. Como usuário, quero acessar "UI elements > Alerts" no menu, para que eu veja todas as variações do componente Alert (info, success, warning, danger, com e sem botão de fechar).
11. Como usuário, quero acessar "UI elements > Badges" no menu, para que eu veja todas as variações do componente Badge.
12. Como usuário, quero acessar "UI elements > Buttons" no menu, para que eu veja todas as variações de variante e tamanho do componente Button, incluindo o estado de loading.
13. Como usuário, quero acessar "UI elements > Cards" no menu, para que eu veja exemplos de cards com diferentes combinações de header, body e footer.
14. Como usuário, quero acessar "UI elements > Dropdowns" no menu, para que eu veja dropdowns funcionais com diferentes listas de itens.
15. Como usuário, quero acessar "UI elements > List group" no menu, para que eu veja exemplos de list groups com itens ativos e com badges.
16. Como usuário, quero acessar "UI elements > Progress" no menu, para que eu veja barras de progresso com diferentes valores, variantes e labels.
17. Como usuário, quero acessar "UI elements > Spinners" no menu, para que eu veja spinners em diferentes tamanhos e cores.
18. Como usuário, quero acessar "UI elements > Toasts" no menu e clicar em botões para disparar toasts, para que eu veja na prática como o sistema de notificação funciona.
19. Como usuário, quero que cada página de UI elements exiba o breadcrumb correto (ex: "UI Elements > Alerts"), para que eu saiba onde estou na navegação.
20. Como desenvolvedor, quero que `AlertComponent` aceite `@Input() dismissible: boolean`, para que o usuário possa fechar o alerta clicando em um botão "×".
21. Como desenvolvedor, quero que `DropdownComponent` feche automaticamente ao clicar fora dele, para que a UX seja consistente com o comportamento esperado de um dropdown.
22. Como desenvolvedor, quero que `ButtonComponent` emita `@Output() clicked` e não execute a ação quando `[disabled]` ou `[loading]` for true, para que estados inativos sejam seguros.

## Decisões de implementação

- **AlertComponent** — `shared/ui/alert/`. `@Input()`: `type: 'info'|'success'|'warning'|'danger'` (default: 'info'), `message: string`, `dismissible?: boolean`. Quando `dismissible`, exibe botão "×" que oculta o componente via flag interna.

- **BadgeComponent** — `shared/ui/badge/`. `@Input()`: `label: string`, `variant: 'default'|'primary'|'success'|'warning'|'danger'` (default: 'default').

- **ButtonComponent** — `shared/ui/button/`. `@Input()`: `variant: 'primary'|'secondary'|'outline'|'danger'|'ghost'` (default: 'primary'), `size: 'sm'|'md'|'lg'` (default: 'md'), `loading?: boolean`, `disabled?: boolean`, `type?: 'button'|'submit'|'reset'`. `@Output()`: `clicked: EventEmitter<void>`. Quando `loading`, exibe `SpinnerComponent` inline e bloqueia o clique.

- **CardComponent** — `shared/ui/card/`. Usa `ng-content select="[card-header]"`, `[card-body]`, `[card-footer]` para slots nomeados. Wrapper com borda, sombra leve e padding padrão Tailwind.

- **DropdownComponent** — `shared/ui/dropdown/`. `@Input()`: `label: string`, `items: DropdownItem[]` onde `DropdownItem = { label: string; action: () => void }`. Toggle de visibilidade via `(click)` no botão; fecha ao clicar fora via `@HostListener('document:click')`.

- **ListGroupComponent** — `shared/ui/list-group/`. `@Input()`: `items: ListGroupItem[]` onde `ListGroupItem = { label: string; badge?: string; active?: boolean }`.

- **ProgressComponent** — `shared/ui/progress/`. `@Input()`: `value: number`, `max?: number` (default: 100), `label?: string`, `variant?: 'primary'|'success'|'warning'|'danger'` (default: 'primary'). Calcula `percent = (value/max)*100`.

- **SpinnerComponent** — `shared/ui/spinner/`. `@Input()`: `size: 'sm'|'md'|'lg'` (default: 'md'), `color?: string`. Animação CSS pura (border-spin via Tailwind `animate-spin`).

- **Toast** — não cria novo componente; a página `ToastsPage` demonstra o `ToastService` existente (criado no PRD `infraestrutura-ui`) com botões que disparam toasts de cada tipo.

- **Rotas** — `/ui-elements/alerts`, `/ui-elements/badges`, `/ui-elements/buttons`, `/ui-elements/cards`, `/ui-elements/dropdowns`, `/ui-elements/list-group`, `/ui-elements/progress`, `/ui-elements/spinners`, `/ui-elements/toasts`. Lazy-loaded via `features/ui-elements/routes.ts`.

## Decisões de teste

- Testes automatizados fora de escopo.
- Validação manual: navegar por cada subpágina e verificar que todos os variants são exibidos; clicar no botão de fechar do Alert e verificar que some; abrir Dropdown e clicar fora e verificar que fecha; na página Toasts, disparar cada tipo e verificar que aparecem e somem automaticamente.

## Fora de escopo

- Modal/Dialog component.
- Form controls (inputs, selects, checkboxes) — pertencem a um PRD de formulários futuro.
- Testes automatizados.

## Notas adicionais

Depende do PRD `infraestrutura-ui` para menu, breadcrumb e ToastService. Os 9 componentes são independentes entre si e podem ser implementados em paralelo.
