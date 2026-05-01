import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]{7,20}$/, "Numéro de téléphone invalide")
  .optional()
  .or(z.literal(""));

/**
 * Contact public (BoToLink) — message ≥ 10 sauf payload JSON `type: "devis"`.
 */
export const createContactSchema = z
  .object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().max(255).toLowerCase(),
    message: z.string().max(15000),
    telephone: phoneSchema,
    societe: z.string().max(255).optional(),
    poste: z.string().max(255).optional(),
    services: z.array(z.string()).default([]),
    budget: z.string().max(100).optional(),
    timeline: z.string().max(100).optional(),
    description: z.string().max(5000).optional(),
    objectifs: z.string().max(2000).optional(),
    experience: z.string().max(2000).optional(),
    source: z.string().max(100).optional().default("formulaire"),
  })
  .superRefine((data, ctx) => {
    const m = data.message.trim();
    if (m.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Message requis", path: ["message"] });
      return;
    }
    try {
      const j = JSON.parse(m) as { type?: string };
      if (j?.type === "devis") return;
    } catch {
      /* message texte libre */
    }
    if (m.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Message trop court (10 caractères minimum, hors demande devis JSON)",
        path: ["message"],
      });
    }
  });

export type CreateContactInput = z.infer<typeof createContactSchema>;
