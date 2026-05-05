/**
 * Atualiza o hash bcrypt dos utilizadores de seed (DevPass123!): dev@example.com e admin@example.com.
 * Funciona no host e dentro do contentor `api` — não depende de ficheiros fora de /app.
 *
 * Manter o hash alinhado com docker/mongo/seed-insights-keycloak-dev.js (const devPasswordHash).
 *
 * Uso: MONGODB_URI=... npm run seed:dev-password
 */
const { MongoClient } = require("mongodb");

const REQUIRED_EMAIL = "dev@example.com";
const SEED_PASSWORD_EMAILS = ["dev@example.com", "admin@example.com"];
const DEV_PASSWORD_HASH =
  "$2a$08$9gpQkNNWMvG7AU7RYZPvdOj2cSEg7cg8ExMtRu.nIqGZKLZj4rpN6";

function connectionHint(uri, err) {
  const msg = String(err?.message ?? "");
  const mentionsMongoHost = /:\/\/mongo\b/i.test(uri) || /@mongo\b/i.test(uri);
  if (!mentionsMongoHost || !msg.includes("ENOTFOUND")) {
    return "";
  }
  return [
    "",
    'O hostname "mongo" só resolve dentro da rede Docker Compose.',
    "No host:",
    "  MONGODB_URI=mongodb://127.0.0.1:27017/qa-pbi npm run seed:dev-password",
    "Ou dentro do contentor api:",
    "  docker compose exec api npm run seed:dev-password",
    "",
  ].join("\n");
}

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/qa-pbi";

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db();
    const updated = [];

    for (const email of SEED_PASSWORD_EMAILS) {
      const result = await db.collection("users").updateOne(
        { email },
        { $set: { password: DEV_PASSWORD_HASH, updatedAt: new Date() } },
      );
      if (result.matchedCount > 0) {
        updated.push(email);
      }
    }

    if (!updated.includes(REQUIRED_EMAIL)) {
      console.error(
        `FAIL: não existe ${REQUIRED_EMAIL} nesta base. Corra o seed completo na raiz do repo:\n` +
          "  npm run seed:mongo:dev\n" +
          "ou no contentor mongo:\n" +
          "  docker compose exec mongo mongosh mongodb://127.0.0.1:27017/qa-pbi /docker-entrypoint-initdb.d/01-seed-insights-dev.js",
      );
      process.exitCode = 1;
      return;
    }

    if (!updated.includes("admin@example.com")) {
      console.warn(
        "AVISO: admin@example.com não existe nesta base — rode o seed completo para criar o administrador.",
      );
    }

    console.log(
      `OK: password (bcrypt) aplicada a: ${updated.join(", ")}. Senha em claro (dev): DevPass123!`,
    );
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error(err.message || err);
  const hint = connectionHint(process.env.MONGODB_URI || "", err);
  if (hint) {
    console.error(hint);
  }
  process.exit(1);
});
