import { z } from "zod";

/** Schéma création utilisateur */
export const userCreateSchema = z.object({
  email: z.string().email("Email invalide"),
  name: z.string().max(255).optional(),
  role: z.enum(["user", "admin", "boss", "super_admin"]).default("user"),
});

/** Schéma mise à jour utilisateur (champs partiels) */
export const userUpdateSchema = z.object({
  email: z.string().email("Email invalide").optional(),
  name: z.string().max(255).nullable().optional(),
  role: z.enum(["user", "admin", "boss", "super_admin"]).optional(),
});

/** Schéma ID utilisateur (CUID) */
export const userIdSchema = z.string().cuid("ID utilisateur invalide");

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
