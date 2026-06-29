Status: done

# PRD — Layout e Navegação da Aplicação

## Declaração do problema

Sistemas dashboard precisam de um layout consistente com sidebar de navegação e header fixo. Sem um layout base pronto, cada projeto recomeça a construção da estrutura visual do zero, levando a implementações inconsistentes do comportamento de sidebar (collapsar, expandir, comportamento mobile) e da responsividade.

## Solução

Um layout shell completo com sidebar colapsável (3 estados: expandido, minimizado, drawer mobile), header fixo com ações globais e área de conteúdo responsiva. O estado do sidebar é gerenciado por Signal e persiste no `localStorage`. A detecção de breakpoint mobile é automática via Angular CDK `BreakpointObserver`. O layout usa as cores do `ThemeConfig` via CSS custom properties.

## User stories

1. Como usuário, quero que o sidebar exiba ícones e labels de navegação quando expandido, para que eu possa identificar facilmente as seções do sistema.
2. Como usuário, quero clicar em um botão para minimizar o sidebar e exibir apenas ícones, para que eu ganhe mais espaço na área de conteúdo.
3. Como usuário, quero que minha preferência de sidebar (expandido ou minimizado) seja lembrada ao recarregar a página, para que não precise reconfigurar a cada acesso.
4. Como usuário mobile, quero que o sidebar apareça como um drawer deslizante ao tocar no ícone de hamburguer, para que a navegação funcione bem em telas pequenas.
5. Como usuário mobile, quero que o drawer feche ao tocar fora dele ou em um link, para que a área de conteúdo fique visível após a navegação.
6. Como usuário, quero que o header exiba o logo do sistema, um campo de busca, toggle de dark/light mode, notificações e avatar do usuário, para que as ações globais estejam sempre acessíveis.
7. Como usuário, quero que o layout se adapte automaticamente ao tamanho da tela sem eu precisar fazer nada, para que o sistema seja utilizável em qualquer dispositivo.
8. Como desenvolvedor, quero que o `LayoutService` exponha o estado do sidebar como Signal, para que qualquer componente possa reagir às mudanças de layout de forma reativa.
9. Como desenvolvedor, quero que o layout shell seja um componente em `src/app/layout/` que envolve as rotas autenticadas, para que a estrutura visual não seja repetida em cada feature.
10. Como desenvolvedor, quero que a cor do sidebar e do header venham do `ThemeConfig`, para que o layout reflita a identidade visual de cada projeto.

## Decisões de implementação

- **`LayoutComponent`**: componente standalone em `src/app/layout/` com `<router-outlet>` na área de conteúdo. Usado como wrapper nas rotas autenticadas.
- **`SidebarComponent`**: componente standalone em `src/app/layout/sidebar/`. Recebe o estado atual e emite eventos de navegação.
- **`HeaderComponent`**: componente standalone em `src/app/layout/header/`. Injeta `ThemeService` para o toggle de dark/light.
- **`LayoutService`**: serviço em `src/app/core/services/`. Signal `sidebarState: Signal<'expanded' | 'collapsed' | 'mobile-open' | 'mobile-closed'>`. Métodos: `toggle()`, `collapse()`, `expand()`, `openMobileDrawer()`, `closeMobileDrawer()`. Persiste `'expanded' | 'collapsed'` no `localStorage` (estado mobile não é persistido).
- **`BreakpointObserver`**: do `@angular/cdk/layout`. Observa o breakpoint `(max-width: 767px)`. Quando ativo, o `LayoutService` força o modo mobile e ignora o estado salvo no `localStorage`.
- **Sidebar states**:
  - `expanded`: largura total (~240px), ícone + label visíveis
  - `collapsed`: largura reduzida (~64px), apenas ícones com tooltip
  - `mobile-open`: drawer sobreposto com overlay escuro
  - `mobile-closed`: sidebar completamente oculto
- **Menu de navegação**: definido como array de objetos `NavItem` (`{ label, icon, route, children? }`) em `src/app/layout/nav-items.ts`. Renderizado dinamicamente no sidebar.
- **Angular CDK**: instalar `@angular/cdk` para uso do `BreakpointObserver`.

## Decisões de teste

- Testar `LayoutService` isoladamente: `toggle()` alterna entre `expanded` e `collapsed`; abaixo de 768px, estado mobile é ativado; `localStorage` é atualizado corretamente.
- Testar `SidebarComponent` com estado `collapsed` → apenas ícones visíveis no template.
- Não testar pixel-perfect do CSS — testar a presença/ausência de classes CSS que controlam a aparência.

## Fora de escopo

- Menu de navegação com itens reais de negócio — o projeto base inclui apenas itens de exemplo (Dashboard, Configurações)
- Breadcrumb automático baseado na rota
- Múltiplos layouts (ex: layout sem sidebar para páginas públicas) — o layout sem sidebar é tratado no PRD de Autenticação (página de login não usa o layout shell)

## Notas adicionais

- O overlay do drawer mobile deve ter z-index maior que o sidebar para cobrir o conteúdo, mas o sidebar do drawer deve ter z-index ainda maior.
- Em desktop, o toggle do sidebar não bloqueia a interação com o conteúdo.
