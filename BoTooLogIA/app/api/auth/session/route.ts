import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import * as session from "@/lib/auth/session";
import { validateNextAuthSecret } from "@/lib/auth/validate-secret";
import { apiSuccess } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/session — Retourne l’utilisateur courant si session valide.
 * Sans session : 200 + { success: true, data: null } (pas 401, pour éviter erreur côté client).
 */
export async function GET(request: NextRequest) {
  try {
    validateNextAuthSecret();
  } catch {
    return apiSuccess(null);
  }

  let token: string | undefined;
  try {
    token = request.cookies.get(session.getSessionCookieName())?.value;
  } catch {
    return apiSuccess(null);
  }
  if (!token || token.length < 16) {
    return apiSuccess(null);
  }

  let userId: string | null = null;
  try {
    userId = await session.getSessionUserId(token);
  } catch {
    return apiSuccess(null);
  }
  if (!userId) {
    return apiSuccess(null);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) return apiSuccess(null);
    return apiSuccess(user);
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/auth/session");
  }
}
