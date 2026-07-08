Status: done

# PRD — Estados de carregamento visíveis e recarregamento correto ao (re)acessar páginas

## Declaração do problema

O usuário depende de um backend que às vezes demora para responder. Hoje, quando ele sai de uma página e volta, ou navega para um registro diferente dentro da mesma tela (ex.: de um porto para outro em `/ports/:id`), a tela não deixa claro que uma nova busca está em andamento — na melhor hipótese os dados somem sem indicação visual, na pior o usuário continua vendo os dados do registro/visita anterior até a resposta chegar, achando que está vendo informação atual quando não está.

Investigação no código confirmou duas causas distintas, ambas em escopo:

1. **Falta de estado de loading visível**: hoje só o `TableComponent` tem suporte a um estado de carregamento (com efeito "piscando" via `animate-pulse`). Os cards (`KpiCard`, `StatCard`, `TickerCard`) e todos os 7 componentes de gráfico não têm nenhum input de loading — renderizam direto em cima do dado recebido, sem nenhuma pista visual de que uma busca está em andamento.
2. **Bug de recarregamento em rotas com parâmetro**: em `/ports/:id`, o Angular reaproveita a mesma instância do componente ao navegar entre IDs diferentes (estratégia padrão de reuso de rotas), e a busca de detalhes do porto hoje só é disparada uma vez, no construtor. Isso significa que navegar de um porto para outro sem sair da rota pode deixar os dados do porto anterior na tela indefinidamente, não só por uma janela curta.

## Solução

- Todos os componentes de exibição de dados do catálogo compartilhado (`KpiCard`, `StatCard`, `TickerCard`, e os 7 componentes de gráfico) ganham um input `loading`, que troca o conteúdo real por um esqueleto "piscando" (novo componente compartilhado `SkeletonComponent`, com variações de tamanho por tipo — card vs. gráfico), no mesmo espírito do que `TableComponent` já faz hoje.
- Cada serviço de dados das páginas reais de produto (`PortsService`, `PortConfigService`, `TerminalConfigService`, `BerthConfigService`, `AreaService`) passa a expor um sinal `loading: Signal<boolean>` explícito e independente do dado em si — verdadeiro do início ao fim de qualquer busca, seja ela a busca inicial, um recarregamento disparado por busca/filtro, ou (no caso de detalhes de porto) uma mudança de parâmetro de rota.
- `PortDetailsPageComponent` passa a reagir a mudanças no parâmetro de rota (`:id`) e recarregar os detalhes do porto a cada mudança, em vez de carregar uma única vez no construtor — corrigindo o bug de dados desatualizados ao trocar de porto sem sair da rota.
- Cada página real de produto (`/ports`, `/ports/:id` → aba Geral, e as telas de configuração de portos/terminais/berços/áreas em `/settings/*`) passa a conectar o sinal `loading` do seu serviço aos componentes que exibe (tabela, cards, gráficos), substituindo qualquer gate manual de loading feito "na mão" (ex.: a aba Geral de porto hoje esconde a aba inteira com divs de pulso escritos à mão) por esse padrão único.
- Páginas de demonstração/mock (`/dashboard`, `/charts`, `/ui-elements/*`, `/maps`) não são conectadas a loading real — os componentes compartilhados ganham o suporte de forma genérica (então essas páginas se beneficiam se algum dia usarem dados reais), mas conectar o sinal de loading nelas está fora de escopo.

## User stories

1. Como usuário, quero que um KPI/Stat/Ticker card mostre um efeito de carregamento "piscando" enquanto o dado dele está sendo buscado, para que eu saiba que a informação ainda não chegou.
2. Como usuário, quero que qualquer gráfico (linha, barra, área, misto, pizza, timeline, série temporal) mostre o mesmo efeito de carregamento enquanto os dados dele estão sendo buscados, para que eu não confunda um gráfico desatualizado com um gráfico atual.
3. Como usuário, quero que o efeito de carregamento seja visualmente consistente entre tabela, cards e gráficos, para que eu reconheça o mesmo padrão em qualquer lugar do app.
4. Como usuário, ao acessar a lista de Portos, quero ver o efeito de carregamento na tabela enquanto os dados são buscados, para que eu saiba que a lista ainda está sendo montada.
5. Como usuário, ao abrir os detalhes de um porto (aba Geral), quero ver os cards e o gráfico com o efeito de carregamento enquanto os dados daquele porto são buscados, para que eu não veja informação de outro porto por engano.
6. Como usuário, ao navegar de um porto para outro (ex.: através de um link ou busca) sem sair da seção de detalhes, quero que os dados sejam buscados novamente e o efeito de carregamento apareça de novo, para que eu não veja os dados do porto anterior persistindo na tela.
7. Como usuário, ao acessar as telas de configuração (Portos, Terminais, Berços, Áreas em Configurações), quero ver o efeito de carregamento na tabela enquanto os dados são (re)buscados, para que fique claro quando uma busca/filtro está em andamento.
8. Como usuário, quero que o efeito de carregamento desapareça tanto em caso de sucesso quanto de erro da busca, para que a tela nunca fique "presa" piscando para sempre.
9. Como desenvolvedor consumindo esses serviços no futuro, quero uma convenção clara de como expor o estado de carregamento de uma busca, para que eu siga o mesmo padrão ao criar um serviço novo.

