import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import * as session from "@/lib/auth/session";
import { validateNextAuthSecret } from "@/lib/auth/validate-secret";
import { apiSuccess, apiUnauthorized, apiValidationError, apiValidationFailed422, apiError } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { profileUpdateSchema } from "@/lib/validators/profile";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

function getUserId(request: NextRequest): Promise<string | null> {
  try {
    validateNextAuthSecret();
  } catch {
    return Promise.resolve(null);
  }
  const token = request.cookies.get(session.getSessionCookieName())?.value;
  if (!token || token.length < 16) return Promise.resolve(null);
  return session.getSessionUserId(token);
}

/**
 * GET /api/auth/profile — Infos du profil (utilisateur connecté).
 */
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return apiUnauthorized("Connexion requise");

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, firstName: true, lastName: true, role: true, createdAt: true },
    });
    if (!user) return apiUnauthorized("Utilisateur introuvable");
    return apiSuccess(user);
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/auth/profile");
  }
}

/**
 * PATCH /api/auth/profile — Met à jour le profil (nom, email).
 */
export async function PATCH(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return apiUnauthorized("Connexion requise");

  const body = await readMutationJson(request);
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }

  const { name, email } = parsed.data;
  if (!name && !email) return apiValidationError("Aucune donnée à mettre à jour");

  try {
    const updateData: { name?: string; email?: string } = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) {
      const emailNorm = email.toLowerCase().trim();
      const existing = await prisma.user.findFirst({
        where: { email: emailNorm, NOT: { id: userId } },
        select: { id: true },
      });
      if (existing) return apiError("Un autre compte utilise déjà cet email.", 409);
      updateData.email = emailNorm;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, name: true, role: true },
    });
    return apiSuccess(user);
  } catch (error: unknown) {
    return respondApiCatch(error, "PATCH /api/auth/profile");
  }
}
