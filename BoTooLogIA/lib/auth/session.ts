/**
 * Gestion des sessions : token sécurisé, cookie, durée de vie.
 */

import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, getSessionCookieName } from "@/lib/auth/cookie-name";

export { getSessionCookieName };
const SESSION_DAYS = 7;
const TOKEN_BYTES = 32;

function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function getSessionMaxAge(): number {
  return SESSION_DAYS * 24 * 60 * 60;
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(TOKEN_BYTES).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + getSessionMaxAge() * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function getSessionUserId(token: string | undefined): Promise<string | null> {
  if (!token || token.length < 16) return null;
  const tokenHash = hashToken(token);
  const session = await prisma.session.findFirst({
    where: { tokenHash, expiresAt: { gt: new Date() }, isValid: true },
    select: { userId: true },
  });
  return session?.userId ?? null;
}

export async function deleteSession(token: string | undefined): Promise<void> {
  if (!token) return;
  const tokenHash = hashToken(token);
  await prisma.session.deleteMany({ where: { tokenHash } });
}

/** Invalide toutes les sessions d'un utilisateur (ex. logout partout). */
export async function invalidateAllSessionsForUser(userId: string): Promise<void> {
  await prisma.session.updateMany({
    where: { userId },
    data: { isValid: false },
  });
}

export function sessionCookieHeader(token: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
