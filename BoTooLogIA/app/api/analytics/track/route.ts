import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { apiSuccess, apiValidationFailed422 } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { analyticsTrackPostSchema } from "@/lib/validators/analytics";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const raw = await readMutationJson(request);
    const parsed = analyticsTrackPostSchema.safeParse(
      typeof raw === "object" && raw !== null ? raw : {}
    );
    if (!parsed.success) {
      return apiValidationFailed422(parsed.error.flatten());
    }
    const { page, event, metadata, userId } = parsed.data;
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? "";

    const metadataValue: Prisma.InputJsonValue | undefined =
      metadata === undefined ? undefined : (metadata as Prisma.InputJsonValue);

    await prisma.analytics.create({
      data: {
        page,
        event,
        userId: userId ?? null,
        metadata: metadataValue,
        ip: String(ip).slice(0, 255),
        userAgent: userAgent.slice(0, 512),
      },
    });

    return apiSuccess({ ok: true });
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/analytics/track");
  }
}
