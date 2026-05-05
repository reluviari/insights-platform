/**
 * Confirma no Mongo se dev@example.com e admin@example.com existem e se o hash bcrypt bate com DevPass123!.
 *
 * URI:
 * - No host (porta publicada do Compose): MONGODB_URI=mongodb://127.0.0.1:27017/qa-pbi
 * - Dentro da rede Docker (ex.: no contentor api): MONGODB_URI=mongodb://mongo:27017/qa-pbi
 *
 * Ex.: docker compose exec api npm run verify:dev-login-data
 */
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const SEED_ACCOUNTS = ["dev@example.com", "admin@example.com"];
const DEFAULT_PASSWORD = "DevPass123!";

function connectionHint(uri, err) {
  const msg = String(err?.message ?? "");
  const mentionsMongoHost =
    /:\/\/mongo\b/i.test(uri) || /@mongo\b/i.test(uri);
  if (!mentionsMongoHost || !msg.includes("ENOTFOUND")) {
    return "";
  }
  return [
    "",
    'O hostname "mongo" só resolve dentro da rede Docker Compose.',
    "Desde o Mac/host (Mongo na porta 27017 publicada):",
    "  MONGODB_URI=mongodb://127.0.0.1:27017/qa-pbi npm run verify:dev-login-data",
    "Ou dentro do contentor da API:",
    "  docker compose exec api npm run verify:dev-login-data",
    "",
  ].join("\n");
}

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/qa-pbi";
  const plain = process.env.DEV_LOGIN_PASSWORD || DEFAULT_PASSWORD;

  const client = new MongoClient(uri);
  await client.connect();

  try {
    /* O driver usa o nome da BD na URI (ex.: …/qa-pbi); sem path, cai em "test". */
    const db = client.db();

    for (const email of SEED_ACCOUNTS) {
      const doc = await db.collection("users").findOne(
        { email },
        { projection: { email: 1, password: 1 } },
      );

      if (!doc) {
        console.error(
          `FAIL: não há utilizador ${email} nesta base — corra o seed completo (mongo-seed no Compose ou npm run seed:mongo:dev)`,
        );
        process.exitCode = 1;
        continue;
      }

      const hash = doc.password;
      if (hash == null || typeof hash !== "string" || hash.length === 0) {
        console.error(
          `FAIL: ${email} sem password válida — corra npm run seed:dev-password ou seed completo`,
        );
        process.exitCode = 1;
        continue;
      }

      if (!bcrypt.compareSync(plain, hash)) {
        console.error(`FAIL: bcrypt não confere para ${email} — atualize com seed`);
        process.exitCode = 1;
        continue;
      }

      console.log(`OK: ${email} — senha de desenvolvimento confere (bcryptjs).`);
    }
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
