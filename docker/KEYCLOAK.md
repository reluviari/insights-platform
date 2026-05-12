# Keycloak + SSO (referência futura — **não em uso**)

> **Estado atual:** o projeto **não utiliza Keycloak** no dia a dia. Este documento, o perfil Compose `keycloak` e `docker/keycloak/import/` existem **apenas** para quando o time decidir implementar **SSO corporativo**. Para desenvolvimento normal: ignora esta página, mantém `KEYCLOAK_URL` vazio e não uses `--profile keycloak`.

Quando no futuro existir essa fase, **Keycloak** será um IdP (**OpenID Connect**): realms por cliente, integração com AD, etc. Até lá o produto fica com **login e-mail + senha** e JWT via **MongoDB**.

---

**Seed Mongo:** o script [`docker/mongo/seed-insights-keycloak-dev.js`](./mongo/seed-insights-keycloak-dev.js) é usado de duas formas na stack local: (1) montado em `/docker-entrypoint-initdb.d/` no serviço **Mongo**, onde roda apenas na primeira inicialização de um volume vazio; e (2) executado pelo serviço one-shot **`mongo-seed`** em cada `docker compose up`, garantindo dados atualizados mesmo em volumes antigos. Popula Mongo **sem Keycloak**; campos como `realmId` ficam para eventual SSO.

Para repetir o seed à mão:

```bash
docker compose exec mongo mongosh mongodb://127.0.0.1:27017/qa-pbi /docker-entrypoint-initdb.d/01-seed-insights-dev.js
```

## Quando Keycloak for ligado (futuro)

1. `cp .env.docker.example .env`
2. **`KEYCLOAK_URL=http://keycloak:8080`**
3. `docker compose --profile keycloak up --build`

O seed no Mongo segue o fluxo acima (initdb ou exec manual); o Keycloak importa o realm em `docker/keycloak/import`.

Fluxo geral do monorepo: [README principal](../README.md#como-rodar).

## Artefactos no repositório

| Artefato | Função |
|----------|--------|
| [`keycloak/import/insights-dev-realm.json`](./keycloak/import/insights-dev-realm.json) | Realm **`insights-dev`**, client **`insights-web`**, utilizador **`dev@example.com`** / **`DevPass123!`** (para testes SSO quando ativo). |
| [`mongo/seed-insights-keycloak-dev.js`](./mongo/seed-insights-keycloak-dev.js) | Mongo: tenant, customer, **`dev@example.com`** (USER) e **`admin@example.com`** (ADMIN) com **`password`** em bcrypt (senha em claro **`DevPass123!`** — login **clássico** na UI; Keycloak não obrigatório). |

## Front (`NEXT_PUBLIC_INSIGHTS_SSO_ENABLED`)

- **`false`:** botão SSO na `/login` desativado (fluxo atual).
- **`true`:** reservado para quando o redirect OIDC estiver implementado.

## Console admin Keycloak (só com perfil ativo)

- **Console:** [http://localhost:8080](http://localhost:8080) — `admin` / `admin` (ou variáveis `KEYCLOAK_*`).
- **URL interna (Docker):** `http://keycloak:8080` → `KEYCLOAK_URL` na API.

## Correr só o seed Mongo no host

```bash
mongosh "mongodb://127.0.0.1:27017/qa-pbi" --file docker/mongo/seed-insights-keycloak-dev.js
```

Ou: `cd insights.api && npm run seed:mongo:keycloak`

## `tenants.urlSlug`

Origin típico em dev: `http://localhost:3000`. Valor no Mongo (seed): **`https://localhost:3000`**.

## Testar login Keycloak na API (só quando IdP estiver no ar)

```bash
curl -sS -X POST http://localhost:4001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"dev@example.com","password":"DevPass123!","type":"keycloak"}'
```

As rotas com **`Authorize()`** esperam JWT da API (login clássico), não o access token bruto do Keycloak — ver código (`KeycloakAuthorize`, etc.).

## Variáveis (quando SSO existir)

`KEYCLOAK_URL`, `KEYCLOAK_ADMIN`, `KEYCLOAK_ADMIN_PASSWORD`, `NEXT_PUBLIC_INSIGHTS_SSO_ENABLED` — [.env.docker.example](../.env.docker.example).

IA operacional: [CLAUDE.md](../CLAUDE.md).
