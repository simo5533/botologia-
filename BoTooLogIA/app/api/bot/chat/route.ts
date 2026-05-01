import { NextRequest, NextResponse } from "next/server";
import { getReply } from "@/lib/bot/knowledgeBase";
import { logger } from "@/lib/logger";
import { apiValidationFailed422 } from "@/lib/api/response";
import { botChatPostSchema } from "@/lib/validators/bot";
import { readMutationJson } from "@/lib/validators/parse-body";

export const dynamic = "force-dynamic";

const FALLBACK_MESSAGE =
  "BotoAssist est momentanément indisponible. Vous pouvez continuer sur la page /botolink pour contacter l’équipe.";

/**
 * POST /api/bot/chat — Réponse du bot (knowledge base locale).
 * Body: { message: string, sessionId?: string }
 * Jamais de 500 au client : toujours 200 avec message/reply.
 */
export async function POST(req: NextRequest) {
  try {
    const raw = await readMutationJson(req);
    const parsed = botChatPostSchema.safeParse(raw);
    if (!parsed.success) {
      return apiValidationFailed422(parsed.error.flatten());
    }
    const body = parsed.data;
    const message = (body.message ?? body.content ?? "").trim();
    const sessionId =
      body.sessionId ?? body.session_id ?? `session_${Date.now()}`;

    const reply = getReply(message);

    return NextResponse.json({
      success: true,
      message: reply,
      reply,
      sessionId,
      timestamp: new Date().toISOString(),
      data: { reply },
    });
  } catch (err: unknown) {
    logger.error("POST /api/bot/chat", err, { route: "POST /api/bot/chat" });
    return NextResponse.json(
      {
        success: false,
        message: FALLBACK_MESSAGE,
        reply: FALLBACK_MESSAGE,
        data: { reply: FALLBACK_MESSAGE },
      },
      { status: 200 }
    );
  }
}

/**
 * GET /api/bot/chat — Santé du bot
 */
export async function GET() {
    return NextResponse.json({
    status: "BotoAssist actif",
    version: "3.0.0",
    model: "knowledge-base-guide",
    timestamp: new Date().toISOString(),
  });
}
