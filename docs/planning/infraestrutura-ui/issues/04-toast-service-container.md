Status: done

## Issue pai

[PRD — Infraestrutura de UI](../PRD.md)

## O que construir

Criar o `ToastService` singleton e o `ToastContainerComponent`, integrando o container ao `LayoutComponent` para que toasts possam ser disparados de qualquer parte da aplicação.

`ToastService` é um `Injectable({ providedIn: 'root' })` que mantém um `BehaviorSubject<Toast[]>`. Interface `Toast`: `{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info'; duration?: number }`. Métodos: `show(options: Omit<Toast, 'id'>)` gera um UUID, empilha o toast e agenda `dismiss(id)` após `duration` (padrão 4000ms). `dismiss(id)` remove o toast do array.

`ToastContainerComponent` é um standalone component fixo no canto superior direito da tela, que assina `toasts$` do serviço e renderiza cada toast com ícone, mensagem e botão de fechar manual. Animação de entrada/saída via classes Tailwind.

O resultado observável: em qualquer componente da app, injetar `ToastService` e chamar `show({ message: 'Usuário cadastrado', type: 'success' })` faz um toast aparecer no canto superior direito e desaparecer após 4 segundos.

## Critérios de aceite

- [ ] `ToastService` criado em `shared/ui/toast/toast.service.ts` com `providedIn: 'root'`.
- [ ] Interface `Toast` exportada do mesmo arquivo ou de `shared/models/`.
- [ ] `ToastService.show()` aceita `message`, `type` e `duration` opcional.
- [ ] `ToastService.dismiss(id)` remove o toast imediatamente.
- [ ] `ToastContainerComponent` criado em `shared/ui/toast/toast-container.component.ts`.
- [ ] `ToastContainerComponent` renderiza toasts empilhados no canto superior direito (fixed, z-index alto).
- [ ] Cada toast tem: ícone por tipo, mensagem, botão "×" para fechar manualmente.
- [ ] Toast some automaticamente após `duration` ms.
- [ ] `ToastContainerComponent` importado pelo `LayoutComponent` e adicionado ao template.
- [ ] Múltiplos toasts simultâneos são empilhados corretamente.
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

Nenhum — pode começar imediatamente (paralelo às issues 01 e 02).
