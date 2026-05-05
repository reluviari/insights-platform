# Keycloak local + seed (Docker)

## Ordem recomendada (raiz do monorepo)

1. `cp .env.docker.example .env`
2. No `.env`: **`KEYCLOAK_URL=http://keycloak:8080`**
3. `docker compose --profile keycloak up --build`
4. Com o **Mongo** já a correr: `docker compose --profile seed run --rm mongo-seed`

O mesmo fluxo está descrito no [README principal](../README.md#fluxo-keycloak-e-seed-mongo-no-docker).

## O que o repositório inclui

| Artefato | Função |
|----------|--------|
| [`keycloak/import/insights-dev-realm.json`](./keycloak/import/insights-dev-realm.json) | Realm **`insights-dev`**, client público **`insights-web`** (Direct Access Grants ativo), utilizador **`dev@example.com`** / **`DevPass123!`**. |
| [`mongo/seed-insights-keycloak-dev.js`](./mongo/seed-insights-keycloak-dev.js) | **MongoDB**: tenant com `realmId: insights-dev`, `urlSlug: https://localhost:3000`, customer com `clientId: insights-web`, user com o mesmo e-mail do Keycloak. |

Importação do realm corre **na primeira subida** do container com `--import-realm` (dados “limpos”). Se precisar reimportar, recrie o container do Keycloak (sem volume persistente, o modo `start-dev` costuma ser efémero; caso use volume, apague os dados do Keycloak antes).

## Subir Keycloak com Compose

Na raiz do monorepo, no `.env` (a partir do `.env.docker.example`):

```env
KEYCLOAK_URL=http://keycloak:8080
```

Suba API + Mongo + Web + Keycloak:

```bash
docker compose --profile keycloak up --build
```

- **Admin console:** [http://localhost:8080](http://localhost:8080) — utilizador/senha por defeito `admin` / `admin` (ou `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`).
- **URL interna para a API** (rede Docker): `http://keycloak:8080` — é esta que deve estar em `KEYCLOAK_URL` para o serviço `api`.

A API resolve `KEYCLOAK_URL` a partir de `config/local.yml` (`${env:KEYCLOAK_URL}`) quando corre o `serverless-offline` no container.

## Seed Mongo (tenant + user)

Com **Mongo** a correr (por exemplo stack já levantada):

```bash
docker compose --profile seed run --rm mongo-seed
```

Ou no host (Mongo em `localhost:27017`, base `qa-pbi`):

```bash
mongosh "mongodb://127.0.0.1:27017/qa-pbi" --file docker/mongo/seed-insights-keycloak-dev.js
```

Equivalente na pasta da API:

```bash
cd insights.api && npm run seed:mongo:keycloak
```

## Alinhar `tenants.urlSlug` ao front

O repositório de tenants faz o lookup com **Origin** do browser normalizado para HTTPS:

- Origin típico em dev: `http://localhost:3000`
- Valor guardado no Mongo: **`https://localhost:3000`**

O script de seed já usa esse `urlSlug`. Se alterar a URL do front, atualize o tenant (ou volte a correr o seed com os dados ajustados).

## Testar login Keycloak na API

O front padrão chama `/auth/sign-in` **sem** `type: keycloak` (usa JWT próprio com password em Mongo). Para testar o fluxo Keycloak, envie:

```bash
curl -sS -X POST http://localhost:4001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"dev@example.com","password":"DevPass123!","type":"keycloak"}'
```

Resposta esperada: JSON com `accessToken` e `refreshToken` emitidos pelo Keycloak.

As rotas protegidas que usam **`Authorize()`** esperam JWT assinado com `SECRET_TOKEN` (login clássico), não o access token do Keycloak. O decorator **`KeycloakAuthorize`** valida o JWT do Keycloak; hoje pode não estar ligado a handlers — o seed serve sobretudo a **integração do token endpoint** e a validação quando for adoptada.

## Variáveis úteis (Compose)

Definidas na raiz `.env` / [.env.docker.example](../.env.docker.example): `KEYCLOAK_URL`, credenciais admin opcionais `KEYCLOAK_ADMIN`, `KEYCLOAK_ADMIN_PASSWORD`.

Para fluxo de trabalho com IA: [docs/ai-workflow.md](../docs/ai-workflow.md).
