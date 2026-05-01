/**
 * Audit complet BoTooLogIA — TypeScript, Prisma, Tests, Fichiers critiques.
 * Usage : npx tsx scripts/audit-full.ts
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const root = process.cwd();

interface Result {
  category: string;
  status: "OK" | "WARN" | "ERROR";
  message: string;
  details?: string;
}

const results: Result[] = [];

function run(cmd: string): { ok: boolean; out: string } {
  try {
    const out = execSync(cmd, {
      cwd: root,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { ok: true, out: out || "" };
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    return { ok: false, out: err.stderr || err.stdout || err.message || String(e) };
  }
}

function add(category: string, ok: boolean, message: string, details?: string) {
  results.push({
    category,
    status: ok ? "OK" : "ERROR",
    message,
    details: details?.slice(0, 300),
  });
}

console.log("\n🔍 ═══════════════════════════════════");
console.log("   AUDIT COMPLET BoTooLogIA");
console.log("═══════════════════════════════════\n");

// TypeScript
const ts = run("npx tsc --noEmit 2>&1");
add("TypeScript", ts.ok && !ts.out.includes("error TS"), ts.ok ? "0 erreurs" : "Erreurs", ts.out);

// Prisma
const prismaValidate = run("npx prisma validate 2>&1");
add("Prisma validate", prismaValidate.ok, prismaValidate.ok ? "Schema valide" : "Erreur", prismaValidate.out);

// Tests
const tests = run("npx vitest run 2>&1");
const testsPassed = /passed|Test Files\s+\d+ passed/.test(tests.out) && !/Failed|failed/.test(tests.out);
add("Tests Vitest", testsPassed, testsPassed ? "Tous passés" : "Échecs", tests.out.slice(-400));

// Fichiers critiques
const criticalFiles = [
  "prisma/schema.prisma",
  "prisma.config.ts",
  "lib/db/prisma.ts",
  "lib/auth/session.ts",
  "lib/auth/password.ts",
  "lib/api/auth-guard.ts",
  "app/layout.tsx",
  "app/(public)/layout.tsx",
];

for (const f of criticalFiles) {
  const full = path.join(root, f);
  const exists = fs.existsSync(full);
  results.push({
    category: `Fichier: ${f}`,
    status: exists ? "OK" : "ERROR",
    message: exists ? "Présent" : "ABSENT",
  });
}

// .env
const envPath = path.join(root, ".env");
const envExists = fs.existsSync(envPath);
let envHasDatabaseUrl = false;
if (envExists) {
  const content = fs.readFileSync(envPath, "utf8");
  envHasDatabaseUrl = /DATABASE_URL\s*=/.test(content);
}
results.push({
  category: "ENV: .env",
  status: envExists ? "OK" : "WARN",
  message: envExists ? "Présent" : "Manquant",
});
results.push({
  category: "ENV: DATABASE_URL",
  status: envHasDatabaseUrl ? "OK" : "WARN",
  message: envHasDatabaseUrl ? "Défini" : "Non vérifié ou manquant",
});

// Score
const total = results.length;
const okCount = results.filter((r) => r.status === "OK").length;
const warnCount = results.filter((r) => r.status === "WARN").length;
const score = okCount + warnCount * 0.5;
const pct = Math.round((score / total) * 100);

console.log("RÉSULTATS :");
console.log("═══════════════════════════════════");
for (const r of results) {
  const icon = r.status === "OK" ? "✅" : r.status === "WARN" ? "⚠️" : "❌";
  console.log(`${icon} ${r.category}: ${r.message}`);
}
console.log("\n═══════════════════════════════════");
console.log(`SCORE AUDIT: ${score}/${total} → ${pct}%`);
console.log("═══════════════════════════════════\n");

// Rapport JSON
const report = { date: new Date().toISOString(), score: pct, results };
fs.writeFileSync(path.join(root, "AUDIT_REPORT.json"), JSON.stringify(report, null, 2));
console.log("📄 Rapport sauvegardé: AUDIT_REPORT.json\n");

if (pct < 80) {
  console.log("⚠️ Score < 80% — corrections recommandées");
  process.exit(1);
}
console.log("🎯 Audit terminé.");
process.exit(0);
