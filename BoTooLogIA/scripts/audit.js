/**
 * Audit rapide BoTooLogIA — TypeScript, Prisma, Build.
 * Usage : node scripts/audit.js  ou  npm run audit:full
 */
const { execSync, spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");

function run(cmd, opts = {}) {
  try {
    execSync(cmd, { cwd: root, stdio: "pipe", ...opts });
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e.message || String(e) };
  }
}

console.log("═══════════════════════════════════");
console.log("🔍 AUDIT RAPIDE BoTooLogIA");
console.log("═══════════════════════════════════\n");

console.log("📦 TypeScript...");
const ts = run("npx tsc --noEmit");
console.log(ts.ok ? "✅ TS OK" : "❌ TS ERRORS");

console.log("\n🗄️ Prisma...");
const prisma = run("npx prisma validate");
console.log(prisma.ok ? "✅ SCHEMA OK" : "❌ SCHEMA ERROR");

console.log("\n🏗️ Build (prisma generate + next build)...");
const build = run("npm run build");
console.log(build.ok ? "✅ BUILD OK" : "❌ BUILD FAILED");

console.log("\n═══════════════════════════════════");
console.log("✅ AUDIT TERMINÉ");
console.log("═══════════════════════════════════");

process.exit(ts.ok && prisma.ok && build.ok ? 0 : 1);
