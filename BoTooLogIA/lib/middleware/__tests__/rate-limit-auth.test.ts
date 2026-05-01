import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  checkLoginRateLimited,
  checkGlobalApiRateLimited,
  checkVerify2faRateLimited,
  checkContactPostRateLimited,
  checkAuthMiscRateLimited,
} from "@/lib/middleware/rate-limit-policies";
import { resetMemoryRateLimitStoreForTests } from "@/lib/middleware/rate-limit-store";

describe("rate-limit login (politique OWASP F7)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T12:00:00.000Z"));
    resetMemoryRateLimitStoreForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetMemoryRateLimitStoreForTests();
  });

  it("autorise jusqu’à 10 requêtes dans la fenêtre 15 min", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      headers: { "x-forwarded-for": "10.0.0.42" },
    });
    for (let i = 0; i < 10; i += 1) {
      expect(await checkLoginRateLimited(req)).toBe(false);
    }
  });

  it("bloque à la 11e requête pour la même IP", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      headers: { "x-forwarded-for": "10.0.0.99" },
    });
    for (let i = 0; i < 10; i += 1) {
      expect(await checkLoginRateLimited(req)).toBe(false);
    }
    expect(await checkLoginRateLimited(req)).toBe(true);
  });

  it("réinitialise après expiration de la fenêtre", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      headers: { "x-forwarded-for": "10.0.0.77" },
    });
    for (let i = 0; i < 10; i += 1) {
      expect(await checkLoginRateLimited(req)).toBe(false);
    }
    expect(await checkLoginRateLimited(req)).toBe(true);
    vi.advanceTimersByTime(15 * 60 * 1000 + 1);
    expect(await checkLoginRateLimited(req)).toBe(false);
  });
});

describe("rate-limit-policies (autres plafonds)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-01T10:00:00.000Z"));
    resetMemoryRateLimitStoreForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetMemoryRateLimitStoreForTests();
  });

  it("API globale : 100 requêtes / min puis blocage", async () => {
    const req = new Request("http://localhost/api/x", {
      headers: { "x-forwarded-for": "192.168.1.1" },
    });
    for (let i = 0; i < 100; i += 1) {
      expect(await checkGlobalApiRateLimited(req)).toBe(false);
    }
    expect(await checkGlobalApiRateLimited(req)).toBe(true);
  });

  it("verify-2fa : 5 / 15 min", async () => {
    const req = new Request("http://localhost/api/auth/verify-2fa", {
      headers: { "x-forwarded-for": "192.168.1.2" },
    });
    for (let i = 0; i < 5; i += 1) {
      expect(await checkVerify2faRateLimited(req)).toBe(false);
    }
    expect(await checkVerify2faRateLimited(req)).toBe(true);
  });

  it("contact POST : 3 / heure", async () => {
    const req = new Request("http://localhost/api/contact", {
      headers: { "x-forwarded-for": "192.168.1.3" },
    });
    for (let i = 0; i < 3; i += 1) {
      expect(await checkContactPostRateLimited(req)).toBe(false);
    }
    expect(await checkContactPostRateLimited(req)).toBe(true);
  });

  it("auth misc : 60 / min", async () => {
    const req = new Request("http://localhost/api/auth/session", {
      headers: { "x-forwarded-for": "192.168.1.4" },
    });
    for (let i = 0; i < 60; i += 1) {
      expect(await checkAuthMiscRateLimited(req)).toBe(false);
    }
    expect(await checkAuthMiscRateLimited(req)).toBe(true);
  });
});
