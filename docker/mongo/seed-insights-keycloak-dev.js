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
 * Só repor a password bcrypt do dev (sem mongosh --file no contentor api): na pasta insights.api,
 *   npm run seed:dev-password
 * (usa MONGODB_URI; corre dentro de `docker compose exec api`.)
 *
 * Os utilizadores dev são aplicados com updateOne por email: atualizam password (bcrypt) mesmo se o doc já existir com outro _id.
 * Senha em claro documentada no README da raiz.
 */

const tenantId = ObjectId("507f191e810c19729de860e1");
const customerId = ObjectId("507f191e810c19729de860e2");
const userId = ObjectId("507f191e810c19729de860e3");
const adminUserId = ObjectId("507f191e810c19729de860e4");
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

// bcryptjs cost 8 — plaintext DevPass123! (gerado e verificado com bcryptjs.compareSync no repo)
const devPasswordHash =
  "$2a$08$9gpQkNNWMvG7AU7RYZPvdOj2cSEg7cg8ExMtRu.nIqGZKLZj4rpN6";

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

/* Administrador da plataforma / tenant — telas de Configurações (clientes, departamentos, usuários, relatórios). */
db.users.updateOne(
  { email: "admin@example.com" },
  {
    $set: {
      email: "admin@example.com",
      name: "Administrador da plataforma (seed)",
      clientId: "insights-web",
      isActive: true,
      roles: ["ADMIN"],
      customer: customerId,
      tenants: [tenantId],
      password: devPasswordHash,
      updatedAt: now,
    },
    $setOnInsert: {
      _id: adminUserId,
      createdAt: now,
    },
  },
  { upsert: true },
);

print(
  "insights-platform seed: tenants/customers/users OK (dev@example.com USER + admin@example.com ADMIN — senha dev no README da raiz).",
);
