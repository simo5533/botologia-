/**
 * Vérifie que toutes les dépendances du package.json sont présentes dans node_modules.
 * Exécuter après npm install : node scripts/verify-deps.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pkgPath = path.join(root, "package.json");
const nodeModules = path.join(root, "node_modules");

if (!fs.existsSync(nodeModules)) {
  console.error("ERREUR: node_modules introuvable. Lancez d'abord: npm install");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const missing = [];
const present = [];

for (const [name, version] of Object.entries(deps)) {
  const dir = path.join(nodeModules, name);
  const ok = fs.existsSync(dir);
  if (ok) present.push(name); else missing.push(name);
}

if (missing.length > 0) {
  console.error("Dépendances manquantes (" + missing.length + "):");
  missing.forEach((n) => console.error("  - " + n));
  process.exit(1);
}

console.log("OK: " + present.length + " dépendances installées.");
process.exit(0);
