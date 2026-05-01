import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { paginationSchema } from "@/lib/validations/common";

export const dynamic = "force-dynamic";

/** GET /api/admin/analytics — Liste paginée des événements analytics (admin/boss). */
export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  const parsed = paginationSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return apiValidationError(parsed.error.errors.map((e) => e.message).join("; "));
  }
  const { page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  try {
    const [items, total] = await Promise.all([
      prisma.analytics.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.analytics.count(),
    ]);
    return apiSuccess({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/admin/analytics");
  }
}
