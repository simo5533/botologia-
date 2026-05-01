import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/db/audit";
import { apiSuccess, apiValidationError, apiValidationFailed422, apiUnauthorized, apiNotFound } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { updateUserSchema } from "@/lib/validators/admin";
import { cuidSchema } from "@/lib/validations/common";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

/**
 * PATCH /api/users/[id] — Mettre à jour un utilisateur (admin). Sauvegarde en base.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  const idResult = cuidSchema.safeParse((await params).id);
  if (!idResult.success) return apiValidationError("ID utilisateur invalide");

  const body = await readMutationJson(request);
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }

  const id = idResult.data;

  try {
    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return apiNotFound("Utilisateur introuvable");

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(parsed.data.email !== undefined && { email: parsed.data.email }),
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.role !== undefined && { role: parsed.data.role }),
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });
    await createAuditLog({
      action: "user.update",
      resource: `user:${id}`,
      userId: id,
      details: parsed.data,
      ip: getClientIp(request),
    });
    return apiSuccess(user);
  } catch (e: unknown) {
    const isUnique = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002";
    if (isUnique) return apiValidationError("Un utilisateur avec cet email existe déjà");
    return respondApiCatch(e, "PATCH /api/users/[id]");
  }
}

/**
 * DELETE /api/users/[id] — Supprimer un utilisateur (admin). Sauvegarde audit en base.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession(_request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  const idResult = cuidSchema.safeParse((await params).id);
  if (!idResult.success) return apiValidationError("ID utilisateur invalide");
  const id = idResult.data;

  try {
    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true } });
    if (!existing) return apiNotFound("Utilisateur introuvable");

    await prisma.user.delete({ where: { id } });
    await createAuditLog({
      action: "user.delete",
      resource: `user:${id}`,
      userId: id,
      details: { email: existing.email },
      ip: getClientIp(_request),
    });
    return apiSuccess({ ok: true });
  } catch (error: unknown) {
    return respondApiCatch(error, "DELETE /api/users/[id]");
  }
}
