import { NextRequest, NextResponse } from "next/server";
import { requireBossSession } from "@/lib/api/auth-guard";
import { runFullMaintenance } from "@/lib/db/maintenance";
import { respondApiCatch } from "@/lib/db-error-handler";
import { apiValidationFailed422 } from "@/lib/api/response";
import { maintenancePostBodySchema } from "@/lib/validators/admin";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = await requireBossSession(req);
  if (!auth.allowed) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  const raw = await readMutationJson(req);
  const parsed = maintenancePostBodySchema.safeParse(raw);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }

  try {
    const results = await runFullMaintenance();
    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/admin/maintenance");
  }
}
