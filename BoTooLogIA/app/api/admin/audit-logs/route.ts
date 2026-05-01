import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/db/audit";
import { apiSuccess, apiValidationError, apiUnauthorized, apiValidationFailed422 } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { paginationSchema } from "@/lib/validations/common";
import { auditLogCreateSchema } from "@/lib/validators/admin";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

/**
 * GET /api/admin/audit-logs — Liste paginée des journaux d'audit (données en base).
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = paginationSchema.safeParse(searchParams);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).join("; ");
    return apiValidationError(msg || "Paramètres invalides");
  }
  const { page, limit } = parsed.data;
  const actionFilter = typeof searchParams.action === "string" && searchParams.action.trim() ? searchParams.action.trim() : undefined;
  const skip = (page - 1) * limit;

  try {
    const where = actionFilter ? { action: actionFilter } : {};
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.count({ where }),
    ]);
    return apiSuccess({
      items: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/admin/audit-logs");
  }
}

/**
 * POST /api/admin/audit-logs — Créer une entrée d'audit (admin). Sauvegarde en base.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  const body = await readMutationJson(request);
  const parsed = auditLogCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }

  try {
    await createAuditLog({
      ...parsed.data,
      ip: parsed.data.ip ?? getClientIp(request),
    });
    return apiSuccess({ ok: true }, 201);
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/admin/audit-logs");
  }
}
