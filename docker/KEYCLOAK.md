# Keycloak local + SSO opcional (Docker)

**Por que Keycloak é opcional:** o produto usa por defeito **login com e-mail e senha** (JWT emitido pela API com dados em **MongoDB**). **Keycloak** entra quando a organização precisa de **SSO corporativo** (OpenID Connect): IdP partilhado, realms por cliente, AD corporativo, etc.

**Seed Mongo na stack por defeito:** em cada `docker compose up --build` na **raiz**, o job **`mongo-seed`** corre automaticamente depois do Mongo ficar saudável e **antes** da API (`docker/mongo/seed-insights-keycloak-dev.js`, idempotente). Cria tenant, customer e utilizador **`dev@example.com`** alinhados ao realm **insights-dev** (útil para testes com Keycloak e para dados base em Mongo).

Para repetir **só** o seed (Mongo já a correr na mesma stack Compose):

```bash
docker compose run --rm mongo-seed
```

## Arranque rápido (com Keycloak)

Para subir também o IdP local e testar SSO na API (`KEYCLOAK_URL`):

1. `cp .env.docker.example .env`
2. No `.env`: **`KEYCLOAK_URL=http://keycloak:8080`**
3. `docker compose --profile keycloak up --build`

O **mongo-seed** já terá corrido na stack por defeito; o Keycloak importa o realm em `docker/keycloak/import`.

Fluxo geral: [README principal](../README.md#como-rodar).

## O que o repositório inclui

| Artefato | Função |
|----------|--------|
| [`keycloak/import/insights-dev-realm.json`](./keycloak/import/insights-dev-realm.json) | Realm **`insights-dev`**, client público **`insights-web`** (Direct Access Grants ativo), utilizador **`dev@example.com`** / **`DevPass123!`**. |
| [`mongo/seed-insights-keycloak-dev.js`](./mongo/seed-insights-keycloak-dev.js) | **MongoDB**: tenant com `realmId: insights-dev`, `urlSlug: https://localhost:3000`, customer com `clientId: insights-web`, user com o mesmo e-mail do Keycloak. |

Importação do realm corre na subida do container com `--import-realm`. Se precisar de forçar reimportação com dados “limpos”, recrie o container/volume do Keycloak conforme a sua política local.

## Front (bandeira SSO)

O botão **“Continuar com SSO (Keycloak)”** na página de login responde à variável **`NEXT_PUBLIC_INSIGHTS_SSO_ENABLED`**.

- **`false` (por defeito):** o utilizador vê o fluxo SSO como **desativado**, com texto que remete ao README — fluxo OIDC completo pode ser ligado mais tarde.
- **`true`:** o botão deixa de estar bloqueado; neste repositório o redirect OIDC no cliente pode ser completado quando o fluxo estiver implementado (ver handlers `/auth/sign-in` com `type: keycloak` na API).

## Console admin

- **Admin console:** [http://localhost:8080](http://localhost:8080) — utilizador/senha por defeito `admin` / `admin` (ou `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`).
- **URL interna para a API** (rede Docker): `http://keycloak:8080` — é esta que deve estar em `KEYCLOAK_URL` para o serviço `api`.

A API resolve `KEYCLOAK_URL` a partir de `config/local.yml` (`${env:KEYCLOAK_URL}`) quando corre o `serverless-offline` no container.

## Correr só o seed Mongo (host local)

Mongo em `localhost:27017`, base `qa-pbi`:

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

Definidas na raiz `.env` / [.env.docker.example](../.env.docker.example): `KEYCLOAK_URL`, credenciais admin opcionais `KEYCLOAK_ADMIN`, `KEYCLOAK_ADMIN_PASSWORD`, `NEXT_PUBLIC_INSIGHTS_SSO_ENABLED`.

Para fluxo de trabalho com IA: [docs/ai-workflow.md](../docs/ai-workflow.md).
