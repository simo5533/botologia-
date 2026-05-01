import { z } from "zod";

/** Schéma demande de contact (BoToLink) — champs étendus optionnels */
export const contactSchema = z.object({
  name: z.string().min(1, "Nom requis").max(255),
  email: z.string().email("Email invalide"),
  message: z.string().max(15000).default(""),
  telephone: z.string().max(50).optional(),
  societe: z.string().max(255).optional(),
  poste: z.string().max(255).optional(),
  services: z.array(z.string()).default([]),
  budget: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  objectifs: z.string().max(2000).optional(),
  experience: z.string().max(2000).optional(),
  source: z.string().max(100).optional().default("formulaire"),
});

export type ContactInput = z.infer<typeof contactSchema>;
