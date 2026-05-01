/**
 * Plafonds OWASP / spec prod (Edge, store mémoire par défaut).
 * - API globale : 100 req / min / IP
 * - POST /api/auth/login : 10 / 15 min / IP
 * - POST /api/auth/verify-2fa : 5 / 15 min / IP
 * - POST /api/contact : 3 / heure / IP
 * - Autres /api/auth/* : 60 / min / IP (session, logout, etc.)
 */

import { getActiveRateLimitStore } from "./rate-limit-store";

const MIN_MS = 60 * 1000;
const QUARTER_H_MS = 15 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return (forwarded?.split(",")[0]?.trim() || realIp || "unknown").slice(0, 64);
}

export async function checkGlobalApiRateLimited(request: Request): Promise<boolean> {
  const id = `api:${getClientId(request)}`;
  const store = getActiveRateLimitStore();
  const { limited } = await store.increment(id, MIN_MS, 100);
  return limited;
}

export async function checkLoginRateLimited(request: Request): Promise<boolean> {
  const id = `auth_login:${getClientId(request)}`;
  const store = getActiveRateLimitStore();
  const { limited } = await store.increment(id, QUARTER_H_MS, 10);
  return limited;
}

export async function checkVerify2faRateLimited(request: Request): Promise<boolean> {
  const id = `auth_2fa:${getClientId(request)}`;
  const store = getActiveRateLimitStore();
  const { limited } = await store.increment(id, QUARTER_H_MS, 5);
  return limited;
}

export async function checkContactPostRateLimited(request: Request): Promise<boolean> {
  const id = `contact:${getClientId(request)}`;
  const store = getActiveRateLimitStore();
  const { limited } = await store.increment(id, HOUR_MS, 3);
  return limited;
}

export async function checkAuthMiscRateLimited(request: Request): Promise<boolean> {
  const id = `auth_misc:${getClientId(request)}`;
  const store = getActiveRateLimitStore();
  const { limited } = await store.increment(id, MIN_MS, 60);
  return limited;
}
