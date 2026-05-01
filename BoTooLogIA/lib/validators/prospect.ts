import { z } from "zod";

export const prospectStatusSchema = z.enum([
  "NOUVEAU",
  "CONTACTE",
  "QUALIFIE",
  "DEVIS_ENVOYE",
  "NEGOCIATION",
  "CLIENT",
  "PERDU",
]);

/** Création prospect (admin) */
export const createProspectSchema = z
  .object({
    nom: z.string().min(1).max(255).trim(),
    email: z.string().email().max(255).toLowerCase(),
    societe: z.string().max(255).nullable().optional(),
    telephone: z.string().max(50).nullable().optional(),
    poste: z.string().max(255).nullable().optional(),
    services: z.array(z.string()).optional().default([]),
    budget: z.string().max(100).nullable().optional(),
    delai: z.string().max(100).nullable().optional(),
    description: z.string().max(10000).nullable().optional(),
    status: prospectStatusSchema.optional(),
    priority: z.number().int().min(0).max(9999).optional(),
    score: z.number().int().min(0).max(999999).optional(),
    notes: z.string().max(10000).nullable().optional(),
    assignedTo: z.string().max(128).nullable().optional(),
    source: z.string().max(100).nullable().optional(),
    tags: z.array(z.string()).optional(),
    lastContact: z.coerce.date().nullable().optional(),
    nextFollowUp: z.coerce.date().nullable().optional(),
    dealValue: z.number().nullable().optional(),
    probability: z.number().int().min(0).max(100).nullable().optional(),
    convertedAt: z.coerce.date().nullable().optional(),
  })
  .strict();

/** Mise à jour partielle — au moins un champ */
export const updateProspectSchema = z
  .object({
    nom: z.string().min(1).max(255).trim().optional(),
    societe: z.string().max(255).nullable().optional(),
    email: z.string().email().max(255).toLowerCase().optional(),
    telephone: z.string().max(50).nullable().optional(),
    poste: z.string().max(255).nullable().optional(),
    services: z.array(z.string()).optional(),
    budget: z.string().max(100).nullable().optional(),
    delai: z.string().max(100).nullable().optional(),
    description: z.string().max(10000).nullable().optional(),
    status: prospectStatusSchema.optional(),
    priority: z.number().int().min(0).max(9999).optional(),
    score: z.number().int().min(0).max(999999).optional(),
    notes: z.string().max(10000).nullable().optional(),
    assignedTo: z.string().max(128).nullable().optional(),
    source: z.string().max(100).nullable().optional(),
    tags: z.array(z.string()).optional(),
    lastContact: z.coerce.date().nullable().optional(),
    nextFollowUp: z.coerce.date().nullable().optional(),
    dealValue: z.number().nullable().optional(),
    probability: z.number().int().min(0).max(100).nullable().optional(),
    convertedAt: z.coerce.date().nullable().optional(),
  })
  .strict()
  .refine((d) => Object.keys(d).length > 0, { message: "Au moins un champ requis pour la mise à jour" });

/** Kanban / changement de colonne uniquement */
export const kanbanMoveSchema = z
  .object({
    status: prospectStatusSchema,
  })
  .strict();

export type CreateProspectInput = z.infer<typeof createProspectSchema>;
export type UpdateProspectInput = z.infer<typeof updateProspectSchema>;
