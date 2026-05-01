import { NextRequest } from "next/server";
import * as session from "@/lib/auth/session";
import { respondApiCatch } from "@/lib/db-error-handler";
import { createAuditLog } from "@/lib/db/audit";
import { apiValidationFailed422 } from "@/lib/api/response";
import { emptyJsonBodySchema } from "@/lib/validators/session";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

/**
 * POST /api/auth/logout — Invalide la session (cookie + BDD). Invalide aussi toutes les autres sessions de l'utilisateur.
 */
export async function POST(request: NextRequest) {
  const raw = await readMutationJson(request);
  const parsed = emptyJsonBodySchema.safeParse(raw);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }

  const token = request.cookies.get(session.getSessionCookieName())?.value;

  try {
    const userId = await session.getSessionUserId(token ?? undefined);
    if (userId) {
      await session.invalidateAllSessionsForUser(userId);
      await session.deleteSession(token ?? undefined);
      await createAuditLog({
        action: "auth.logout",
        resource: "session",
        userId,
        severity: "LOW",
        ip: getClientIp(request),
      }).catch(() => {});
    } else {
      await session.deleteSession(token ?? undefined);
    }

    const cookieHeader = `${session.getSessionCookieName()}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
    return new Response(JSON.stringify({ success: true, data: { ok: true } }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieHeader,
      },
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/auth/logout");
  }
}
