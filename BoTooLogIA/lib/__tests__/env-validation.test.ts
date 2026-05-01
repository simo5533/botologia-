import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { validateEnvOrThrow } from "@/lib/env-validation";

describe("env-validation", () => {
  const saved = { ...process.env };

  beforeEach(() => {
    vi.unstubAllEnvs();
    Object.assign(process.env, saved);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    Object.assign(process.env, saved);
  });

  it("skips when NODE_ENV is test", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("DATABASE_URL", "");
    expect(() => validateEnvOrThrow()).not.toThrow();
  });

  it("skips when SKIP_ENV_VALIDATION=1", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SKIP_ENV_VALIDATION", "1");
    vi.stubEnv("DATABASE_URL", "");
    expect(() => validateEnvOrThrow()).not.toThrow();
  });

  it("throws when production-like env missing DATABASE_URL", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SKIP_ENV_VALIDATION", "");
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("NEXTAUTH_SECRET", "x".repeat(32));
    vi.stubEnv("JWT_SECRET", "y".repeat(32));
    expect(() => validateEnvOrThrow()).toThrow(/DATABASE_URL/);
  });

  it("throws when secrets too short", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SKIP_ENV_VALIDATION", "");
    vi.stubEnv("DATABASE_URL", "postgresql://a:b@localhost:5432/db");
    vi.stubEnv("NEXTAUTH_SECRET", "short");
    vi.stubEnv("JWT_SECRET", "x".repeat(32));
    expect(() => validateEnvOrThrow()).toThrow(/NEXTAUTH_SECRET/);
  });
});
