import { NextRequest } from "next/server";
import { requireBossSession } from "@/lib/api/auth-guard";
import { apiUnauthorized, apiValidationError } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { getExportData, type ExportType } from "@/lib/services/boss-service";
import { createAuditLog } from "@/lib/db/audit";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

function toCsv(headers: string[], rows: (string | number)[][]): string {
  const escape = (v: string | number) => {
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
}

const VALID_TYPES: ExportType[] = ["users", "audit", "contacts"];

/**
 * GET /api/boss/export/:type — Export CSV (exclusif BOSS). Query ?format=json pour JSON.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const auth = await requireBossSession(request);
  if (!auth.allowed) return apiUnauthorized("Accès réservé au BOSS");

  const type = (await params).type as ExportType;
  if (!VALID_TYPES.includes(type)) {
    return apiValidationError("Type invalide. Utilisez: users, audit, contacts");
  }

  try {
    const { headers, rows } = await getExportData(type);
    await createAuditLog({
      action: "boss.export",
      resource: "boss",
      details: { type },
      userId: auth.userId,
      ip: getClientIp(request),
    }).catch(() => {});

    const format = request.nextUrl.searchParams.get("format") || "csv";
    if (format === "json") {
      return (await import("@/lib/api/response")).apiSuccess({
        headers,
        rows,
      });
    }

    const csv = toCsv(headers, rows);
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="botoologia-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/boss/export/[type]");
  }
}
