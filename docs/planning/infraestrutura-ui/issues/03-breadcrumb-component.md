Status: done

## Issue pai

[PRD — Infraestrutura de UI](../PRD.md)

## O que construir

Criar o `BreadcrumbComponent` standalone em `shared/ui/breadcrumb/` e integrá-lo ao `LayoutComponent` para que apareça em todas as páginas internas autenticadas.

O componente lê `ActivatedRoute` recursivamente do root ao leaf, coletando `snapshot.data['breadcrumb']` de cada segmento de rota que tiver o campo definido. Renderiza uma trilha de navegação (`Home > Dashboards > Vendas`) onde todos os itens exceto o último são links clicáveis (`routerLink`).

O resultado observável: ao navegar para `/dashboard/vendas`, o breadcrumb exibe "Dashboards > Vendas". Ao navegar para `/charts/line`, exibe "Charts > Line Charts". O último item não é clicável.

## Critérios de aceite

- [ ] `BreadcrumbComponent` criado em `shared/ui/breadcrumb/breadcrumb.component.ts` como standalone component.
- [ ] Lê `data['breadcrumb']` recursivamente de todos os segmentos da rota ativa.
- [ ] Renderiza trilha com separador ">" entre os itens.
- [ ] Todos os itens exceto o último são links com `routerLink`.
- [ ] O último item (página atual) não é clicável e tem estilo diferenciado.
- [ ] `BreadcrumbComponent` é importado pelo `LayoutComponent` e aparece no template entre o header e o `<router-outlet>`.
- [ ] Não aparece em páginas fora do `LayoutComponent` (login, erros).
- [ ] Responde a mudanças de rota sem necessidade de reload da página.
- [ ] Funciona em tema claro e escuro.

## Bloqueado por

- [02 — Routing skeleton](02-routing-skeleton.md) (as rotas com `data.breadcrumb` precisam existir para o componente ter dados para ler)
