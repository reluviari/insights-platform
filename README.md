# Insights Platform

Monorepo **Nx** com **`insights.web`** (Next.js), **`insights.api`** (Serverless / Lambda + MongoDB), multi-tenant e integração **Microsoft Power BI** (Azure AD + embed).

**Repositório:** [github.com/reluviari/insights-platform](https://github.com/reluviari/insights-platform)

## Demo / ambientes

Não há URLs públicas de demo fixas: **front e API em produção dependem do deploy da sua organização** (AWS, tenant, credenciais Microsoft). Para desenvolvimento local, use [Como rodar](#como-rodar).

## Diagrama de arquitetura

### Como a API, as Lambdas e o Power BI se conectam

Em **produção (AWS)** não existe um servidor Node separado que “chama uma Lambda”: o que o navegador chama é o **API Gateway**, e cada rota dispara o **handler TypeScript** já empacotado como **função Lambda**. Ou seja, **a Lambda é a API** nesse modelo.

Para **incorporar relatórios**, o fluxo típico é:

1. O **front-end** pede um token de embed à sua API (Lambda de `embed-token` ou rota equivalente).
2. Essa Lambda obtém um **access token** no **Azure AD** (credenciais de aplicação/usuário em variáveis de ambiente).
3. Com esse token, a Lambda chama a **API REST do Power BI** (`api.powerbi.com`, por exemplo `GenerateToken`).
4. O **Next.js** usa o token devolvido com **powerbi-client(-react)** no navegador; o iframe final fala com **app.powerbi.com**.

Em **desenvolvimento local**, o **Serverless Offline** simula API Gateway + invocação de Lambda (porta **4001** no `docker compose` deste repositório).

### Visão geral — produção (AWS + serviços externos)

```mermaid
graph LR
    Browser["Navegador"]

    subgraph FrontApp["Front-end Next.js"]
        NextUi["Páginas + estado\npowerbi-client-react"]
    end

    subgraph AwsCloud["AWS"]
        APIGW["API Gateway"]
        subgraph LambdaFns["Funções Lambda insights.api"]
            Handlers["Handlers por rota\nauth / reports /\nembed-token / customers / ..."]
        end
    end

    MongoDb[("MongoDB")]
    KeycloakSvc["Keycloak\n(futuro / SSO)"]
    AzureAd["Azure AD"]
    PowerBiApi["Power BI REST\napi.powerbi.com"]
    PowerBiHost["Power BI embed\napp.powerbi.com"]

    Browser --> NextUi
    NextUi -->|"HTTPS JSON\nNEXT_PUBLIC_INSIGHTS_API"| APIGW
    APIGW --> Handlers
    Handlers -->|"Mongoose"| MongoDb
    Handlers -->|"OpenID Connect"| KeycloakSvc
    Handlers -->|"OAuth2 token"| AzureAd
    Handlers -->|"GenerateToken etc."| PowerBiApi
    NextUi -->|"SDK com embed token"| PowerBiHost
```

### Stack local com Docker Compose (monorepo)

```mermaid
graph LR
    Browser["Navegador"]

    subgraph Compose["Docker Compose insights-platform\n(Mongo → seed → API + Web)"]
        Web["insights.web\nNext dev :3000"]
        Api["insights.api\nserverless-offline :4001"]
        MongoLocal[("MongoDB :27017")]
    end

    MicrosoftCloud["Azure AD + Power BI\ninternet"]

    Browser --> Web
    Web -->|"HTTP"| Api
    Api --> MongoLocal
    Api -->|"HTTPS"| MicrosoftCloud
    Web -->|"Embed iframe"| MicrosoftCloud
```

_Keycloak **não está em uso neste momento** — existe apenas preparação no repositório (perfil Compose, `docker/`) para uma eventual fase futura de SSO; ver [docker/KEYCLOAK.md](docker/KEYCLOAK.md)._

### Sequência — obter token de embed e exibir relatório

```mermaid
sequenceDiagram
    participant Browser
    participant Next as NextJs
    participant APIGW as ApiGateway
    participant Lambda as Lambda_embed
    participant Azure as AzureAD
    participant PBI as PowerBI_REST

    Browser->>Next: Acessa página do relatório
    Next->>APIGW: Solicita embed token
    APIGW->>Lambda: Invoca handler
    Lambda->>Azure: Token OAuth
    Azure-->>Lambda: access_token
    Lambda->>PBI: GenerateToken no workspace
    PBI-->>Lambda: token embed
    Lambda-->>Next: Resposta com token e ids
    Next->>Browser: Renderiza com powerbi-client
    Browser->>PBI: Carrega visual no iframe
```

> Versão com **módulos internos**: [insights.api/README.md](insights.api/README.md#arquitetura) · [insights.web/README.md](insights.web/README.md#arquitetura). **SSO / Keycloak (só futuro):** [docker/KEYCLOAK.md](docker/KEYCLOAK.md).

## Pré-requisitos

- **Docker** e Docker Compose (stack recomendada na raiz)
- **Sem Docker:** Node **16+** na API, **20+** no front; **Yarn 1.x** no web (`yarn.lock`); **MongoDB** acessível
- **Azure AD + Power BI** apenas se for testar embed e tokens reais (credenciais via `.env`)

## Como rodar

### Stack completa (recomendado)

Na raiz (`insights-platform`):

```bash
cp .env.docker.example .env
docker compose up --build
```

Depois do **build**, o Compose sobe o **MongoDB**, corre o job **`mongo-seed`** uma vez (script idempotente [`docker/mongo/seed-insights-keycloak-dev.js`](docker/mongo/seed-insights-keycloak-dev.js) — nome histórico; **não exige Keycloak**, só grava documentos base em Mongo), só então inicia a **API** (`:4001`) e o **Next.js** (`:3000`). Para repetir só o seed: `docker compose run --rm mongo-seed`.

**Fluxo atual:** login **e-mail + senha** na API (JWT, dados em Mongo). **`KEYCLOAK_URL`** deixa-se **vazio** — não estamos a usar IdP local.

| Serviço | URL |
|---------|-----|
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API (offline) | [http://localhost:4001](http://localhost:4001) |
| Health check | `GET http://localhost:4001/api/health-check` |
| MongoDB (host) | `localhost:27017` |

```bash
curl -s http://localhost:4001/api/health-check
```

Modelo de variáveis: [.env.docker.example](.env.docker.example).

### SSO / Keycloak — **não usado agora** (só futuro)

O projeto **não corre Keycloak** no dia a dia. Mantemos perfil Compose `docker/keycloak/import/` e [docker/KEYCLOAK.md](docker/KEYCLOAK.md) como **referência para quando** existir decisão de SSO corporativo — **ignora** no fluxo normal (`docker compose up --build` sem `--profile keycloak`). Na **`/login`**, o botão SSO permanece desligado (`NEXT_PUBLIC_INSIGHTS_SSO_ENABLED=false`).

### Apps isolados

```bash
cd insights.api && docker compose up -d && npm install && npm run dev

cd insights.web && cp .env.example .env && yarn install && yarn dev
```

O front precisa da API em algum host — ver READMEs: [insights.api/README.md](insights.api/README.md) · [insights.web/README.md](insights.web/README.md)

### Modo desenvolvimento (hot reload sem rebuild da imagem)

1. Subir só o Mongo (`insights.api/docker-compose.yml` ou `docker compose up -d mongo` na raiz).
2. Aplicar dados de desenvolvimento no Mongo: `docker compose run --rm mongo-seed` (na raiz, com o Mongo acessível na rede Compose).
3. `cd insights.api && npm run dev` (`:4001`)
4. `cd insights.web && yarn dev` (`:3000`)

Alternativa API: `npm run dev:local` (Fastify `:45000`) — [insights.api/README.md](insights.api/README.md).

### Credenciais e dados de teste

| Item | Observação |
|------|------------|
| **Mongo (seed dev)** | **mongo-seed** cria/atualiza tenant (`urlSlug` https://localhost:3000), customer e utilizador **`dev@example.com`** — **sem precisar de Keycloak**. O script tem nome histórico (`seed-insights-keycloak-dev.js`). Login **clássico** na UI depende da API e de palavra-passe persistida em Mongo conforme as rotas de auth (o seed pode não criar hash). |
| **Keycloak / SSO** | **Fora de uso neste momento.** Material no repo só para **futuro** — [docker/KEYCLOAK.md](docker/KEYCLOAK.md). |
| **Azure / Power BI** | Client ID, secret, tenant, utilizador — [.env.docker.example](.env.docker.example) e `insights.api/config/local.yml`. |
| **NextAuth** | `NEXTAUTH_SECRET` em dev — exemplo na raiz `.env.docker.example`. |

## Scripts úteis

| Comando | Onde | Descrição |
|---------|------|-----------|
| `npm run dev` | `insights.api` | Serverless Offline |
| `npm run dev:local` | `insights.api` | Fastify local (`:45000`) |
| `npm run build` / `npm test` / `npm run lint` | `insights.api` | Build, testes, lint |
| `yarn dev` / `yarn build` / `yarn lint` | `insights.web` | Dev, build, lint |
| `npx nx graph` | raiz | Grafo Nx |
| `npx nx run insights-api:dev` | raiz | Delega `npm run dev` na API |
| `npx nx run insights-web:dev` | raiz | Delega `yarn dev` no web |
| `npx nx run-many -t lint --all` | raiz | Lint em projetos com target |
| `npx nx affected -t lint,test,build` | raiz | Só afetados pelo diff (`main` em [nx.json](nx.json)) |

Targets: [insights.api/project.json](insights.api/project.json) · [insights.web/project.json](insights.web/project.json)

## Endpoints da API (exemplos)

Prefixo **`/api`** com Serverless Offline. Lista completa: `serverless.yml` e `insights.api/src/modules/**/functions/*.yml`.

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/health-check` | Não | Saúde |
| POST | `/api/auth/sign-in` | Não | Login |
| — | `/api/reports/...` | Sim | Relatórios / Power BI |
| — | `/api/embed-token/...` | Sim | Token de embed |

## Escopo funcional

Detalhe de produto: **[docs/PRODUCT_SCOPE.md](docs/PRODUCT_SCOPE.md)**

- Autenticação: JWT com dados em **Mongo**. **SSO (Keycloak)** não está em uso — apenas previsto para o futuro (ver [docker/KEYCLOAK.md](docker/KEYCLOAK.md)).
- Power BI: embed, sincronização, filtros  

## Stack

### Frontend (`insights.web`)

| Tecnologia | Uso |
|------------|-----|
| Next.js 13 | Páginas / roteamento |
| React 18 | UI |
| Redux Toolkit + RTK Query | Estado e API |
| Tailwind + SASS | Estilo |
| powerbi-client-react | Embed |
| TypeScript | Tipagem |

### Backend (`insights.api`)

| Tecnologia | Uso |
|------------|-----|
| Serverless Framework 3 | Lambda + API Gateway |
| Node.js 16.x | Runtime declarado no `serverless.yml` |
| MongoDB + Mongoose | Persistência |
| Middy | Middlewares Lambda |
| Axios | Azure / Power BI |
| Jest | Testes |

### Monorepo

| Item | Uso |
|------|-----|
| `package.json` / npm workspaces | `insights.api`, `insights.web` |
| [nx.json](nx.json) + `project.json` | Nx, cache, `nx affected` |
| [docker-compose.yml](docker-compose.yml) | Mongo + API + Web |
| [.env.docker.example](.env.docker.example) | Modelo de env para Compose |
| [docker/KEYCLOAK.md](docker/KEYCLOAK.md) | SSO futuro (Keycloak) — **não faz parte do fluxo atual** |

## Estrutura de pastas

```
insights-platform/
├── docker-compose.yml
├── .env.docker.example
├── nx.json
├── package.json
├── docs/
│   ├── PRODUCT_SCOPE.md
│   ├── ai-workflow.md
│   ├── insights-platform-agents-setup.md
│   └── git-github.md
├── docker/
│   ├── KEYCLOAK.md
│   ├── keycloak/import/
│   └── mongo/
├── insights.api/
│   ├── serverless.yml
│   ├── src/modules/
│   └── README.md
├── insights.web/
│   ├── src/
│   └── README.md
└── README.md
```

## Testes

| Tipo | Onde | Comando |
|------|------|---------|
| API | `insights.api` | `npm test` · `npm run test-coverage` · `npm run lint` |
| Web | `insights.web` | `yarn lint` |

E2E browser não documentado na raiz; fluxos manuais em `localhost:3000`.

## Integração contínua (CI)

Em [.github/workflows/](.github/workflows/):

| Workflow | Ideia |
|----------|--------|
| `ci-api.yml` | Mudanças em `insights.api/**` (e Nx na raiz) |
| `ci-web.yml` | Mudanças em `insights.web/**` |

Podem existir workflows legacy dentro de cada app — alinhar ou desativar após validar o CI da raiz.

## Desenvolvimento assistido por IA

Fluxo e agentes: [docs/ai-workflow.md](docs/ai-workflow.md) · [docs/insights-platform-agents-setup.md](docs/insights-platform-agents-setup.md). Regras persistentes: [`.cursor/rules/`](.cursor/rules/). Git monorepo na raiz: [docs/git-github.md](docs/git-github.md).
