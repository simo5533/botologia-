/**
 * Stockage partagé pour le rate limiting (compteur + fenêtre glissante).
 * En middleware Next.js (Edge), seul le store mémoire est utilisé : ioredis n’est pas compatible Edge.
 * {@link RedisRateLimitStore} sert aux tests, aux workers Node, ou si le middleware tourne en runtime Node.
 */

export interface RateLimitStore {
  /** Lit l’entrée courante sans incrémenter. */
  get(key: string): Promise<{ count: number; resetAt: number } | undefined>;
  /** Incrémente le compteur pour la clé ; renvoie le nouvel état et si la limite est dépassée. */
  increment(key: string, windowMs: number, max: number): Promise<{ count: number; resetAt: number; limited: boolean }>;
  /** Fixe une expiration (Redis EXPIRE / PEXPIRE) ; no-op en mémoire. */
  expire(key: string, ttlMs: number): Promise<void>;
}

export class MemoryRateLimitStore implements RateLimitStore {
  private readonly map = new Map<string, { count: number; resetAt: number }>();

  async get(key: string): Promise<{ count: number; resetAt: number } | undefined> {
    const entry = this.map.get(key);
    const now = Date.now();
    if (!entry || now >= entry.resetAt) return undefined;
    return { count: entry.count, resetAt: entry.resetAt };
  }

  async increment(
    key: string,
    windowMs: number,
    max: number
  ): Promise<{ count: number; resetAt: number; limited: boolean }> {
    const now = Date.now();
    let entry = this.map.get(key);
    if (!entry || now >= entry.resetAt) {
      entry = { count: 1, resetAt: now + windowMs };
      this.map.set(key, entry);
      return { count: 1, resetAt: entry.resetAt, limited: false };
    }
    entry.count += 1;
    this.map.set(key, entry);
    return {
      count: entry.count,
      resetAt: entry.resetAt,
      limited: entry.count > max,
    };
  }

  async expire(_key: string, _ttlMs: number): Promise<void> {
    /* Fenêtre déjà portée par resetAt en mémoire */
  }

  /** Tests : réinitialise les compteurs (singleton mémoire partagé entre specs). */
  clearAllForTests(): void {
    this.map.clear();
  }
}

const globalMemory = new MemoryRateLimitStore();

/**
 * Store par défaut pour le middleware (Edge-safe).
 */
export function getDefaultRateLimitStore(): RateLimitStore {
  return globalMemory;
}

let injectedStore: RateLimitStore | null = null;

/** Injection pour tests ou runtime Node personnalisé. */
export function setRateLimitStoreForTests(store: RateLimitStore | null): void {
  injectedStore = store;
}

export function getActiveRateLimitStore(): RateLimitStore {
  return injectedStore ?? globalMemory;
}

export function resetMemoryRateLimitStoreForTests(): void {
  globalMemory.clearAllForTests();
  injectedStore = null;
}
