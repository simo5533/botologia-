import { describe, it, expect, vi } from "vitest";
import {
  TOTP_VERIFY_WINDOW,
  isTotpReplay,
  timingSafeEqualTotpCode,
  nextTwoFaFailureState,
  isTwoFaLockoutActive,
  verifyTotp,
} from "@/lib/auth/two-factor";
import speakeasy from "speakeasy";

describe("two-factor security", () => {
  it("TOTP_VERIFY_WINDOW ne dépasse pas 1", () => {
    expect(TOTP_VERIFY_WINDOW).toBe(1);
  });

  it("verifyTotp appelle speakeasy avec window 1", () => {
    const verifySpy = vi.spyOn(speakeasy.totp, "verify");
    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    const token = speakeasy.totp({ secret, encoding: "base32" });
    verifyTotp(secret, token);
    expect(verifySpy).toHaveBeenCalledWith(expect.objectContaining({ window: 1 }));
    verifySpy.mockRestore();
  });

  it("rejeu : même code dans la fenêtre 30s → isTotpReplay true", () => {
    const now = new Date("2025-01-01T12:00:00.000Z");
    const lastAt = new Date(now.getTime() - 10_000);
    expect(isTotpReplay("123456", "123456", lastAt, now)).toBe(true);
  });

  it("timingSafeEqualTotpCode refuse des longueurs différentes", () => {
    expect(timingSafeEqualTotpCode("123456", "12345")).toBe(false);
  });

  it("après 5 échecs en fenêtre 15 min → lockout (6e requête bloquée)", () => {
    const now = new Date("2025-01-01T12:00:00.000Z");
    let attempts = 0;
    let windowStartedAt: Date | null = null;
    for (let i = 0; i < 5; i += 1) {
      const n = nextTwoFaFailureState(attempts, windowStartedAt, now);
      attempts = n.twoFaFailedAttempts;
      windowStartedAt = n.twoFaWindowStartedAt;
    }
    expect(isTwoFaLockoutActive(attempts, windowStartedAt, now)).toBe(true);
  });

  it("token TOTP expiré / fenêtre : verifyTotp retourne false pour mauvais code", () => {
    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    expect(
      speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token: "000000",
        window: TOTP_VERIFY_WINDOW,
      })
    ).toBe(false);
  });
});
