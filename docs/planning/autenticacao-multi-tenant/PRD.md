Status: done

# PRD — Autenticação multi-tenant e permissionamento por feature

## Declaração do problema

O frontend hoje autentica com um fluxo mockado de uma única etapa (e-mail + senha), sem conceito de tenant, sem propagar token para um backend real e sem nenhum mecanismo de permissão. O backend real (`AisManager`, documentado em `docs/api/api-reference.md`) é multi-tenant: cada usuário pode acessar um ou mais `Client` (tenant), o token JWT é emitido para um `Client` específico, e a resposta de login traz um array `features` que define o que aquele usuário pode ver/fazer naquele Client. Sem alinhar o frontend a esse modelo, não é possível logar de fato contra o backend, trocar de tenant, tratar sessão expirada, ou controlar o acesso a páginas e ações por permissão — bloqueando qualquer evolução real do produto.

## Solução

Substituir a camada de autenticação mockada por um fluxo real de duas etapas: `POST /auth/clients` (usuário/senha) para descobrir os `Client`s acessíveis, seguido de `POST /auth/login` (usuário/senha + header `clientCode`) para obter o `accessToken` e a sessão completa (`profile`, `client`, `features`, `superUser`). Quando o usuário tem mais de um Client, um modal apresenta a escolha antes do login efetivo; com um único Client, o login prossegue direto. O `accessToken` passa a ser enviado em `Authorization: Bearer` em todas as chamadas; um interceptor global trata `401` (sessão local limpa + redirect para `/login`) e demais erros HTTP (toast com a mensagem vinda do backend). É criada a infraestrutura de permissionamento por `features` — guard de rota e diretiva estrutural — usada a partir de agora em toda página/ação nova, com uma página `403` para acesso negado. As páginas de exemplo (dashboard, charts, maps, ui-elements) passam a ser excluídas do build de produção via `environment.production`, e uma página placeholder mínima (`/home`) passa a ser o destino pós-login enquanto não existem páginas reais do produto.

## User stories

1. Como usuário, quero fazer login informando meu usuário e senha, para começar o processo de autenticação sem precisar saber de antemão qual Client escolher.
2. Como usuário que pertence a um único Client, quero ser autenticado diretamente após informar usuário/senha, sem uma etapa extra de escolha, para que o login seja rápido.
3. Como usuário que pertence a múltiplos Clients (ou sou superUser), quero ver um modal com a lista de Clients disponíveis e escolher em qual quero entrar, para acessar o tenant correto.
4. Como usuário, quero que, ao trocar de Client, o sistema refaça o login com o novo `clientCode` em vez de reaproveitar o token atual, para que a sessão sempre represente exatamente um Client.
5. Como usuário, quero que meu `accessToken` seja enviado automaticamente em todas as chamadas ao backend, para não precisar reautenticar a cada ação.
6. Como usuário, quero ser redirecionado para a tela de login sempre que uma chamada retornar `401` (token ausente, expirado ou inválido), para saber que preciso entrar novamente.
7. Como usuário, quero ver uma mensagem clara (toast) quando alguma ação falhar, usando o texto retornado pelo backend, para entender o que deu errado sem depender de mensagens genéricas.
8. Como usuário, quero que ao clicar em "Sair" minha sessão seja encerrada também no servidor (não só localmente), para que o token deixe de ser válido imediatamente.
9. Como usuário, quero ser impedido de acessar uma página para a qual não tenho a `feature` necessária, vendo uma página 403 clara, para entender que é uma questão de permissão e não um erro do sistema.
10. Como usuário, quero que botões/abas/ações para os quais não tenho a `feature` necessária simplesmente não apareçam na tela, para não me deparar com ações que vão falhar por falta de permissão.
11. Como usuário, quero que o menu lateral mostre apenas os itens que eu de fato posso acessar (por ambiente e por feature), para não encontrar links quebrados.
12. Como usuário em produção, quero cair em uma tela inicial mínima após o login (já que as páginas de exemplo não existem em produção), para ter um destino válido enquanto as páginas reais do produto não existem.
13. Como desenvolvedor, quero um `AuthService` com uma interface clara de sessão (`session`, `isAuthenticated`, `hasFeature`, `login`, `logout`) para que os demais módulos consumam autenticação de forma consistente.
14. Como desenvolvedor, quero declarar a `feature` exigida por uma rota via `data` da rota e ter um guard genérico que a valida, para proteger páginas novas de forma padronizada.
15. Como desenvolvedor, quero uma diretiva estrutural (`*appHasFeature`) para ocultar trechos de UI condicionados a uma `feature`, para não replicar a lógica de checagem em cada componente.
16. Como desenvolvedor, quero que as páginas de exemplo (dashboard, charts, maps, ui-elements) sejam excluídas do build de produção via `environment.production`, para que não sejam entregues aos usuários finais do produto.
17. Como desenvolvedor, quero que a lógica de "qual `feature` protege este recurso" seja decidida caso a caso com o time ao criar cada página/ação nova, para não travar o desenvolvimento com um catálogo rígido de permissões definido antecipadamente.

