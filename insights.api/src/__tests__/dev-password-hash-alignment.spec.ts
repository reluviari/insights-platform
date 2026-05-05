import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

/**
 * Garante que o hash bcrypt do utilizador dev não diverge entre o seed Mongo e o script Node.
 */
describe("alinhamento hash password dev", () => {
  it("seed-insights-keycloak-dev.js e apply-dev-user-password.cjs usam o mesmo bcrypt hash", () => {
    const apiRoot = path.join(__dirname, "..", "..");
    const repoRoot = path.join(apiRoot, "..");
    const seedPath = path.join(repoRoot, "docker/mongo/seed-insights-keycloak-dev.js");
    const applyPath = path.join(apiRoot, "scripts", "apply-dev-user-password.cjs");

    const seed = fs.readFileSync(seedPath, "utf8");
    const apply = fs.readFileSync(applyPath, "utf8");

    const bcryptHashRe = /\$2a\$08\$[\./A-Za-z0-9]{53}/g;
    const seedMatch = seed.match(bcryptHashRe);
    const applyMatch = apply.match(bcryptHashRe);

    expect(seedMatch?.length).toBeGreaterThanOrEqual(1);
    expect(applyMatch?.length).toBeGreaterThanOrEqual(1);
    expect(seedMatch![0]).toBe(applyMatch![0]);
    expect(bcrypt.compareSync("DevPass123!", seedMatch![0])).toBe(true);
  });
});
