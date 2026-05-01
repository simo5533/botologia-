import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(120, "Nom trop long").optional(),
  email: z.string().email("Email invalide").max(255).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    newPassword: z.string().min(8, "Minimum 8 caractères").max(128),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmNewPassword"],
  });

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
