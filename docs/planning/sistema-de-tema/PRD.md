Status: done

# PRD — Sistema de Tema e Configuração por Projeto

## Declaração do problema

Cada sistema construído sobre o projeto base (AIS, Meteorologia, etc.) tem identidade visual própria: cor primária, cor do menu, cor do header, logo e modo padrão (claro ou escuro). Hoje não existe um ponto centralizado para essas configurações — elas ficam espalhadas em CSS, componentes e assets, tornando a personalização por projeto trabalhosa e propensa a inconsistências.

## Solução

Um arquivo de configuração central e tipado (`theme.config.ts`) que concentra todas as variáveis visuais do projeto. Esse arquivo é injetado via token de injeção de dependência do Angular, tornando a configuração disponível em qualquer componente sem prop drilling. O desenvolvedor que iniciar um novo projeto edita apenas esse arquivo para personalizar toda a identidade visual.

## User stories

1. Como desenvolvedor iniciando um novo projeto, quero editar um único arquivo para mudar logo, cores e modo padrão, para que a personalização seja feita em minutos.
2. Como desenvolvedor, quero que a configuração seja tipada em TypeScript, para que erros de configuração sejam detectados em tempo de compilação.
3. Como usuário final, quero alternar entre modo claro e escuro durante o uso, para que eu possa usar o sistema no ambiente visual que prefiro.
4. Como usuário final, quero que minha preferência de modo (claro/escuro) seja lembrada entre sessões, para que não precise reconfigurar a cada acesso.
5. Como desenvolvedor, quero injetar `ThemeConfig` em qualquer componente via DI, para que eu possa usar a cor primária ou o logo sem importações manuais de constantes.
6. Como desenvolvedor, quero que a cor primária do Tailwind seja derivada da configuração do tema, para que botões, links e destaques reflitam automaticamente a identidade visual do projeto.
7. Como desenvolvedor, quero que o modo escuro seja ativado adicionando a classe `dark` ao elemento `<html>`, para que todos os componentes com classes `dark:` do Tailwind respondam automaticamente.
8. Como tech lead, quero que a configuração do tema seja a única diferença entre dois projetos no nível de identidade visual, para que o projeto base seja verdadeiramente reutilizável.

## Decisões de implementação

- **Interface `ThemeConfig`**: definida em `src/app/core/config/theme.config.ts`. Campos: `defaultMode: 'light' | 'dark'`, `primaryColor: string` (valor CSS hex/HSL), `menuColor: string`, `headerColor: string`, `logoUrl: string`, `appName: string`.
- **Token DI**: `THEME_CONFIG` criado com `InjectionToken<ThemeConfig>`. Provido em `app.config.ts` via `{ provide: THEME_CONFIG, useValue: themeConfig }`.
- **`ThemeService`**: serviço em `core/services/` com Signal `currentMode: Signal<'light' | 'dark'>`. Método `toggleMode()` alterna o valor e aplica/remove a classe `dark` no `document.documentElement`. Persiste preferência no `localStorage` com chave `theme-mode`.
- **Inicialização**: `APP_INITIALIZER` em `app.config.ts` lê `localStorage` e aplica a classe `dark` antes do primeiro render, evitando flash de tema errado (FOUT).
- **CSS custom properties**: `ThemeService` aplica as cores do `ThemeConfig` como variáveis CSS (`--color-primary`, `--color-menu-bg`, `--color-header-bg`) no `:root` na inicialização, permitindo uso nos componentes.
- **Tailwind**: a classe `dark` no `<html>` ativa o dark mode (estratégia `class` configurada na issue de setup).

## Decisões de teste

- Um bom teste verifica comportamento externo: `ThemeService.toggleMode()` → classe `dark` aparece/desaparece no `document.documentElement`; `localStorage` é atualizado.
- Testar `ThemeService` com `TestBed` e `jest.spyOn(localStorage, 'setItem')`.
- Não testar detalhes internos como o nome da chave do `localStorage` ou o valor exato da classe CSS — testar o efeito observável.

## Fora de escopo

- Múltiplos temas por projeto (ex: tema por tenant/usuário) — cada projeto tem um único tema
- Editor de tema visual em runtime (painel de configuração para o usuário final mudar cores)
- Temas pré-definidos (ex: tema "azul corporativo", tema "verde natureza") — o dev configura livremente

## Notas adicionais

- O arquivo `theme.config.ts` é o único arquivo que o dev edita ao iniciar um novo projeto para configuração visual.
- O `logoUrl` deve apontar para um arquivo em `src/assets/` para facilitar a substituição.
