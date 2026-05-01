/**
 * Rate limiting dédié aux routes /api/auth/* (fenêtre courte, plafond plus bas que l’API globale).
 */

import { getActiveRateLimitStore } from "./rate-limit-store";

const WINDOW_MS = 60 * 1000;
const MAX_AUTH_REQUESTS_PER_WINDOW = 30;

function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return (forwarded?.split(",")[0]?.trim() || realIp || "unknown").slice(0, 64);
}

export async function isAuthRateLimited(request: Request): Promise<boolean> {
  const id = `auth:${getClientId(request)}`;
  const store = getActiveRateLimitStore();
  const { limited } = await store.increment(id, WINDOW_MS, MAX_AUTH_REQUESTS_PER_WINDOW);
  return limited;
}
