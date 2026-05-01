import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { register2FASchema } from "@/lib/validators/auth";
import { readMutationJson } from "@/lib/validators/parse-body";
import { apiSuccess, apiError, apiValidationFailed422 } from "@/lib/api/response";
import { createAuditLog } from "@/lib/db/audit";
import { respondApiCatch } from "@/lib/db-error-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/register — Inscription d'un nouvel utilisateur (rôle user).
 */
export async function POST(request: NextRequest) {
  const body = await readMutationJson(request);
  const parsed = register2FASchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }
  const { name, email, password } = parsed.data;
  const emailNorm = email.toLowerCase().trim();

  try {
    const existing = await prisma.user.findUnique({
      where: { email: emailNorm },
      select: { id: true },
    });
    if (existing) {
      return apiError("Un compte existe déjà avec cet email.", 409);
    }

    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: emailNorm,
        name: name.trim(),
        role: "user",
        status: "active",
        passwordHash,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    await createAuditLog({
      action: "register.success",
      resource: "auth",
      severity: "MEDIUM",
      userId: user.id,
      details: { email: user.email, role: user.role },
    }).catch(() => {});

    return apiSuccess(
      { userId: user.id, email: user.email, message: "Compte créé. Vous pouvez vous connecter." },
      201
    );
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/auth/register");
  }
}
