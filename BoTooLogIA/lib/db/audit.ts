import { PrismaClientKnownRequestError } from "@prisma/client-runtime-utils";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { AuditLogCreateInput } from "@/lib/validations/audit";

/** Placeholder auth-guard quand ADMIN_PROTECTION_ENABLED est off (dev) — pas de ligne User correspondante. */
function normalizeAuditUserId(userId: string | null | undefined): string | null {
  if (userId == null || userId === "" || userId === "bypass") return null;
  return userId;
}

/**
 * Crée une entrée dans AuditLog (traçabilité des actions admin). Sauvegarde en base.
 * Si userId ne correspond à aucun User (FK violation), on réessaie avec userId: null pour garder la trace.
 */
export async function createAuditLog(input: AuditLogCreateInput): Promise<void> {
  const data = {
    action: input.action,
    resource: input.resource ?? null,
    resourceId: input.resourceId ?? null,
    userId: normalizeAuditUserId(input.userId ?? null),
    severity: input.severity ?? "MEDIUM",
    details: input.details != null ? (input.details as Prisma.InputJsonValue) : undefined,
    ip: input.ip ?? null,
    userAgent: input.userAgent ?? null,
    success: input.success ?? true,
    duration: input.duration ?? undefined,
  };

  try {
    await prisma.auditLog.create({ data });
  } catch (e: unknown) {
    if (
      e instanceof PrismaClientKnownRequestError &&
      e.code === "P2003" &&
      data.userId != null
    ) {
      await prisma.auditLog.create({ data: { ...data, userId: null } });
    } else {
      throw e;
    }
  }
}
