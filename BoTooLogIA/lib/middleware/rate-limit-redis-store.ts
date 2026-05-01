/**
 * Implémentation Redis (ioredis) pour rate limiting — runtime Node uniquement.
 * Ne pas importer depuis le middleware Edge.
 */

import Redis from "ioredis";
import type { RateLimitStore } from "./rate-limit-store";

export class RedisRateLimitStore implements RateLimitStore {
  private readonly redis: Redis;

  constructor(url: string) {
    this.redis = new Redis(url, { maxRetriesPerRequest: 2, enableReadyCheck: true });
  }

  async get(key: string): Promise<{ count: number; resetAt: number } | undefined> {
    const raw = await this.redis.get(key);
    if (raw == null) return undefined;
    const ttl = await this.redis.pttl(key);
    if (ttl <= 0) return undefined;
    const count = Number.parseInt(raw, 10);
    if (Number.isNaN(count)) return undefined;
    return { count, resetAt: Date.now() + ttl };
  }

  async increment(
    key: string,
    windowMs: number,
    max: number
  ): Promise<{ count: number; resetAt: number; limited: boolean }> {
    const n = await this.redis.incr(key);
    if (n === 1) {
      await this.redis.pexpire(key, windowMs);
    }
    const ttl = await this.redis.pttl(key);
    const resetAt = ttl > 0 ? Date.now() + ttl : Date.now() + windowMs;
    return { count: n, resetAt, limited: n > max };
  }

  async expire(key: string, ttlMs: number): Promise<void> {
    await this.redis.pexpire(key, ttlMs);
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}

export function createRedisRateLimitStore(url: string): RedisRateLimitStore {
  return new RedisRateLimitStore(url);
}
