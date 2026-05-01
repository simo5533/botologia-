import { NextRequest } from "next/server";
import { requireBossSession } from "@/lib/api/auth-guard";

export const dynamic = "force-dynamic";
import { apiSuccess, apiUnauthorized } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { getRevenue } from "@/lib/services/boss-service";
import { createAuditLog } from "@/lib/db/audit";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

/**
 * GET /api/boss/revenue — Données de revenus (exclusif BOSS).
 */
export async function GET(request: NextRequest) {
  const auth = await requireBossSession(request);
  if (!auth.allowed) return apiUnauthorized("Accès réservé au BOSS");

  try {
    const data = await getRevenue();
    await createAuditLog({
      action: "boss.revenue.view",
      resource: "boss",
      userId: auth.userId,
      ip: getClientIp(request),
    }).catch(() => {});
    return apiSuccess(data);
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/boss/revenue");
  }
}
