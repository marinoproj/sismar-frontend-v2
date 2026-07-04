# Referência de API — AisManager

Documentação de todos os endpoints REST expostos pelo AisManager, agrupados por contexto de domínio.

- **Base URL:** `http://localhost:8080` em produção (ajuste para o seu ambiente; localmente o `application-local.properties` sobe o servidor na porta `10004`).
- **Formato:** todo corpo de requisição/resposta é `application/json`, exceto `GET /object-data/{mmsi}/track/csv` (retorna CSV).
- **Autenticação:** ver seção [Autenticação e Acesso](#autenticação-e-acesso) — é pré-requisito para entender qualquer outro endpoint deste documento.

## Sumário

1. [Autenticação e Acesso](#autenticação-e-acesso)
2. [Erros comuns](#erros-comuns)
3. [Portos e Infraestrutura Portuária](#portos-e-infraestrutura-portuária)
4. [Rastreamento AIS e Objetos](#rastreamento-ais-e-objetos)
5. [Notificações](#notificações)
6. [Integrações Externas](#integrações-externas)

---

## Autenticação e Acesso

O AisManager é multi-tenant: cada usuário pertence a um ou mais **Client** (tenant), e o token de acesso é emitido **para um Client específico**. Por isso o login é sempre um processo de **duas etapas**:

1. **Descubra a quais Clients o usuário tem acesso** — `POST /auth/clients`, usando apenas usuário e senha.
2. **Faça login informando o `clientCode` escolhido** — `POST /auth/login`, usando usuário/senha (no corpo) **+** o `clientCode` (em um header). A resposta traz o token JWT (`accessToken`).
3. **Use o token em todas as demais requisições** — header `Authorization: Bearer <accessToken>`. **Não é necessário reenviar o `clientCode`** nas chamadas seguintes: o `clientCode` só é usado nesse momento do login, para o servidor decidir em nome de qual Client o token será emitido — a partir daí o `clientId` já fica embutido na sessão associada ao token.

Isso significa que, se o mesmo usuário precisar trocar de Client, ele deve repetir o login (`POST /auth/login`) com o novo `clientCode` — um mesmo token nunca representa mais de um Client.

### Fluxo completo (exemplo end-to-end)

**Passo 1 — listar Clients acessíveis:**

```bash
curl -X POST http://localhost:8080/auth/clients \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joao.silva",
    "password": "minhaSenha123"
  }'
```

Resposta (`200 OK`):

```json
[
  {
    "id": 1,
    "code": "SANTOS",
    "name": "Porto de Santos",
    "dhCreate": "2025-01-10T09:00:00",
    "dhDeleted": null,
    "enableAreaNotifications": true
  },
  {
    "id": 2,
    "code": "ITAJAI",
    "name": "Porto de Itajaí",
    "dhCreate": "2025-03-02T11:20:00",
    "dhDeleted": null,
    "enableAreaNotifications": false
  }
]
```

Se o usuário for `superUser`, essa lista traz **todos** os Clients ativos do sistema. Caso contrário, traz no máximo um item — o Client ao qual o usuário pertence (lista vazia se o Client do usuário estiver desativado).

**Passo 2 — login escolhendo um `clientCode` da lista acima:**

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -H "clientCode: SANTOS" \
  -d '{
    "username": "joao.silva",
    "password": "minhaSenha123"
  }'
```

Resposta (`200 OK`):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2FvLnNpbHZhIiwic2lkIjoiZjQ3YWM...",
  "userId": 42,
  "name": "João Silva",
  "superUser": false,
  "profile": {
    "id": 3,
    "name": "Operacional",
    "description": "Perfil de operação do dia a dia",
    "master": false,
    "dhCreate": "2025-01-10T09:00:00"
  },
  "clientId": 1,
  "client": {
    "id": 1,
    "code": "SANTOS",
    "name": "Porto de Santos",
    "dhCreate": "2025-01-10T09:00:00",
    "dhDeleted": null,
    "enableAreaNotifications": true
  },
  "features": ["PORT_VIEW", "AREA_VIEW", "AREA_EDIT"]
}
```

**Passo 3 — use `accessToken` em todas as demais chamadas:**

```bash
curl -X GET http://localhost:8080/ports \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2FvLnNpbHZhIiwic2lkIjoiZjQ3YWM..."
```

Note que **nenhum header de `clientCode` é enviado aqui** — só o `Authorization: Bearer <token>` é necessário. O servidor já sabe qual é o Client dessa sessão desde o login.

### `POST /auth/clients`

Lista os Clients que o usuário (autenticado por usuário/senha, não por token) pode acessar. É o passo que **sempre precede** o login, para o cliente da aplicação (frontend, script, etc.) saber quais `clientCode` oferecer para escolha.

**Autenticação:** nenhuma (endpoint público, liberado em `SecurityConfig`).

**Corpo da requisição** (`LoginRequestDTO`):

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `username` | string | sim | Login do usuário |
| `password` | string | sim | Senha em texto plano (trafegada só sobre HTTPS em produção) |

**Resposta de sucesso (`200 OK`):** lista de `ClientDTO` (campos descritos na seção [Client](#client)).

**Erros possíveis:**

| Status | Quando ocorre |
|---|---|
| `401 Unauthorized` | Usuário ou senha inválidos (`InvalidCredentialsException`) |

```json
{
  "timestamp": "2026-07-04T10:15:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Usuário ou senha inválidos",
  "path": "/auth/clients"
}
```

### `POST /auth/login`

Autentica o usuário **no contexto de um Client específico** e emite o token JWT.

**Autenticação:** nenhuma (endpoint público).

**Headers:**

| Header | Obrigatório | Descrição |
|---|---|---|
| `clientCode` | sim | Código do Client escolhido (um dos `code` retornados por `POST /auth/clients`) |

**Corpo da requisição** (`LoginRequestDTO`): igual ao de `POST /auth/clients` (`username` + `password`).

**Resposta de sucesso (`200 OK`):** `AuthResponseDTO`

| Campo | Tipo | Descrição |
|---|---|---|
| `accessToken` | string | Token JWT — use em `Authorization: Bearer <accessToken>` nas próximas chamadas |
| `userId` | number | ID do usuário autenticado |
| `name` | string | Nome do usuário |
| `superUser` | boolean | Se `true`, o usuário tem acesso irrestrito (não pertence a um Client fixo) |
| `profile` | object | Perfil de acesso resolvido para este Client (`ProfileDTO`: `id`, `name`, `description`, `master`, `dhCreate`) |
| `clientId` | number | ID do Client para o qual o token foi emitido |
| `client` | object | Dados completos do Client (`ClientDTO`) |
| `features` | string[] | Lista de features liberadas para esse usuário neste Client (usada pelo frontend para exibir/ocultar telas) |

**Erros possíveis:**

| Status | Quando ocorre |
|---|---|
| `401 Unauthorized` | Usuário/senha inválidos (`InvalidCredentialsException`) |
| `401 Unauthorized` | `clientCode` não corresponde a nenhum Client (`UnauthorizedClientException`: "Client não encontrado para o código informado") |
| `401 Unauthorized` | Usuário não-superUser tentando logar em um Client que não é o seu (`UnauthorizedClientException`: "Usuário não autorizado para o client SANTOS") |
| `401 Unauthorized` | Usuário `superUser`, mas o Client informado não tem nenhum Profile marcado como `master` configurado (`MasterProfileNotConfiguredException`) |

```json
{
  "timestamp": "2026-07-04T10:16:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Client não encontrado para o código informado",
  "path": "/auth/login"
}
```

### `POST /auth/logout`

Encerra a sessão associada ao token atual (o token deixa de ser válido — chamadas seguintes com ele resultarão em `401`).

**Autenticação:** requer `Authorization: Bearer <token>`.

**Corpo da requisição:** nenhum.

```bash
curl -X POST http://localhost:8080/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

**Resposta de sucesso:** `204 No Content` (sem corpo).

**Erros possíveis:** nenhum específico — se o token já for inválido/expirado, o filtro de autenticação retorna `401` antes mesmo de chegar ao controller (ver [Erros comuns](#erros-comuns)).

### Client

Endpoints de gestão do cadastro de Clients (tenants). Note que a listagem de Clients **acessíveis por um usuário** (`POST /auth/clients`) é diferente deste CRUD — este aqui é administrativo.

Campos de `ClientDTO`:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | number | gerado pelo servidor | Identificador único |
| `code` | string | sim (não validado por `@NotBlank`, mas é a chave usada no login) | Código curto e único do Client, usado como `clientCode` no login (ex.: `"SANTOS"`) |
| `name` | string | sim (idem) | Nome descritivo (ex.: `"Porto de Santos"`) |
| `dhCreate` | datetime | gerado pelo servidor | Data de criação |
| `dhDeleted` | datetime | gerado pelo servidor | Preenchido em soft-delete; `null` enquanto ativo |
| `enableAreaNotifications` | boolean | opcional | Se este Client recebe notificações de entrada/saída em Areas (ver [Notificações](#notificações)) |

> Nota: `ClientDTO` não tem anotações de bean-validation (`@NotBlank`/`@NotNull`) hoje — nada impede tecnicamente criar um Client sem `code`/`name`, embora isso não faça sentido operacional.

#### `GET /client` — Listar Clients ativos

```bash
curl -X GET http://localhost:8080/client \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): lista de `ClientDTO` (só os com `dhDeleted = null`).

#### `POST /client` — Criar Client

```bash
curl -X POST http://localhost:8080/client \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "RIO",
    "name": "Porto do Rio de Janeiro",
    "enableAreaNotifications": true
  }'
```

Resposta (`200 OK`): `ClientDTO` criado, com `id` e `dhCreate` preenchidos pelo servidor.

#### `PUT /client/{id}` — Atualizar Client

| Path param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | number | sim | ID do Client a atualizar |

```bash
curl -X PUT http://localhost:8080/client/3 \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "RIO",
    "name": "Porto do Rio de Janeiro - Zona Portuária",
    "enableAreaNotifications": false
  }'
```

**Erros possíveis:**

| Status | Quando ocorre |
|---|---|
| `404 Not Found` | Client com o `id` informado não existe |

### User

#### `GET /user/info` — Dados do usuário autenticado

Retorna as informações do usuário dono do token atual (não recebe `id` — é sempre "eu mesmo").

**Autenticação:** requer `Authorization: Bearer <token>`.

```bash
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): `UserDTO`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | ID do usuário |
| `name` | string | Nome completo |
| `username` | string | Login |
| `password` | — | **Nunca é retornado** (campo anotado com `@JsonIgnore`, mesmo que exista no domínio) |
| `profileId` / `profileName` | number / string | Perfil de acesso (podem ser `null`) |
| `clientId` / `clientName` | number / string | Client do usuário (podem ser `null` para `superUser`) |
| `superUser` | boolean | Se é super-usuário |

> Não há, hoje, endpoints de CRUD de usuários expostos via API — apenas esta consulta do usuário logado.

---

## Erros comuns

Todas as exceções de negócio não tratadas especificamente por um controller passam por um `@ControllerAdvice` global, que monta a resposta neste formato:

```json
{
  "timestamp": "2026-07-04T10:20:00",
  "status": 404,
  "error": "Not Found",
  "message": "Port 999 not found",
  "path": "/ports/999"
}
```

| Status | Quando acontece (exceção interna) |
|---|---|
| `400 Bad Request` | Corpo inválido (`@Valid` falhou — `MethodArgumentNotValidException`), argumento de negócio inválido (`IllegalArgumentException`) ou intervalo de datas inválido (`InvalidDateRangeException`) |
| `401 Unauthorized` | Credenciais inválidas (`InvalidCredentialsException`), Client/token inválido (`UnauthorizedClientException`), perfil master não configurado (`MasterProfileNotConfiguredException`) |
| `403 Forbidden` | Usuário autenticado mas sem permissão para a ação (`ForbiddenException`) |
| `404 Not Found` | Entidade referenciada não existe ou está soft-deletada (`EntityNotFoundException`) |
| `409 Conflict` | Registro duplicado (`DuplicateEntityException`) ou entidade em uso, bloqueando a operação (`EntityInUseException`) |

Exemplo de erro de validação de campo (`400`, quando o DTO usa `@Valid` — ex.: `POST /ports` sem `name`):

```json
{
  "timestamp": "2026-07-04T10:21:00",
  "status": 400,
  "error": "Bad Request",
  "message": "name: must not be blank",
  "path": "/ports"
}
```

Exemplo de conflito (`409`, ex.: `POST /ports` com nome+país já cadastrados):

```json
{
  "timestamp": "2026-07-04T10:22:00",
  "status": 409,
  "error": "Conflict",
  "message": "Port 'Porto de Santos' in 'Brasil' already exists",
  "path": "/ports"
}
```

Exemplo de token ausente/expirado/inválido (`401`, gerado pelo filtro de autenticação **antes** de chegar a qualquer controller — por isso o corpo não tem o campo `path`):

```json
{
  "timestamp": "2026-07-04T10:23:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Token expirado. Faça login novamente."
}
```

Outras mensagens possíveis nesse mesmo formato: `"Sessão não encontrada. Faça login novamente."` (token de uma sessão já encerrada por `/auth/logout`) e `"Token inválido."` (assinatura/formato inválido). Sessões também expiram por inatividade (configurável via `app.jwt.inactivity-minutes`), retornando a mesma mensagem de token expirado.

---

## Portos e Infraestrutura Portuária

Hierarquia de domínio: **Port** → **Terminal** → **Berth** (berço). Um Port também pode ter **Equipment** (estações receptoras AIS) e **Area**s (perímetros geográficos) associadas via **PortConfig** (fundeio, canal de acesso, perímetro do porto).

### Port

Campos de `PortDTO`:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | number | gerado pelo servidor | Identificador único |
| `name` | string | sim (`@NotBlank`) | Nome do porto (ex.: `"Porto de Santos"`) |
| `imagePort` | string | sim (`@NotBlank`) | URL da imagem do porto |
| `countryFlag` | string | sim (`@NotBlank`) | URL da imagem da bandeira do país |
| `country` | string | sim (`@NotBlank`) | País (compõe, junto com `name`, a chave única do porto) |
| `latitude` / `longitude` | number | opcional | Coordenadas do porto |
| `dhDeleted` | datetime | gerado pelo servidor | Preenchido em soft-delete |

#### `POST /ports` — Cadastrar porto

```bash
curl -X POST http://localhost:8080/ports \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Porto de Santos",
    "imagePort": "https://cdn.example.com/santos.jpg",
    "countryFlag": "https://cdn.example.com/br-flag.png",
    "country": "Brasil",
    "latitude": -23.9535,
    "longitude": -46.3333
  }'
```

Resposta (`200 OK`): `PortDTO` criado.

**Erros possíveis:** `409 Conflict` se já existe um porto com o mesmo `name` + `country`.

#### `PUT /ports/{id}` — Atualizar porto

| Path param | Descrição |
|---|---|
| `id` | ID do porto |

Mesmo corpo do `POST`. **Erros:** `404` se o porto não existe/foi deletado; `409` se a nova combinação `name`+`country` colide com outro porto.

#### `DELETE /ports/{id}` — Excluir porto (soft-delete)

```bash
curl -X DELETE http://localhost:8080/ports/1 \
  -H "Authorization: Bearer <accessToken>"
```

**Erros possíveis:**

| Status | Quando ocorre |
|---|---|
| `404 Not Found` | Porto não existe/já deletado |
| `409 Conflict` | Porto tem `Equipment` associado — `"Port 1 cannot be deleted because it has associated Equipment"` |

#### `GET /ports/{id}` — Consultar porto por ID

Resposta (`200 OK`): `PortDTO`. **Erros:** `404` se não existir.

#### `GET /ports` — Listar portos

**Query params:**

| Param | Obrigatório | Descrição |
|---|---|---|
| `name` | não | Filtro por nome (contém, case-insensitive) |

```bash
curl -X GET "http://localhost:8080/ports?name=santos" \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): lista de `PortDTO`.

#### `GET /ports/summary` — Listagem resumida de portos

Visão agregada e leve de todos os portos, pensada para telas de listagem/dashboard (ver PRD em `docs/planning/ports-summary/`).

```bash
curl -X GET http://localhost:8080/ports/summary \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): lista de `PortSummaryDTO`

| Campo | Tipo | Descrição |
|---|---|---|
| `id`, `name`, `imagePort`, `country`, `countryFlag` | — | Iguais a `PortDTO` |
| `shipsInPort` | number | Quantidade de navios (`ObjectClassificationUtil.isShip`) atualmente na `portArea` do porto — `0` se não configurada |
| `lastEquipmentUpdate` | datetime ou `null` | Maior `dhReading` entre as mensagens recebidas pelos `Equipment` do porto — `null` se o porto não tem Equipment |

```json
[
  {
    "id": 1,
    "name": "Porto de Santos",
    "imagePort": "https://cdn.example.com/santos.jpg",
    "country": "Brasil",
    "countryFlag": "https://cdn.example.com/br-flag.png",
    "shipsInPort": 7,
    "lastEquipmentUpdate": "2026-07-04T09:58:12"
  }
]
```

#### `GET /ports/{id}/details` — Detalhes operacionais de um porto

Visão completa de um único porto: dados cadastrais + ocupação de berços + indicadores de tráfego de navios (ver PRD em `docs/planning/port-details/`).

```bash
curl -X GET http://localhost:8080/ports/1/details \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): `PortDetailsDTO`

```json
{
  "portInfo": {
    "id": 1,
    "name": "Porto de Santos",
    "imagePort": "https://cdn.example.com/santos.jpg",
    "country": "Brasil",
    "countryFlag": "https://cdn.example.com/br-flag.png",
    "totalBerths": 4,
    "occupiedBerths": 2,
    "occupancyRate": 50.0
  },
  "operationalIndicators": {
    "shipsInPort": 6,
    "shipsInPortByType": { "Navio de Carga": 4, "Petroleiro": 2 },
    "shipsLast24h": 9,
    "shipsLast24hByType": { "Navio de Carga": 5, "Petroleiro": 3, "Rebocador": 1 },
    "shipsInAnchorage": 2,
    "shipsInAccessChannel": 1,
    "shipsDocked": 2
  }
}
```

| Campo (`portInfo`) | Descrição |
|---|---|
| `totalBerths` | Todos os berços do porto (mesmo os sem área geográfica configurada) |
| `occupiedBerths` | Berços com navio (`isShip`) presente há mais de 20 minutos — ver `shipsDocked` |
| `occupancyRate` | `occupiedBerths / totalBerths * 100`, uma casa decimal, `0` se `totalBerths = 0` |

| Campo (`operationalIndicators`) | Descrição |
|---|---|
| `shipsInPort` / `shipsInPortByType` | Navios agora na `portArea`, no total e por `ObjectType.description` (só tipos com contagem > 0) |
| `shipsLast24h` / `shipsLast24hByType` | Navios que estiveram na `portArea` a qualquer momento nas últimas 24h (inclui os que já saíram) |
| `shipsInAnchorage` | Navios agora na união de todas as `anchorageAreas` do porto |
| `shipsInAccessChannel` | Navios agora na `accessChannelArea` do porto |
| `shipsDocked` | Navios atracados (presentes há mais de 20 minutos em algum berço) — sempre consistente com `occupiedBerths` |

**Erros possíveis:** `404 Not Found` se o porto não existe.

### PortConfig

Configura, para um Porto, quais `Area`s representam o fundeio (pode ser mais de uma), o canal de acesso e o perímetro do porto.

#### `PUT /ports/{id}/config` — Upsert da configuração

| Path param | Descrição |
|---|---|
| `id` | ID do porto a configurar |

Corpo (`PortConfigDTO`):

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `anchorageAreaIds` | number[] | opcional (lista vazia/ausente limpa o fundeio) | IDs das Areas de fundeio — substitui **o conjunto inteiro** a cada chamada |
| `accessChannelAreaId` | number | opcional | ID da Area de canal de acesso |
| `portAreaId` | number | opcional | ID da Area do perímetro do porto |

```bash
curl -X PUT http://localhost:8080/ports/1/config \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "anchorageAreaIds": [2, 3],
    "accessChannelAreaId": 4,
    "portAreaId": 5
  }'
```

Resposta (`200 OK`): mesmo formato do corpo, com os valores persistidos.

**Erros possíveis:**

| Status | Quando ocorre |
|---|---|
| `404 Not Found` | Porto não existe, ou alguma Area referenciada não existe/está inativa |
| `400 Bad Request` | `anchorageAreaIds` com IDs duplicados; alguma área de fundeio coincide com `accessChannelAreaId`; `portAreaId` coincide com fundeio ou canal de acesso |

#### `GET /ports/{id}/config` — Consultar configuração

```bash
curl -X GET http://localhost:8080/ports/1/config \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): `PortConfigDetailDTO` — `port` (`PortDTO` completo), `anchorageAreas` (lista de `AreaDTO`, **sempre** presente, vazia se nenhuma configurada), `accessChannelArea` e `portArea` (`AreaDTO` ou `null`). Nunca retorna `404` para um porto existente sem configuração — os campos de área simplesmente vêm vazios/nulos.

### Terminal

Campos de `TerminalDTO`:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | sim (`@NotBlank`) | Nome do terminal |
| `code` | string | sim (`@NotBlank`) | Código único |
| `terminalType` | string | sim (`@NotBlank`) | Tipo (texto livre, ex.: `"CONTAINER"`, `"LIQUID_CARGO"`) |
| `portId` | number | sim (`@NotNull`) | Porto ao qual pertence |
| `imageTerminal`, `latitude`, `longitude` | — | opcional | |

#### `POST /terminals`

```bash
curl -X POST http://localhost:8080/terminals \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Terminal de Contêineres T2",
    "code": "TC2",
    "terminalType": "CONTAINER",
    "portId": 1
  }'
```

**Erros:** `404` se `portId` não existe.

#### `PUT /terminals/{id}` / `DELETE /terminals/{id}` / `GET /terminals/{id}`

Mesmo padrão de `Port` (upsert, soft-delete, consulta). `GET /terminals/{id}` retorna `TerminalDetailDTO` (igual ao `TerminalDTO`, mas com `port` como objeto `PortDTO` completo em vez de `portId`). **Erros:** `404` (`"Terminal <id> not found"`, ou `"Port <portId> not found"` se o novo `portId` do `PUT` não existir).

#### `GET /terminals` — Listar

**Query params (combináveis):**

| Param | Obrigatório | Descrição |
|---|---|---|
| `portId` | não | Filtra por porto |
| `name` | não | Filtro por nome (contém, case-insensitive) |

```bash
curl -X GET "http://localhost:8080/terminals?portId=1&name=conte" \
  -H "Authorization: Bearer <accessToken>"
```

### Berth (berço)

Campos de `BerthDTO`:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | sim (`@NotBlank`) | Nome do berço |
| `terminalId` | number | sim (`@NotNull`) | Terminal ao qual pertence |
| `areaId` | number | opcional | Area (polígono) associada, usada para detectar ocupação — berço sem `areaId` nunca aparece como ocupado |
| `length`, `draft` | number | opcional | Comprimento e calado máximo, em metros |
| `latitude`, `longitude`, `imageBerth` | — | opcional | |

#### `POST /berths`

```bash
curl -X POST http://localhost:8080/berths \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Berço 01 Leste",
    "terminalId": 1,
    "areaId": 6,
    "length": 350.5,
    "draft": 12.8
  }'
```

**Erros:** `404` se `terminalId` ou `areaId` não existirem.

#### `PUT /berths/{id}` / `DELETE /berths/{id}` / `GET /berths/{id}`

Mesmo padrão. `GET /berths/{id}` retorna `BerthDetailDTO` (com `terminal` como `TerminalDetailDTO` completo e `area` como `AreaDTO` ou `null`). **Erros:** `404` (`"Berth <id> not found"`).

#### `GET /berths` — Listar

**Query params (combináveis):** `terminalId` (opcional), `name` (opcional, contém).

### Equipment

Campos de `EquipmentDTO`:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | não há `@NotBlank`/`@NotNull` no DTO hoje, mas é o identificador operacional do equipamento | Nome do equipamento |
| `code` | string | idem | Código único, usado para vincular mensagens recebidas (`codeEquipment`) |
| `type` | string | opcional | Tipo (texto livre) |
| `lat`, `lon` | number | opcional | Coordenadas fixas da estação |
| `portId` | number | opcional | Porto ao qual o equipamento pertence |

> Diferente de `Port`/`Terminal`/`Berth`, `EquipmentController` não usa `@Valid` — nenhum campo é rejeitado por ausência no nível de bean-validation.

#### `GET /equipment` — Listar todos

```bash
curl -X GET http://localhost:8080/equipment \
  -H "Authorization: Bearer <accessToken>"
```

Resposta: lista de `EquipmentDTO` (inclui `port` como objeto `PortDTO` completo quando `portId` não é nulo).

#### `POST /equipment` / `PUT /equipment/{id}`

```bash
curl -X POST http://localhost:8080/equipment \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Receptor AIS Porto de Santos 1",
    "code": "AIS_SANTOS_01",
    "type": "AIS_RECEIVER",
    "lat": -23.9535,
    "lon": -46.3333,
    "portId": 1
  }'
```

**Erros:** `404` se `portId` informado não existir (em `PUT`, também se o próprio `id` não existir).

#### `GET /equipment/{id}/message/last` — Última mensagem recebida pelo equipamento

```bash
curl -X GET http://localhost:8080/equipment/5/message/last \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): `MessageDTO` (ver campos na seção [Message](#message)).

### Area

Perímetro geográfico (polígono) usado para detectar entrada/saída de navios. Toda `Area` nasce **inativa** e só passa a gerar eventos depois de rodar um job retroativo e ser ativada.

Campos de `AreaDTO`:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | não há validação de bean, mas é essencial | Nome da área |
| `coordinates` | array de `{lat, lon}` | sim, na prática (mínimo 3 pontos para formar um polígono válido) | Vértices do polígono |
| `portId` | number | opcional | Porto ao qual a área está vinculada (usado, entre outras coisas, para otimizar o filtro do job retroativo) |
| `active` | boolean | somente leitura | Controlado pelos endpoints `activate`/job retroativo, não pelo `POST`/`PUT` |

Exemplo de `coordinates`:

```json
[
  { "lat": -23.9520, "lon": -46.3300 },
  { "lat": -23.9490, "lon": -46.3280 },
  { "lat": -23.9505, "lon": -46.3250 },
  { "lat": -23.9540, "lon": -46.3270 }
]
```

#### `GET /area` — Listar todas

```bash
curl -X GET http://localhost:8080/area \
  -H "Authorization: Bearer <accessToken>"
```

#### `POST /area` — Criar

```bash
curl -X POST http://localhost:8080/area \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fundeio Norte - Santos",
    "coordinates": [
      { "lat": -23.9520, "lon": -46.3300 },
      { "lat": -23.9490, "lon": -46.3280 },
      { "lat": -23.9505, "lon": -46.3250 }
    ],
    "portId": 1
  }'
```

Resposta (`200 OK`): `AreaDTO` criado, sempre com `active: false`. **Erros:** `404` se `portId` informado não existir.

#### `PUT /area/{id}` — Atualizar

Mesmo corpo do `POST`. Não altera `active`. **Erros:** `404` se a área não existir.

#### `POST /area/{id}/activate` — Ativar

Marca a área como `active: true`. Exige que já exista um job retroativo (`POST /area/{id}/retroactive-events`) finalizado (`DONE` ou `CANCELLED`) para essa área — a ativação garante que o histórico de navios já foi processado antes de a área começar a gerar eventos em tempo real.

```bash
curl -X POST http://localhost:8080/area/6/activate \
  -H "Authorization: Bearer <accessToken>"
```

**Erros possíveis:**

| Status | Quando ocorre |
|---|---|
| `404 Not Found` | Área não existe |
| `400 Bad Request` | Nenhum job retroativo foi executado ainda; ou o último job não está `DONE`/`CANCELLED` (ex.: ainda `RUNNING`) |

#### `POST /area/{id}/retroactive-events` — Disparar geração retroativa de eventos

Processa (de forma assíncrona) o histórico de posições AIS para popular os eventos de entrada/saída da área antes dela ser ativada.

Corpo (`AreaRetroactiveRequest`):

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `periodDays` | number | sim quando `catchUp` é `false`/ausente | Quantos dias no passado reprocessar (modo `FULL`) |
| `catchUp` | boolean | opcional | `true` = modo incremental (`CATCHUP`) a partir do fim do último job `DONE`; ignora `periodDays` |

```bash
curl -X POST http://localhost:8080/area/6/retroactive-events \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "periodDays": 30 }'
```

Resposta: `202 Accepted` (processamento assíncrono, sem corpo).

**Erros possíveis:**

| Status | Quando ocorre |
|---|---|
| `404 Not Found` | Área não existe |
| `409 Conflict` | Já existe um job em andamento para essa área |
| `400 Bad Request` | Área já está ativa e não pode ser reprocessada; `periodDays` ausente/inválido no modo `FULL`; modo `CATCHUP` sem nenhum job `FULL` anterior `DONE` |

#### `GET /area/{id}/retroactive-jobs/last` — Consultar último job retroativo

```bash
curl -X GET http://localhost:8080/area/6/retroactive-jobs/last \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): `AreaRetroactiveJobDTO`

| Campo | Descrição |
|---|---|
| `mode` | `FULL` ou `CATCHUP` |
| `status` | `PENDING`, `RUNNING`, `DONE`, `CANCELLING`, `CANCELLED` ou `ERROR` |
| `dhPeriodStart` / `dhPeriodEnd` | Período coberto pelo job |
| `mmsisTotal` / `mmsisProcessed` | Progresso em MMSIs distintos |
| `progressPercent` | 0–100 |
| `objectAreasCreated` | Quantos eventos de entrada/saída foram criados |
| `errorMessage` | Preenchido só quando `status = ERROR` |

**Erros:** `404` se a área não existir, ou se nunca houve job disparado para ela.

#### `POST /area/{id}/retroactive-jobs/last/cancel` — Cancelar job em andamento

**Erros:** `404` (área ou job inexistente); `400` se o último job não estiver `RUNNING`.

---

## Rastreamento AIS e Objetos

### Message

Mensagens NMEA brutas recebidas de um `Equipment` (estação receptora física), antes de decodificação.

#### `POST /message/new` — Receber lote de mensagens de um Equipment

Endpoint chamado pela estação receptora física (não pelo frontend). Ainda assim, **exige o mesmo token JWT** que os demais endpoints (não há um mecanismo de autenticação separado para hardware hoje).

**Headers:**

| Header | Obrigatório | Descrição |
|---|---|---|
| `codeEquipment` | sim | `code` do `Equipment` que está enviando as mensagens |

Corpo (`NewMessageDTO`):

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `message` | string | sim | Um ou mais sentenças NMEA (`!AIVDM`/`!AIVDO`) separadas por `\n` |
| `dhReading` | datetime | sim | Timestamp (UTC) de quando o Equipment capturou as mensagens |

```bash
curl -X POST http://localhost:8080/message/new \
  -H "Authorization: Bearer <accessToken>" \
  -H "codeEquipment: AIS_SANTOS_01" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "!AIVDM,1,1,,B,15NPOOPP00o?ExjHKl@a<gv008Rr,0*3E",
    "dhReading": "2026-07-04T09:58:12"
  }'
```

Resposta (`200 OK`): `MessageDTO`

| Campo | Descrição |
|---|---|
| `id` | ID da mensagem persistida |
| `equipment` | `EquipmentDTO` do remetente |
| `messages` | Lista das sentenças NMEA aceitas |
| `processed` | `false` — o processamento (decodificação + geração de posição) é assíncrono |
| `dhReading` | Igual ao enviado |
| `dhCreate` / `dhUpdate` | Controlados pelo servidor |

**Erros possíveis:** `404 Not Found` se `codeEquipment` não corresponder a nenhum `Equipment` cadastrado.

### AISMessageDecoderController

Endpoints auxiliares (debug/integração) para decodificar mensagens NMEA sem passar pelo fluxo assíncrono de `/message/new`.

#### `POST /ais/decoder/message` — Decodificar mensagens NMEA cruas

Corpo: array de strings NMEA.

```bash
curl -X POST http://localhost:8080/ais/decoder/message \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '["!AIVDM,1,1,,B,15NPOOPP00o?ExjHKl@a<gv008Rr,0*3E"]'
```

Resposta (`200 OK`): lista de objetos `AISMessage` (da biblioteca `dk.tbsalling.aismessages`), com os campos decodificados do tipo de mensagem AIS correspondente (MMSI, posição, status de navegação, etc — varia por tipo de mensagem).

#### `POST /ais/decoder/message/convert-position` — Decodificar e converter em entidades de domínio

Mesmo corpo, mas usa somente a **primeira** mensagem da lista e converte para as três estruturas internas que o pipeline de processamento usa.

Resposta (`200 OK`):

```json
{
  "objectInfoAis": { "mmsi": 210410000, "name": null, "objectType": "CARGO", "dimBow": 120, "dimStern": 20, "dimPort": 10, "dimStarboard": 10 },
  "voyagerAis": { "mmsi": 210410000, "eta": null, "draught": null, "dest": null },
  "positionAis": { "mmsi": 210410000, "lat": -23.95, "lon": -46.33, "sog": 12.3, "cog": 45.0, "navigationStatus": "UNDER_WAY_USING_ENGINE", "dhEvent": "2026-07-04T09:58:12" }
}
```

### ObjectType

Catálogo (read-only na prática, mas com CRUD exposto) dos tipos de embarcação/objeto AIS.

#### `GET /object-type` — Listar

Resposta: lista de `ObjectTypeDTO` — `id`, `type` (código do enum AIS, ex.: `"CARGO"`, `"TANKER"`, `"FISHING"`), `description` (texto legível, ex.: `"Navio de Carga"`).

#### `POST /object-type` / `PUT /object-type/{id}`

```bash
curl -X POST http://localhost:8080/object-type \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "type": "CARGO", "description": "Navio de Carga" }'
```

Resposta: `200 OK` com o `ObjectTypeDTO`. **Erros:** `404` no `PUT` se o `id` não existir (não há validação de duplicidade de `type` hoje).

### NavigationStatus

Catálogo dos status de navegação AIS (`AT_ANCHOR`, `UNDER_WAY_USING_ENGINE`, etc — ver glossário do domínio).

#### `GET /navigation-status` / `POST /navigation-status` / `PUT /navigation-status/{id}`

Mesmo formato de `ObjectType`: `NavigationStatusDTO` com `id`, `status`, `description`. **Erros:** `404` no `PUT` se o `id` não existir.

### ObjectData

Consultas de dados de rastreamento (posição, dados estáticos, dados de viagem) de embarcações (`Object`), identificadas por **MMSI**.

#### `GET /object-data/{mmsi}` — Dados estáticos

```bash
curl -X GET http://localhost:8080/object-data/210410000 \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): `ObjectInfoDTO` — `mmsi`, `imo`, `name`, `callSign`, `type` (`ObjectTypeDTO`), `dimBow`/`dimStern`/`dimPort`/`dimStarboard` (metros), `dhCreate`/`dhUpdate`.

#### `GET /object-data/{mmsi}/last-update` — Última posição/status conhecidos

```bash
curl -X GET http://localhost:8080/object-data/210410000/last-update \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): `ObjectDataReportedLatestDTO` — `mmsi`, `lat`/`lon`, `sog` (velocidade, nós), `cog` (rumo, graus), `rot`, `trueHeading`, `navigationStatus` (`NavigationStatusDTO`), `eta`/`draught`/`dest` (dados de viagem, podem ser `null`), `updateType` (`POSITION`/`VOYAGER`/`VOYAGER_AND_POSITION`/`OTHER`), `dhEvent` (timestamp da captura).

**Erros:** `404` se o MMSI nunca reportou dados.

#### `GET /object-data/{mmsi}/track` — Histórico de posições em um período

**Query params:**

| Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `start` | datetime (`yyyy-MM-dd HH:mm:ss`) | sim | Início do período |
| `end` | datetime (`yyyy-MM-dd HH:mm:ss`) | sim | Fim do período |

```bash
curl -X GET "http://localhost:8080/object-data/210410000/track?start=2026-07-01 00:00:00&end=2026-07-02 00:00:00" \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): lista de `ShipPosition` (`mmsi`, `imo`, `name`, `lat`, `lon`, `rot`, `sog`, `cog`, `dhEvent`).

**Erros possíveis:**

| Status | Quando ocorre |
|---|---|
| `400 Bad Request` | Período (`end - start`) maior que 5 dias — `"O período não pode ultrapassar 5 dias"` |

#### `GET /object-data/{mmsi}/track/csv` — Mesmo histórico, em CSV

Mesmos parâmetros de `/track`. Resposta: `200 OK`, `Content-Type: application/octet-stream`, `Content-Disposition: attachment; filename=ship_positions.csv`, colunas `mmsi,imo,nm_object,lat,lon,rot,sog,cog,dh_event`.

#### `GET /object-data/within-radius` — Embarcações dentro de um raio

**Query params:**

| Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `centerLat` / `centerLon` | number | sim | Centro do raio |
| `radius` | number | sim | Distância |
| `unit` | `NAUTICAL_MILES` \| `MILES` \| `KILOMETERS` | sim | Unidade da distância |

```bash
curl -X GET "http://localhost:8080/object-data/within-radius?centerLat=-23.95&centerLon=-46.33&radius=5&unit=NAUTICAL_MILES" \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): lista de `ObjectPositionDTO` (mesmos campos de "última posição", com `object` trazendo os dados estáticos aninhados).

#### `GET /object-data/within-area` — Embarcações dentro de uma Area

**Query params:** `areaId` (obrigatório).

Resposta: mesmo formato de `within-radius`. **Erros:** `404` se `areaId` não existir.

---

## Notificações

### NotifyAreaClient

Assinatura de um `Client` para ser notificado de eventos (entrada/saída de Objects) em uma `Area`, com filtros opcionais.

Campos de `NotifyAreaClientDTO`:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `client.id` | number | sim | Client que será notificado |
| `area.id` | number | sim | Area monitorada |
| `lengthVesselAboveMeters` | number | opcional | Só notifica navios com comprimento ≥ este valor |
| `typesOfVessel` | number[] | opcional | Só notifica `ObjectType` cujos IDs estejam nesta lista |
| `mmsiNotAllowed` | number[] | opcional | MMSIs que nunca devem gerar notificação para este Client |

#### `POST /notify-area-client` — Criar assinatura

```bash
curl -X POST http://localhost:8080/notify-area-client \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "client": { "id": 1 },
    "area": { "id": 6 },
    "lengthVesselAboveMeters": 60,
    "typesOfVessel": [1, 3],
    "mmsiNotAllowed": [123456789]
  }'
