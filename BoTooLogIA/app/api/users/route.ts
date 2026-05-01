import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/db/audit";
import { apiSuccess, apiValidationError, apiValidationFailed422, apiUnauthorized } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { paginationSchema } from "@/lib/validations/common";
import { createUserSchema } from "@/lib/validators/admin";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

/**
 * GET /api/users — Liste paginée. Protégé par session admin sauf si ADMIN_PROTECTION_ENABLED=false.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  const parsed = paginationSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).join("; ");
    return apiValidationError(msg || "Paramètres invalides");
  }
  const { page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);
    return apiSuccess({
      items: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/users");
  }
}

/**
 * POST /api/users — Créer un utilisateur (admin). Données sauvegardées en base.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  const body = await readMutationJson(request);
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }
  const { email, name, role } = parsed.data;

  try {
    const user = await prisma.user.create({
      data: { email, name: name ?? null, role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    await createAuditLog({
      action: "user.create",
      resource: `user:${user.id}`,
      userId: user.id,
      details: { email: user.email, role: user.role },
      ip: getClientIp(request),
    });
    return apiSuccess(user, 201);
  } catch (e: unknown) {
    const isUnique = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002";
    if (isUnique) return apiValidationError("Un utilisateur avec cet email existe déjà");
    return respondApiCatch(e, "POST /api/users");
  }
}
