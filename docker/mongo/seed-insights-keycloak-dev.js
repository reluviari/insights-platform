/**
 * Seed idempotente: tenant + customer + user alinhados ao realm Keycloak `insights-dev`
 * (clientId `insights-web`, utilizador dev@example.com / DevPass123!).
 *
 * Executar (Compose com perfil Keycloak sobe este job uma vez; repetir à mão se precisar):
 *   docker compose --profile keycloak run --rm mongo-seed
 * ou, no host (Mongo local):
 *   mongosh "mongodb://127.0.0.1:27017/qa-pbi" --file docker/mongo/seed-insights-keycloak-dev.js
 *
 * IMPORTANTE: `urlSlug` do tenant tem de ser https://localhost:3000 — a API normaliza o Origin
 * http://localhost:3000 para esse valor em findBySlug.
 */

const tenantId = ObjectId("507f191e810c19729de860e1");
const customerId = ObjectId("507f191e810c19729de860e2");
const userId = ObjectId("507f191e810c19729de860e3");
const now = new Date();

db.tenants.replaceOne(
  { urlSlug: "https://localhost:3000" },
  {
    _id: tenantId,
    name: "Tenant dev (Keycloak seed)",
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

db.users.replaceOne(
  { email: "dev@example.com" },
  {
    _id: userId,
    name: "Dev User (seed)",
    email: "dev@example.com",
    clientId: "insights-web",
    isActive: true,
    roles: ["USER"],
    customer: customerId,
    tenants: [tenantId],
    createdAt: now,
    updatedAt: now,
  },
  { upsert: true },
);

print("insights-platform seed: tenants/customers/users OK (Keycloak realm insights-dev + client insights-web).");
