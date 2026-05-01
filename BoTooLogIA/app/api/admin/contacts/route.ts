import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { apiSuccess, apiUnauthorized, apiValidationError } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { getContactsPaginated } from "@/lib/db/contact";
import { paginationSchema } from "@/lib/validations/common";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/contacts — Liste paginée des demandes de contact (table Contact).
 * Protégé par session admin/BOSS. Query : page, limit, status (new | read | archived).
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

  const status = typeof searchParams.status === "string" && ["new", "read", "archived"].includes(searchParams.status)
    ? searchParams.status as "new" | "read" | "archived"
    : undefined;
  const source = typeof searchParams.source === "string" ? searchParams.source : undefined;

  try {
    const data = await getContactsPaginated({
      page: parsed.data.page,
      limit: parsed.data.limit,
      status,
      ...(source !== undefined && { source }),
    });
    return apiSuccess(data);
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/admin/contacts");
  }
}