## Decisões de implementação

- Novo componente compartilhado `SkeletonComponent` (catálogo `shared/ui/`), com uma variação de tamanho/forma por tipo de consumidor (ex.: `variant: 'card' | 'chart'`), usando o mesmo efeito `animate-pulse` já usado pelo `TableComponent`.
- `KpiCardComponent`, `StatCardComponent`, `TickerCardComponent` e os 7 componentes de gráfico (`LineChart`, `BarChart`, `AreaChart`, `MixedChart`, `PieChart`, `TimelineChart`, `TimeSeriesChart`) ganham um input `loading` (padrão `false`); quando `true`, renderizam o `SkeletonComponent` no lugar do conteúdo real.
- Convenção de serviço: todo serviço de dados de página real expõe um sinal `loading: Signal<boolean>`, ligado ao ciclo de vida de cada busca (`true` ao iniciar, `false` ao finalizar — sucesso ou erro), independente do sinal com o dado em si. Aplica-se a buscas orientadas por `toSignal`/`switchMap` (ex.: listagens com busca/filtro) e a buscas imperativas (ex.: carregar detalhes de um registro específico).
- `PortDetailsPageComponent` deixa de carregar os detalhes do porto uma única vez no construtor e passa a reagir a mudanças no parâmetro de rota (`:id`), disparando um novo carregamento (e o respectivo `loading`) a cada mudança — corrige o reaproveitamento de instância do Angular para rotas com o mesmo `routeConfig` e parâmetros diferentes.
- `GeneralTabComponent` (aba "Geral" de detalhes do porto) substitui o gate manual atual (esconder a aba inteira com divs de pulso escritos à mão) por `[loading]` conectado individualmente em cada `StatCard`/gráfico que ele usa.
- Cada página de configuração (`ports-config-page`, `terminals-config-page`, `berths-config-page`, `areas-config-page`) conecta `[loading]` da sua tabela ao sinal `loading` do respectivo serviço — hoje esse gap já existe em pelo menos uma dessas telas (o `TableComponent` já suporta `loading`, mas não está conectado).
- Fora do escopo desta mudança: alterar a estratégia de reuso de rotas do Angular de forma global (`RouteReuseStrategy`) — a correção do bug de `/ports/:id` é feita localmente, reagindo a mudanças de parâmetro dentro do próprio componente afetado.

## Decisões de teste

- Testes de componente para `SkeletonComponent`, e para cada componente do catálogo (`KpiCard`, `StatCard`, `TickerCard`, um representante de gráfico como padrão a ser replicado nos demais): `loading=true` renderiza o esqueleto e oculta o conteúdo real; `loading=false` (padrão) mantém o comportamento atual inalterado — sem regressão nas páginas de demonstração que já os usam.
- Testes de serviço: o sinal `loading` alterna para `true` no início de cada busca (inicial, por busca/filtro, ou por mudança de parâmetro) e volta para `false` ao final, tanto em sucesso quanto em erro — usando um `Subject`/observable controlado manualmente para inspecionar o estado intermediário (mesmo padrão de testes já usado nos specs de serviço existentes).
- Teste de `PortDetailsPageComponent`/`PortsService` cobrindo especificamente o bug corrigido: simular uma mudança de parâmetro de rota (`ActivatedRoute.paramMap`) de um ID para outro e verificar que uma nova busca é disparada (sem depender de destruir/recriar o componente).
- Suíte completa (`npx jest`) deve continuar passando sem regressões nas páginas e fluxos já cobertos por specs existentes.

## Fora de escopo

- Conectar loading real nas páginas de demonstração/mock (`/dashboard`, `/charts`, `/ui-elements/*`, `/maps`) — os componentes compartilhados suportam `loading` de forma genérica, mas essas páginas não são conectadas.
- Qualquer estratégia de cache/otimização de requisições repetidas — este PRD trata só de feedback visual e da garantia de que a busca é refeita quando necessário, não de performance.
- Mudança na forma como erros são tratados/exibidos (o interceptor global de erro continua funcionando como hoje); este PRD só garante que `loading` volta para `false` também em caso de erro.
- `RouteReuseStrategy` customizada — ver "Decisões de implementação".

## Notas adicionais

Este PRD nasceu de uma sessão `grill-me` com o usuário, que confirmou explicitamente vivenciar os dois cenários de dados desatualizados investigados (troca de registro na mesma rota, e reentrada numa página/seção).
