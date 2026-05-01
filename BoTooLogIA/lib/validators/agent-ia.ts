import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.string().min(1).max(32),
  content: z.string().min(1).max(100_000),
});

export const agentIaPostSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
});

export type AgentIaPostInput = z.infer<typeof agentIaPostSchema>;
