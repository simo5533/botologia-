import { z } from "zod";
import { loginSchema, verify2faSchema, registerSchema } from "@/lib/validations/auth";

export { loginSchema, verify2faSchema };

/** Alias spec backlog (inscription + base pour parcours 2FA ultérieur) */
export const register2FASchema = registerSchema;

export type LoginInput = z.infer<typeof loginSchema>;
export type Verify2FAInput = z.infer<typeof verify2faSchema>;
export type Register2FAInput = z.infer<typeof register2FASchema>;
