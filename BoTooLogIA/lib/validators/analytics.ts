import { z } from "zod";

export const analyticsTrackPostSchema = z.object({
  page: z.string().min(1).max(500).trim(),
  event: z.string().min(1).max(120).trim(),
  userId: z.string().cuid().optional().nullable(),
  metadata: z.record(z.unknown()).optional(),
});

export type AnalyticsTrackPostInput = z.infer<typeof analyticsTrackPostSchema>;
