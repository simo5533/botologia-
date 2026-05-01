import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "../..");

function listRouteFiles(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) out.push(...listRouteFiles(full));
    else if (name.name === "route.ts") out.push(full);
  }
  return out;
}

/** Route qui touche la persistance / audit : doit gérer les erreurs DB de façon homogène. */
function routeTouchesPersistence(source: string): boolean {
  return (
    /\bprisma\./.test(source) ||
    /\bcreateAuditLog\b/.test(source) ||
    /from ["']@\/lib\/db\//.test(source) ||
    /from ["']@\/lib\/services\/boss-service["']/.test(source)
  );
}

function hasDbErrorHandling(source: string, relPath: string): boolean {
  if (/respondApiCatch\s*\(/.test(source)) return true;
  if (/withApiErrorHandler\s*\(/.test(source)) return true;
  if (relPath.replace(/\\/g, "/").endsWith("app/api/health/route.ts") && /handleDbFailure\s*\(/.test(source)) {
    return true;
  }
  return false;
}

describe("api routes — couverture erreurs DB / catch", () => {
  it("chaque route API qui touche la persistance utilise respondApiCatch, withApiErrorHandler ou handleDbFailure (health)", () => {
    const apiDir = path.join(PROJECT_ROOT, "app", "api");
    const routes = listRouteFiles(apiDir);
    expect(routes.length).toBeGreaterThan(0);

    const missing: string[] = [];
    for (const abs of routes) {
      const src = fs.readFileSync(abs, "utf8");
      if (!routeTouchesPersistence(src)) continue;
      const rel = path.relative(PROJECT_ROOT, abs);
      if (!hasDbErrorHandling(src, rel)) {
        missing.push(rel);
      }
    }
    expect(missing, `Routes sans pattern attendu : ${missing.join(", ")}`).toEqual([]);
  });
});
