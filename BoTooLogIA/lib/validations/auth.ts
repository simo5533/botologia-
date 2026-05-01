import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const verify2faSchema = z.object({
  code: z.string().min(6, "Code à 6 chiffres").max(8),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Nom requis").max(120, "Nom trop long"),
    email: z.string().email("Email invalide").max(255),
    password: z.string().min(8, "Minimum 8 caractères").max(128),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type Verify2FAInput = z.infer<typeof verify2faSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
