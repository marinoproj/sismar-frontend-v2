Status: done

## Issue pai

[PRD — Menu UI Elements: Biblioteca de Componentes Reutilizáveis](../PRD.md)

## O que construir

Criar a página `ToastsPageComponent` em `/ui-elements/toasts` que demonstra o `ToastService` (implementado no PRD de infraestrutura-ui) de forma interativa. A página exibe botões para disparar cada tipo de toast (success, error, warning, info) e explica os parâmetros disponíveis.

A página também serve como prova de integração: ao clicar em "Disparar Toast de Sucesso", um toast verde aparece no canto superior direito da tela e desaparece após 4 segundos.

## Critérios de aceite

- [ ] `ToastsPageComponent` criada e acessível em `/ui-elements/toasts`.
- [ ] Página exibe 4 botões, um por tipo de toast (success, error, warning, info).
- [ ] Clicar em cada botão dispara o toast correspondente via `ToastService.show()`.
- [ ] Toast aparece no canto superior direito e some automaticamente após ~4s.
- [ ] Múltiplos cliques empilham múltiplos toasts.
- [ ] Breadcrumb exibe "UI Elements > Toasts".
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [infraestrutura-ui/04 — Toast Service](../../infraestrutura-ui/issues/04-toast-service-container.md)
- [ui-elements-showcase/01 — Routes + Alert + Badge](01-ui-elements-routes-e-alert-badge.md)
