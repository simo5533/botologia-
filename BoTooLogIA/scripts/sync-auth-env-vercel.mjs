/**
 * Pousse NEXTAUTH_SECRET, JWT_SECRET, OPENAI_API_KEY, NEXT_PUBLIC_APP_URL, ADMIN_PROTECTION_ENABLED
 * depuis .env vers Vercel (production). Ne loggue pas les valeurs.
 * Usage : node scripts/sync-auth-env-vercel.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
const scope = "bo-toolog-ia";

function parseEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

function addProduction(name, value, sensitive = true) {
  if (!value) return;
  const args = ["vercel", "env", "add", name, "production", "--value", value, "--yes", "--force", "--scope", scope];
  if (sensitive) args.push("--sensitive");
  const r = spawnSync("npx", args, { cwd: root, stdio: "pipe", shell: true });
  if (r.status !== 0) {
    const err = r.stderr?.toString() || r.stdout?.toString() || "exit " + r.status;
    throw new Error(`${name}: ${err}`);
  }
}

const map = parseEnv(envPath);
const appUrl = "https://botoologia.vercel.app";

try {
  addProduction("NEXTAUTH_SECRET", map.NEXTAUTH_SECRET);
  addProduction("JWT_SECRET", map.JWT_SECRET);
  addProduction("OPENAI_API_KEY", map.OPENAI_API_KEY);
  addProduction("NEXT_PUBLIC_APP_URL", appUrl, false);
  addProduction("ADMIN_PROTECTION_ENABLED", "true", false);
  console.log("Variables auth / public poussées vers Vercel (production).");
} catch (e) {
  console.error("Erreur sync Vercel:", e instanceof Error ? e.message : e);
  process.exit(1);
}
