import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { respondApiCatch } from "@/lib/db-error-handler";
import { apiValidationFailed422 } from "@/lib/api/response";
import { createProspectSchema } from "@/lib/validators/prospect";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const prospects = await prisma.prospect.findMany({
      where: {
        ...(status && status !== "ALL"
          ? { status: status as "NOUVEAU" | "CONTACTE" | "QUALIFIE" | "DEVIS_ENVOYE" | "NEGOCIATION" | "CLIENT" | "PERDU" }
          : {}),
        ...(search
          ? {
              OR: [
                { nom: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { societe: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        activities: { orderBy: { createdAt: "desc" }, take: 3 },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(prospects);
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/prospects");
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const raw = await readMutationJson(request);
  const parsed = createProspectSchema.safeParse(raw);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }
  const d = parsed.data;
  try {
    const prospect = await prisma.prospect.create({
      data: {
        nom: d.nom,
        email: d.email,
        societe: d.societe ?? null,
        telephone: d.telephone ?? null,
        poste: d.poste ?? null,
        services: d.services ?? [],
        budget: d.budget ?? null,
        delai: d.delai ?? null,
        description: d.description ?? null,
        status: d.status ?? "NOUVEAU",
        priority: d.priority ?? 0,
        score: d.score ?? 0,
        notes: d.notes ?? null,
        assignedTo: d.assignedTo ?? null,
        source: d.source ?? null,
        tags: Array.isArray(d.tags) ? d.tags : [],
        lastContact: d.lastContact ?? null,
        nextFollowUp: d.nextFollowUp ?? null,
        dealValue: d.dealValue ?? null,
        probability: d.probability ?? null,
        convertedAt: d.convertedAt ?? null,
      },
    });
    return NextResponse.json(prospect, { status: 201 });
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/prospects");
  }
}
