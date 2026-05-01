/**
 * CSRF / origine : pour les mutations API depuis le navigateur, l’Origin doit
 * correspondre à NEXT_PUBLIC_APP_URL si cette variable est définie.
 * Requêtes sans Origin (curl, tests, certains proxies) : autorisées pour ne pas casser l’outillage.
 *
 * En développement : autoriser tout origin « local » (localhost, 127.0.0.1, ::1),
 * quel que soit le port — sinon un .env figé sur :3000 bloque en 403 dès que Next
 * écoute sur 3001/3002 (Origin ne matche pas).
 */

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isLocalDevBrowserOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    const h = hostname.toLowerCase();
    return h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]";
  } catch {
    return false;
  }
}

export function isUnsafeCrossOriginApiRequest(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (!MUTATING.has(method)) return false;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) return false;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const allowed = new URL(appUrl).origin;
    if (origin === allowed) return false;
    if (process.env.NODE_ENV === "development" && isLocalDevBrowserOrigin(origin)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
