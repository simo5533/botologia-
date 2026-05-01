import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import * as session from "@/lib/auth/session";
import * as pending2fa from "@/lib/auth/pending-2fa";
import {
  verifyTotp,
  verifyBackupCode,
  isTotpReplay,
  isTwoFaLockoutActive,
  nextTwoFaFailureState,
  resetTwoFaFailureState,
} from "@/lib/auth/two-factor";
import { createAuditLog } from "@/lib/db/audit";
import { verify2faSchema } from "@/lib/validators/auth";
import { readMutationJson } from "@/lib/validators/parse-body";
import {
  apiValidationFailed422,
  apiUnauthorized,
  apiRateLimited,
} from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

function getUserAgent(request: NextRequest): string | null {
  return request.headers.get("user-agent")?.slice(0, 512) ?? null;
}

const LOCKOUT_RETRY_AFTER_SEC = 15 * 60;

/**
 * POST /api/auth/verify-2fa — Étape 2 : vérification du code TOTP ou code de secours, crée la session.
 * Requiert le cookie pending2fa posé par POST /api/auth/login.
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get(pending2fa.getPending2faCookieName())?.value;
  const userId = token ? pending2fa.verifyPending2faToken(token) : null;
  if (!userId) {
    return apiUnauthorized("Session de vérification expirée. Reconnectez-vous.");
  }

  const body = await readMutationJson(request);
  const parsed = verify2faSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }
  const code = parsed.data.code.replace(/\s/g, "");
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);
  const now = new Date();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true,
        status: true,
        lastUsedTotpToken: true,
        lastUsedTotpAt: true,
        twoFaFailedAttempts: true,
        twoFaWindowStartedAt: true,
      },
    });

    if (!user || !user.twoFactorSecret) {
      await createAuditLog({
        action: "login.2fa_failure",
        resource: "auth",
        severity: "HIGH",
        userId: userId,
        details: { reason: "user_or_secret_missing" },
        ip,
        userAgent,
      }).catch(() => {});
      return apiUnauthorized("Session invalide. Reconnectez-vous.");
    }
    if (user.status === "suspended" || user.status === "banned") {
      return apiUnauthorized("Compte désactivé.");
    }

    if (
      isTwoFaLockoutActive(user.twoFaFailedAttempts, user.twoFaWindowStartedAt, now)
    ) {
      return apiRateLimited(LOCKOUT_RETRY_AFTER_SEC);
    }

    const validTotp = verifyTotp(user.twoFactorSecret, code);
    const backupCodes = Array.isArray(user.twoFactorBackupCodes)
      ? (user.twoFactorBackupCodes as string[])
      : [];
    const backupIndex = verifyBackupCode(code, backupCodes);

    if (validTotp && isTotpReplay(code, user.lastUsedTotpToken, user.lastUsedTotpAt, now)) {
      await createAuditLog({
        action: "login.2fa_failure",
        resource: "auth",
        severity: "HIGH",
        userId: user.id,
        details: { reason: "totp_replay" },
        ip,
        userAgent,
      }).catch(() => {});
      return apiUnauthorized("Code déjà utilisé. Attendez la prochaine fenêtre TOTP.");
    }

    if (!validTotp && backupIndex < 0) {
      const nextFail = nextTwoFaFailureState(
        user.twoFaFailedAttempts,
        user.twoFaWindowStartedAt,
        now
      );
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFaFailedAttempts: nextFail.twoFaFailedAttempts,
          twoFaWindowStartedAt: nextFail.twoFaWindowStartedAt,
        },
      });
      await createAuditLog({
        action: "login.2fa_failure",
        resource: "auth",
        severity: "HIGH",
        userId: user.id,
        details: { reason: "invalid_code", attempts: nextFail.twoFaFailedAttempts },
        ip,
        userAgent,
      }).catch(() => {});

      if (
        isTwoFaLockoutActive(
          nextFail.twoFaFailedAttempts,
          nextFail.twoFaWindowStartedAt,
          now
        )
      ) {
        return apiRateLimited(LOCKOUT_RETRY_AFTER_SEC);
      }
      return apiUnauthorized("Code incorrect.");
    }

    const cleared = resetTwoFaFailureState();

    if (backupIndex >= 0) {
      const newCodes = backupCodes.filter((_, i) => i !== backupIndex);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorBackupCodes: newCodes,
          twoFaFailedAttempts: cleared.twoFaFailedAttempts,
          twoFaWindowStartedAt: cleared.twoFaWindowStartedAt,
          lastLoginAt: new Date(),
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFaFailedAttempts: cleared.twoFaFailedAttempts,
          twoFaWindowStartedAt: cleared.twoFaWindowStartedAt,
          lastUsedTotpToken: code,
          lastUsedTotpAt: now,
          lastLoginAt: new Date(),
        },
      });
    }

    const { token: sessionToken, expiresAt } = await session.createSession(user.id);
    await createAuditLog({
      action: "login.success",
      resource: "auth",
      severity: "MEDIUM",
      userId: user.id,
      details: { role: user.role, method: backupIndex >= 0 ? "backup_code" : "totp" },
      ip,
      userAgent,
    }).catch(() => {});

    const maxAge = session.getSessionMaxAge();
    const sessionCookie = session.sessionCookieHeader(sessionToken, maxAge);
    const clearPending = pending2fa.clearPending2faCookieHeader();

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.append("Set-Cookie", sessionCookie);
    headers.append("Set-Cookie", clearPending);

    return new Response(
      JSON.stringify({
        success: true,
        data: { userId: user.id, role: user.role, expiresAt: expiresAt.toISOString() },
      }),
      { status: 200, headers }
    );
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/auth/verify-2fa");
  }
}
