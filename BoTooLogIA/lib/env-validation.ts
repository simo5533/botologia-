/**
 * Validation des variables d'environnement critiques au démarrage (instrumentation Next.js).
 * Ne pas importer depuis le Edge Runtime.
 */

import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL requis"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET doit faire au moins 32 caractères"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET doit faire au moins 32 caractères"),
  /** Rate limiting distribué (Node / workers) — optionnel ; le middleware Edge reste en mémoire sans client HTTP Redis. */
  REDIS_URL: z.string().min(1).optional(),
});

export type ValidatedServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Lance une erreur si l'environnement serveur est invalide.
 * Ignoré en test Vitest (NODE_ENV=test) ou si SKIP_ENV_VALIDATION=1.
 */
export function validateEnvOrThrow(): void {
  if (process.env.NODE_ENV === "test") return;
  if (process.env.SKIP_ENV_VALIDATION === "1") return;
  const result = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL?.trim() || undefined,
  });
  if (!result.success) {
    const msg = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    throw new Error(`Configuration environnement invalide — ${msg}`);
  }
}