```

Resposta (`200 OK`): `NotifyAreaClientDTO` completo (com `client`/`area` populados) e `dhCreate` preenchido pelo servidor.

**Erros possíveis:** `404 Not Found` se `client.id` ou `area.id` não existirem.

#### `GET /notify-area-client/client/{id}` — Áreas monitoradas por um Client

```bash
curl -X GET http://localhost:8080/notify-area-client/client/1 \
  -H "Authorization: Bearer <accessToken>"
```

Resposta (`200 OK`): lista de `NotifyAreaClientDTO` (vazia se o Client não tiver nenhuma assinatura).

---

## Integrações Externas

### Innovia

Endpoints administrativos que disparam a sincronização de catálogos do AisManager para o sistema externo **Innovia**, via chamada HTTP (Feign client). Não recebem corpo nem retornam dados — são "gatilhos" de sincronização, tipicamente usados manualmente ou por um job agendado.

| Endpoint | Descrição |
|---|---|
| `POST /innovia/sync/navigation-status` | Envia todo o catálogo de `NavigationStatus` para a Innovia |
| `POST /innovia/sync/object-type` | Envia todo o catálogo de `ObjectType` para a Innovia |
| `POST /innovia/sync/area` | Envia as `Area`s monitoradas pelo Client de código `CLTI01` (fixo no código) para a Innovia — não faz nada se esse Client não existir ou estiver deletado |

```bash
curl -X POST http://localhost:8080/innovia/sync/object-type \
  -H "Authorization: Bearer <accessToken>"
```

Resposta: `200 OK`, sem corpo. **Erros possíveis:** falha de rede/timeout na chamada para a Innovia propaga como `500 Internal Server Error` (não há tratamento específico mapeado no `GlobalExceptionHandler` para esse cenário).
