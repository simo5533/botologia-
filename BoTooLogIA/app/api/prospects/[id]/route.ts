import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { respondApiCatch } from "@/lib/db-error-handler";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { apiValidationFailed422 } from "@/lib/api/response";
import { updateProspectSchema } from "@/lib/validators/prospect";
import { readMutationJson } from "@/lib/validators/parse-body";
import { cuidSchema } from "@/lib/validations/common";

export const dynamic = "force-dynamic";

function omitUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const idResult = cuidSchema.safeParse((await params).id);
  if (!idResult.success) {
    return apiValidationFailed422(idResult.error.flatten());
  }
  const id = idResult.data;

  const raw = await readMutationJson(request);
  const parsed = updateProspectSchema.safeParse(raw);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }

  try {
    const patch = omitUndefined(parsed.data as Record<string, unknown>);
    const prospect = await prisma.prospect.update({
      where: { id },
      data: { ...patch, updatedAt: new Date() },
    });
    return NextResponse.json(prospect);
  } catch (error: unknown) {
    return respondApiCatch(error, "PATCH /api/prospects/[id]");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.prospect.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    return respondApiCatch(error, "DELETE /api/prospects/[id]");
  }
}
