import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { updateContactStatus } from "@/lib/db/contact";
import { apiSuccess, apiUnauthorized, apiValidationError, apiValidationFailed422 } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { updateContactSchema } from "@/lib/validators/admin";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/contacts/[id] — Met à jour le statut d'une demande de contact (BoToLink).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  const { id } = await params;
  if (!id) return apiValidationError("ID manquant");

  const body = await readMutationJson(request);
  const parsed = updateContactSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }

  try {
    const updated = await updateContactStatus(id, parsed.data.status);
    if (!updated) return apiValidationError("Contact introuvable");
    return apiSuccess({ ok: true, status: parsed.data.status });
  } catch (error: unknown) {
    return respondApiCatch(error, "PATCH /api/admin/contacts/[id]");
  }
}
