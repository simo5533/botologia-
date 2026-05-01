import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { apiSuccess, apiUnauthorized } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";

export const dynamic = "force-dynamic";

/** GET /api/admin/app-settings — Liste des paramètres app (admin/boss). */
export async function GET(_request: NextRequest) {
  const auth = await requireAdminSession(_request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  try {
    const items = await prisma.appSettings.findMany({
      orderBy: { key: "asc" },
    });
    return apiSuccess({
      items,
      total: items.length,
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/admin/app-settings");
  }
}
