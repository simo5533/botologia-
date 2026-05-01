import { NextRequest } from "next/server";
import { requireBossSession } from "@/lib/api/auth-guard";
import { apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { getReport, type ReportPeriod } from "@/lib/services/boss-service";
import { createAuditLog } from "@/lib/db/audit";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

const VALID_PERIODS: ReportPeriod[] = ["monthly", "quarterly", "yearly"];

/**
 * GET /api/boss/reports/:period — Rapports par période (monthly | quarterly | yearly).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ period: string }> }
) {
  const auth = await requireBossSession(request);
  if (!auth.allowed) return apiUnauthorized("Accès réservé au BOSS");

  const period = (await params).period as ReportPeriod;
  if (!VALID_PERIODS.includes(period)) {
    return apiValidationError("Période invalide. Utilisez: monthly, quarterly, yearly");
  }

  try {
    const data = await getReport(period);
    await createAuditLog({
      action: "boss.report.view",
      resource: "boss",
      details: { period },
      userId: auth.userId,
      ip: getClientIp(request),
    }).catch(() => {});
    return apiSuccess(data);
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/boss/reports/[period]");
  }
}
