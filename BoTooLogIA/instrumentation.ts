/**
 * Point d'entrée instrumentation Next.js — validation env au boot (runtime Node uniquement).
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { validateEnvOrThrow } = await import("@/lib/env-validation");
  validateEnvOrThrow();
}
