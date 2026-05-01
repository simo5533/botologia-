import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import * as session from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { validateNextAuthSecret } from "@/lib/auth/validate-secret";
import { apiSuccess, apiUnauthorized, apiValidationFailed422, apiError } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { changePasswordSchema } from "@/lib/validators/profile";
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
 * POST /api/auth/change-password — Change le mot de passe de l'utilisateur connecté.
 */
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return apiUnauthorized("Connexion requise");

  const body = await readMutationJson(request);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });
    if (!user?.passwordHash) return apiError("Compte sans mot de passe. Contactez l'administrateur.");
    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return apiError("Mot de passe actuel incorrect.", 400);
    }

    const passwordHash = hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash, passwordChangedAt: new Date() },
    });
    return apiSuccess({ message: "Mot de passe mis à jour." });
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/auth/change-password");
  }
}
