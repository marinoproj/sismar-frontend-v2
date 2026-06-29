Status: done

# 01 — Instalar e configurar ng-apexcharts

## O que construir

Instalar `ng-apexcharts` via pnpm. Criar a interface `ChartData` em `src/app/shared/models/chart-data.model.ts` para tipagem dos dados de entrada dos componentes de gráfico. Criar a estrutura de pastas `src/app/shared/ui/charts/` pronta para receber os componentes.

## Critérios de aceite

- [ ] `ng-apexcharts` instalado e listado em `package.json`
- [ ] Interface `ChartData` definida com campos: `name: string`, `data: (number | [number, number] | { x: string | number; y: number })[]`
- [ ] Pasta `src/app/shared/ui/charts/` criada
- [ ] `pnpm build` não gera erros após a instalação
- [ ] Componente de teste mínimo (pode ser descartado) renderiza um gráfico ApexCharts sem erro no console

## Bloqueado por

- [setup-infraestrutura/issues/01](../../setup-infraestrutura/issues/01-criar-projeto-angular-19.md)
