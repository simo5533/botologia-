import { z } from "zod";

export const botChatPostSchema = z
  .object({
    message: z.string().max(2000).optional(),
    content: z.string().max(2000).optional(),
    sessionId: z.string().max(128).optional(),
    session_id: z.string().max(128).optional(),
  })
  .strict()
  .refine((d) => (d.message?.trim().length ?? 0) > 0 || (d.content?.trim().length ?? 0) > 0, {
    message: "message ou content requis",
    path: ["message"],
  });

export type BotChatPostInput = z.infer<typeof botChatPostSchema>;