## Decisões de implementação

- **Modelo de sessão**: novo shape alinhado ao `AuthResponseDTO` real — `accessToken`, `userId`, `name`, `superUser`, `profile` (`id`, `name`, `description`, `master`, `dhCreate`), `clientId`, `client` (`ClientDTO`), `features: string[]`. Substitui por completo o `User` atual (`id`, `name`, `email`, `roles`), que é removido.
- **`AuthRepository`**: interface ampliada para `getClients(credentials): Observable<ClientDTO[]>`, `login(credentials, clientCode): Observable<AuthResponseDTO>`, `logout(): Observable<void>`. O `AuthMockRepository` é removido; um novo `AuthHttpRepository` chama `POST /auth/clients`, `POST /auth/login` (header `clientCode`) e `POST /auth/logout` em `environment.apiUrl`.
- **`AuthService`**: signals para a sessão completa (token, dados do usuário/client/profile/features), `isAuthenticated` computed, e `hasFeature(name: string): boolean` (checagem direta em `features`, sem bypass para `superUser` — `features` é sempre a fonte da verdade). `login()` orquestra as duas etapas; `logout()` chama o backend antes de limpar o estado local.
- **Fluxo de login (UI)**: formulário com `username` (texto simples, sem validação de e-mail) + senha. Ao submeter, chama `getClients`. Se a lista tiver 1 item, prossegue direto para `login` com aquele `clientCode`. Se tiver mais de 1, abre um modal (reaproveitando o padrão `ModalShellComponent`/CDK dialog já usado no projeto) para o usuário escolher o Client antes de chamar `login`. Lista vazia é tratada como qualquer outro erro (toast, permanece na tela de login).
- **Interceptor de auth**: continua injetando `Authorization: Bearer <token>`, passando a excluir tanto `/auth/login` quanto `/auth/clients` (ambos públicos).
- **Interceptor de erro global (novo)**: em `401`, limpa a sessão local e redireciona para `/login` (sem chamar `/auth/logout` nesse caminho — o próprio backend já invalidou/expirou o token). Em qualquer outro status de erro, exibe um toast (via `ToastService` já existente) com `error.error.message` retornado pelo backend.
- **Logout manual**: o menu do header passa a chamar `POST /auth/logout` antes de limpar o estado local e navegar para `/login`.
- **Permissionamento por feature**: guard funcional (`featureGuard`) lendo `route.data['feature']` e verificando `AuthService.hasFeature()`; se ausente, redireciona para `/403`. Diretiva estrutural (`*appHasFeature`) para ocultar elementos de UI (botões, abas, seções) sem a feature necessária. Ambos compartilham a mesma checagem do `AuthService`.
- **Página 403**: novo componente espelhando o padrão visual da página 404 existente.
- **Página placeholder pós-login**: nova página mínima ("em construção"), sem `feature` exigida, que se torna o destino da rota raiz (`''`) dentro do shell autenticado.
- **Exclusão de páginas de exemplo em produção**: as rotas de dashboard, charts, maps e ui-elements (hoje consideradas todas demonstração/placeholder) passam a ser registradas condicionalmente com base em `environment.production`.
- **Menu lateral**: a definição de itens de navegação passa a ser calculada dinamicamente, filtrando por `environment.production` (esconde itens demo em produção) e por `AuthService.hasFeature()` (esconde itens cuja feature o usuário não possui).
- **Configuração de ambiente**: `apiUrl` em `environment.ts` corrigido para o backend real de desenvolvimento (`http://localhost:8080`); `environment.prod.ts` mantém o domínio de produção a ser definido.
- **Regra de processo (não runtime)**: ao criar uma página nova, ou um componente/ação nova dentro de uma página já permissionada, quem estiver implementando deve perguntar ao humano qual `feature` (string) deve proteger aquele recurso antes de aplicá-la via `data` de rota ou `*appHasFeature` — não existe um catálogo automático ou inferido de features.

