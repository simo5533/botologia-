import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import * as session from "@/lib/auth/session";
import * as pending2fa from "@/lib/auth/pending-2fa";
import { createAuditLog } from "@/lib/db/audit";
import { loginSchema } from "@/lib/validators/auth";
import { readMutationJson } from "@/lib/validators/parse-body";
import { apiValidationFailed422, apiUnauthorized } from "@/lib/api/response";
import { validateNextAuthSecret } from "@/lib/auth/validate-secret";
import { respondApiCatch } from "@/lib/db-error-handler";

export const dynamic = "force-dynamic";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 min

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

function getUserAgent(request: NextRequest): string | null {
  return request.headers.get("user-agent")?.slice(0, 512) ?? null;
}

/**
 * POST /api/auth/login — Connexion email + mot de passe, crée une session (cookie).
 */
export async function POST(request: NextRequest) {
  validateNextAuthSecret();
  const body = await readMutationJson(request);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }
  const { email, password } = parsed.data;
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        passwordHash: true,
        role: true,
        status: true,
        lockedUntil: true,
        twoFactorSecret: true,
        twoFactorBackupCodes: true,
        failedLoginAttempts: true,
      },
    });

    if (!user) {
      await createAuditLog({
        action: "login.failure",
        resource: "auth",
        severity: "HIGH",
        details: { reason: "user_not_found", email: email.toLowerCase().trim() },
        ip,
        userAgent,
      }).catch(() => {});
      return apiUnauthorized("Email ou mot de passe incorrect");
    }
    if (!user.passwordHash) {
      await createAuditLog({
        action: "login.failure",
        resource: "auth",
        severity: "HIGH",
        userId: user.id,
        details: { reason: "no_password" },
        ip,
        userAgent,
      }).catch(() => {});
      return apiUnauthorized("Compte sans mot de passe. Contactez l’administrateur.");
    }
    if (user.status === "suspended" || user.status === "banned") {
      await createAuditLog({
        action: "login.failure",
        resource: "auth",
        severity: "HIGH",
        userId: user.id,
        details: { reason: "account_blocked", status: user.status },
        ip,
        userAgent,
      }).catch(() => {});
      return apiUnauthorized("Compte désactivé. Contactez l'administrateur.");
    }
    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      await createAuditLog({
        action: "login.failure",
        resource: "auth",
        severity: "MEDIUM",
        userId: user.id,
        details: { reason: "account_locked" },
        ip,
        userAgent,
      }).catch(() => {});
      return apiUnauthorized("Trop de tentatives. Réessayez plus tard.");
    }
    if (!verifyPassword(password, user.passwordHash)) {
      const newAttempts = (user.failedLoginAttempts ?? 0) + 1;
      const lockedUntil = newAttempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCK_DURATION_MS) : null;
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: newAttempts, lockedUntil },
      });
      await createAuditLog({
        action: "login.failure",
        resource: "auth",
        severity: "HIGH",
        userId: user.id,
        details: { reason: "invalid_password", attempts: newAttempts },
        ip,
        userAgent,
      }).catch(() => {});
      return apiUnauthorized("Email ou mot de passe incorrect");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });

    if (user.twoFactorSecret) {
      let pendingToken: string;
      try {
        pendingToken = pending2fa.createPending2faToken(user.id);
      } catch (error: unknown) {
        return respondApiCatch(error, "POST /api/auth/login");
      }
      await createAuditLog({
        action: "login.2fa_required",
        resource: "auth",
        severity: "MEDIUM",
        userId: user.id,
        details: { role: user.role },
        ip,
        userAgent,
      }).catch(() => {});

      return new Response(
        JSON.stringify({ success: true, data: { needs2FA: true } }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": pending2fa.getPending2faCookieHeader(pendingToken),
          },
        }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    const { token, expiresAt } = await session.createSession(user.id);
    await createAuditLog({
      action: "login.success",
      resource: "auth",
      severity: "MEDIUM",
      userId: user.id,
      details: { role: user.role },
      ip,
      userAgent,
    }).catch(() => {});
    const maxAge = session.getSessionMaxAge();
    const cookieHeader = session.sessionCookieHeader(token, maxAge);

    return new Response(
      JSON.stringify({
        success: true,
        data: { userId: user.id, role: user.role, expiresAt: expiresAt.toISOString() },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader,
        },
      }
    );
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/auth/login");
  }
}
