import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  MemoryRateLimitStore,
  setRateLimitStoreForTests,
  resetMemoryRateLimitStoreForTests,
} from "@/lib/middleware/rate-limit-store";
import { isRateLimited } from "@/lib/middleware/rate-limit";

describe("MemoryRateLimitStore", () => {
  let store: MemoryRateLimitStore;

  beforeEach(() => {
    store = new MemoryRateLimitStore();
  });

  it("increment stays under max then marks limited", async () => {
    const window = 60_000;
    const max = 3;
    expect(await store.increment("k", window, max)).toMatchObject({ limited: false, count: 1 });
    expect(await store.increment("k", window, max)).toMatchObject({ limited: false, count: 2 });
    expect(await store.increment("k", window, max)).toMatchObject({ limited: false, count: 3 });
    expect(await store.increment("k", window, max)).toMatchObject({ limited: true, count: 4 });
  });

  it("get returns undefined after window elapsed", async () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    const storeLocal = new MemoryRateLimitStore();
    await storeLocal.increment("x", 1000, 10);
    vi.setSystemTime(now + 1001);
    expect(await storeLocal.get("x")).toBeUndefined();
    vi.useRealTimers();
  });
});

describe("isRateLimited with injected store", () => {
  afterEach(() => {
    resetMemoryRateLimitStoreForTests();
  });

  it("respects plafond via store injecté", async () => {
    const mock: Awaited<ReturnType<MemoryRateLimitStore["increment"]>> = {
      count: 101,
      resetAt: Date.now() + 60_000,
      limited: true,
    };
    const stub = {
      get: vi.fn(),
      increment: vi.fn().mockResolvedValue(mock),
      expire: vi.fn(),
    };
    setRateLimitStoreForTests(stub);
    const req = new Request("http://localhost/api/x", {
      headers: { "x-forwarded-for": "1.2.3.4" },
    });
    expect(await isRateLimited(req)).toBe(true);
    expect(stub.increment).toHaveBeenCalled();
  });
});