## Decisões de teste

- Seguir o padrão já usado no projeto (Angular `TestBed` + Jest; único exemplo hoje é `app.component.spec.ts`, ainda que mínimo/boilerplate).
- `AuthService`: testar `hasFeature()` com diferentes arrays de `features`; testar a orquestração de `login()` (duas etapas) usando uma implementação fake de `AuthRepository` como seam — preferir essa seam a mockar `HttpClient` diretamente.
- `AuthHttpRepository`: testar com `HttpTestingController` — corpo e headers corretos em `/auth/clients` e `/auth/login` (incluindo o header `clientCode`), e chamada a `/auth/logout`.
- `authInterceptor`: com token presente, header `Authorization` é adicionado; requisições para `/auth/clients` e `/auth/login` não recebem o header.
- Interceptor de erro global: `401` dispara limpeza de sessão + navegação para `/login`; outros status disparam `ToastService.show()` com a mensagem do backend.
- `featureGuard`: testar via `TestBed.runInInjectionContext`, com `AuthService` mockado — feature presente retorna `true`; feature ausente retorna `UrlTree` para `/403`.
- Diretiva `*appHasFeature`: testar que o elemento é renderizado/removido do DOM conforme a presença da feature na sessão mockada.
- Não testar `localStorage` diretamente — testar o comportamento resultante (`isAuthenticated`, `hasFeature`, navegação).
- Não depender do backend real rodando — todos os testes usam fakes/`HttpTestingController`.

## Fora de escopo

- Refresh token e renovação automática de sessão.
- OAuth2 / SSO / login social / MFA.
- Recuperação de senha.
- Qualquer feature de negócio real na página placeholder `/home` — ela existe apenas para não deixar a rota raiz quebrada em produção.
- Persistir/lembrar o último `clientCode` escolhido entre sessões.
- Bypass de checagem de feature para `superUser` no frontend.
- Migração para NgRx ou outro state management global além dos signals já usados no projeto.
- Um catálogo centralizado/validado de `features` — os nomes são definidos caso a caso conforme o backend os expõe.

## Notas adicionais

- Este PRD substitui, na prática, o comportamento descrito em `docs/planning/autenticacao/PRD.md` (login single-step com mock, `Status: done`) — aquele documento permanece como registro histórico da primeira versão; o comportamento real do app a partir de agora segue este documento.
- Nomes de `feature` seguem o vocabulário retornado pelo backend (ex.: `PORT_VIEW`, `AREA_VIEW`, `AREA_EDIT` no exemplo de `docs/api/api-reference.md`).
- Ao concluir a implementação, `docs/architecture/architecture.md` deve ser atualizado para refletir o novo fluxo de autenticação, o mecanismo de permissionamento e a exclusão de páginas de exemplo em produção.
