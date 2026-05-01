/**
 * Vérifie la connexion PostgreSQL (retries) + état des migrations.
 * Usage : node scripts/check-db.js   ou   npm run db:check
 */
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { execSync } = require("child_process");
const { Client } = require("pg");

const RETRIES = 3;
const DELAY_MS = 2000;

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Erreur: DATABASE_URL manquant dans .env");
  process.exit(1);
}

const masked = url.replace(/:([^:@]+)@/, ":****@");
console.log("Connexion (depuis .env):", masked);
console.log("");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function tryQuery() {
  const client = new Client({ connectionString: url.trim() });
  try {
    await client.connect();
    await client.query("SELECT 1");
    console.log("OK — requête SQL (SELECT 1) réussie.");
    return true;
  } catch (e) {
    const code = e && typeof e === "object" && "code" in e ? String(e.code) : "";
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Échec connexion PostgreSQL:", code || "(no code)", msg);
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

async function main() {
  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    if (await tryQuery()) break;
    if (attempt === RETRIES) {
      console.error(`Abandon après ${RETRIES} tentatives.`);
      process.exit(1);
    }
    console.log(`Nouvelle tentative dans ${DELAY_MS / 1000}s… (${attempt}/${RETRIES})`);
    await sleep(DELAY_MS);
  }

  try {
    execSync("npx prisma migrate status", {
      stdio: "inherit",
      cwd: path.resolve(__dirname, ".."),
      shell: true,
    });
    console.log("");
    console.log("Base prête, migrations cohérentes.");
  } catch (e) {
    process.exit(e.status || 1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
