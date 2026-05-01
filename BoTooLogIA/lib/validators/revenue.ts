import { z } from "zod";

/**
 * Prêt pour V2.4 (POST/PATCH revenues). Aucune route POST revenue admin pour l’instant.
 */
export const createRevenueSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/).or(z.number()),
  currency: z.string().length(3).default("EUR"),
  periodType: z.string().min(1).max(64),
  periodValue: z.string().max(64).optional().nullable(),
  label: z.string().max(5000).optional().nullable(),
  clientName: z.string().max(255).optional().nullable(),
  clientEmail: z.string().email().optional().nullable().or(z.literal("")),
  serviceType: z.string().max(255).optional().nullable(),
  status: z.string().max(64).optional(),
  notes: z.string().max(10000).optional().nullable(),
});

export const updateRevenueSchema = createRevenueSchema.partial().strict();

export type CreateRevenueInput = z.infer<typeof createRevenueSchema>;
