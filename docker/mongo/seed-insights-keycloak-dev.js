/**
 * Seed idempotente: tenant + customer + user em Mongo (campos alinhados ao realm futuro `insights-dev`).
 * Keycloak NÃO precisa de estar a correr — uso atual é só dados base em Mongo.
 *
 * Na primeira subida do Mongo com volume vazio, o Docker Compose monta este ficheiro em
 * /docker-entrypoint-initdb.d (sem contentor extra). Para repetir à mão:
 *   docker compose exec mongo mongosh mongodb://127.0.0.1:27017/qa-pbi /docker-entrypoint-initdb.d/01-seed-insights-dev.js
 * ou, no host (Mongo local):
 *   mongosh "mongodb://127.0.0.1:27017/qa-pbi" --file docker/mongo/seed-insights-keycloak-dev.js
 *
 * O utilizador dev é aplicado com updateOne por email: atualiza password (bcrypt) mesmo se o doc já existir com outro _id.
 * Senha em claro documentada no README da raiz.
 */

const tenantId = ObjectId("507f191e810c19729de860e1");
const customerId = ObjectId("507f191e810c19729de860e2");
const userId = ObjectId("507f191e810c19729de860e3");
const now = new Date();

db.tenants.replaceOne(
  { urlSlug: "https://localhost:3000" },
  {
    _id: tenantId,
    name: "Tenant dev (seed)",
    realmId: "insights-dev",
    urlSlug: "https://localhost:3000",
    document: "00000000000199",
    externalWorkspaceId: "seed-external-workspace-001",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  { upsert: true },
);

db.customers.replaceOne(
  { document: "00000000000299" },
  {
    _id: customerId,
    name: "Customer dev (seed)",
    document: "00000000000299",
    clientId: "insights-web",
    tenant: tenantId,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  { upsert: true },
);

const devPasswordHash =
  "$2a$08$lCBH/LLWsnY0I92FDf81deTsw0oJeptVvgbXVzrP0KaWPf.SIdahq";

db.users.updateOne(
  { email: "dev@example.com" },
  {
    $set: {
      email: "dev@example.com",
      name: "Dev User (seed)",
      clientId: "insights-web",
      isActive: true,
      roles: ["USER"],
      customer: customerId,
      tenants: [tenantId],
      password: devPasswordHash,
      updatedAt: now,
    },
    $setOnInsert: {
      _id: userId,
      createdAt: now,
    },
  },
  { upsert: true },
);

print(
  "insights-platform seed: tenants/customers/users OK (dev@example.com — senha de desenvolvimento no README da raiz).",
);
