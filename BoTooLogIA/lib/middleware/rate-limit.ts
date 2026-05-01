/**
 * Rate limiting par IP (store partagé : mémoire en Edge ; Redis possible en Node via injection).
 */

import { getActiveRateLimitStore } from "./rate-limit-store";

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // par fenêtre

function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return (forwarded?.split(",")[0]?.trim() || realIp || "unknown").slice(0, 64);
}

export async function isRateLimited(request: Request): Promise<boolean> {
  const id = getClientId(request);
  const store = getActiveRateLimitStore();
  const { limited } = await store.increment(id, WINDOW_MS, MAX_REQUESTS);
  return limited;
}
