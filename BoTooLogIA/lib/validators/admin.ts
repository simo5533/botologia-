import { z } from "zod";
import { userCreateSchema, userUpdateSchema } from "@/lib/validations/user";
import { auditLogCreateSchema } from "@/lib/validations/audit";

export const createUserSchema = userCreateSchema;
export const updateUserSchema = userUpdateSchema;
export { auditLogCreateSchema };

/** PATCH statut contact admin */
export const updateContactSchema = z
  .object({
    status: z.enum(["new", "read", "archived"]),
  })
  .strict();

/** POST maintenance boss — corps vide uniquement */
export const maintenancePostBodySchema = z.object({}).strict();

/** Mise à jour paramètre app (futur PATCH /api/admin/app-settings) */
export const updateSettingsSchema = z
  .object({
    key: z.string().min(1).max(128),
    value: z.string().max(100_000),
    description: z.string().max(500).optional(),
    isPublic: z.boolean().optional(),
  })
  .strict();

export type UpdateContactInput = z.infer<typeof updateContactSchema>;
