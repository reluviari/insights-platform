# Desenvolvimento local — Insights Platform

Este documento detalha execução local, seed de dados, hot reload e troubleshooting. Para o caminho rápido, veja o [README da raiz](../README.md#como-rodar-localmente).

---

## Caminho recomendado: stack completa

Na raiz do repositório:

```bash
cp .env.docker.example .env
docker compose up --build
```

A stack sobe:

1. **MongoDB**.
2. **mongo-seed** one-shot.
3. **insights.api** em Serverless Offline.
4. **insights.web** em Next.js dev server.

| Serviço | URL |
|---------|-----|
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API | [http://localhost:4001](http://localhost:4001) |
| Health check | `GET http://localhost:4001/api/health-check` |
| MongoDB no host | `mongodb://localhost:27017` |

---

## Seed de desenvolvimento

Em cada `docker compose up`, o serviço **`mongo-seed`** executa:

```text
docker/mongo/seed-insights-keycloak-dev.js
```

O script roda contra `MONGODB_URI`, por padrão:

```text
mongodb://mongo:27017/qa-pbi
```

Ele é idempotente e garante dados mínimos para desenvolvimento:

| Dado | Valor |
|------|-------|
| Tenant | Tenant local de desenvolvimento. |
| Customer | Customer associado ao tenant. |
| Usuário final | `dev@example.com` / `DevPass123!` |
| Administrador | `admin@example.com` / `DevPass123!` |
| Hash de senha | bcrypt para `DevPass123!`. |

O mesmo arquivo também é montado em `/docker-entrypoint-initdb.d/01-seed-insights-dev.js` no serviço `mongo`. A imagem oficial do Mongo executa scripts desse diretório **apenas na primeira inicialização** de um volume vazio.

---

## Credenciais locais

| Persona | E-mail | Senha |
|---------|--------|-------|
| Administrador | `admin@example.com` | `DevPass123!` |
| Usuário final | `dev@example.com` | `DevPass123!` |

Acesse [http://localhost:3000/login](http://localhost:3000/login).

---

## Verificações rápidas

Health check:

```bash
curl -s http://localhost:4001/api/health-check
```

Login do usuário final:

```bash
curl -sS -X POST http://localhost:4001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"dev@example.com","password":"DevPass123!"}'
```

Login do administrador:

```bash
curl -sS -X POST http://localhost:4001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"admin@example.com","password":"DevPass123!"}'
```

Em sucesso, a resposta inclui `accessToken`.

---

## Reaplicar seed

### Seed completo a partir da raiz

```bash
npm run seed:mongo:dev
```

Esse comando usa `mongosh` e o arquivo `docker/mongo/seed-insights-keycloak-dev.js`.

### Atualizar só o hash da senha dev

Na pasta `insights.api`:

```bash
npm run seed:dev-password
```

Útil quando o volume já existe e o campo `password` ficou vazio ou antigo.

### Fallback manual com `mongosh` no container

```bash
docker compose exec mongo mongosh mongodb://127.0.0.1:27017/qa-pbi /docker-entrypoint-initdb.d/01-seed-insights-dev.js
```

---

## Modo hot reload sem rebuild da stack completa

1. Suba apenas o Mongo:

```bash
docker compose up -d mongo
```

2. Aplique o seed, se necessário:

```bash
docker compose run --rm mongo-seed
```

3. Terminal 1 — API:

```bash
cd insights.api
npm install
npm run dev
```

4. Terminal 2 — Web:

```bash
cd insights.web
cp .env.example .env
yarn install
yarn dev
```

A API fica em `http://localhost:4001` e o front em `http://localhost:3000`.

---

## API isolada com Mongo da pasta `insights.api`

Na pasta `insights.api`:

```bash
docker compose up -d
npm install
npm run dev
```

Conexão típica:

```text
mongodb://127.0.0.1:27017/qa-pbi
```

Confira `MONGODB_URI` em `insights.api/config/local.yml`. Também é possível exportar `MONGODB_URI` no terminal para sobrescrever a configuração.

---

## Servidor Fastify alternativo

A API possui um modo alternativo limitado:

```bash
cd insights.api
npm run dev:local
```

| Item | Valor |
|------|-------|
| Base URL | `http://localhost:45000` |
| Documentação textual | `GET http://localhost:45000/doc` |

Esse modo mapeia um subconjunto de rotas em `server.ts`.

### Invocação estilo Lambda no Fastify

Com `npm run dev:local` rodando, envie um `POST` para:

```text
http://localhost:45000/lambda
```

Corpo de exemplo:

```json
{
  "path": "/auth/validate-token",
  "httpMethod": "POST",
  "pathParameters": {},
  "queryStringParameters": {},
  "headers": {},
  "body": "{}"
}
```

O campo `path` precisa existir em `insights.api/server.ts`.

---

## Variáveis de ambiente

| Arquivo | Uso |
|---------|-----|
| `.env.docker.example` | Modelo da stack Docker na raiz. |
| `insights.api/.env.example` | Modelo da API isolada. |
| `insights.web/.env.example` | Modelo do front isolado. |
| `insights.api/config/local.yml` | Configuração local da API. |

Variáveis importantes:

| Variável | Uso |
|----------|-----|
| `MONGODB_URI` | Conexão MongoDB. |
| `SECRET_TOKEN` | Assinatura JWT da API. |
| `NEXT_PUBLIC_INSIGHTS_API` | URL da API consumida pelo front. |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | Sessão no front. |
| `AZURE_*` | Integração Power BI real. |
| `KEYCLOAK_URL` | Deve ficar vazio no fluxo normal atual. |

---

## Troubleshooting

### Porta 27017 ocupada

Pare outro Mongo local ou altere o mapeamento do Compose, por exemplo:

```yaml
27018:27017
```

Entre containers, a API continua usando `mongo:27017`. Fora do Docker, use a porta publicada, como `mongodb://127.0.0.1:27018/qa-pbi`.

### Seed não refletiu

Opções:

```bash
docker compose run --rm mongo-seed
npm run seed:mongo:dev
cd insights.api && npm run seed:dev-password
```

Se quiser reinício limpo do banco local:

```bash
docker compose down -v
docker compose up --build
```

Esse comando remove volumes locais da stack. Use apenas quando puder descartar dados locais.

### API sobe, mas embed Power BI falha

Isso é esperado sem Azure AD / Power BI configurados. Login, navegação e administração local podem funcionar mesmo sem embed real.

### Keycloak não funciona

Keycloak não faz parte do fluxo diário. Use o login clássico com e-mail e senha. Material de Keycloak existe para SSO futuro: [docker/KEYCLOAK.md](../docker/KEYCLOAK.md).

---

## Links relacionados

- [README raiz](../README.md)
- [Autenticação e tenancy](./AUTH_AND_TENANCY.md)
- [Power BI](./POWER_BI.md)
- [Arquitetura](./ARCHITECTURE.md)
