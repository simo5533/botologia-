/**
 * Validation NEXTAUTH_SECRET au chargement (utilisé par les routes auth).
 * RÈGLE : 64 caractères minimum, jamais de valeur d'exemple.
 */

const MIN_SECRET_LENGTH = 64;
const EXAMPLE_PLACEHOLDERS = [
  "CHANGEZ_MOI",
  "REMPLACER_PAR",
  "your-secret",
  "replace-me",
];

function isPlaceholder(value: string): boolean {
  const upper = value.toUpperCase();
  return EXAMPLE_PLACEHOLDERS.some((p) => upper.includes(p));
}

/**
 * Vérifie NEXTAUTH_SECRET. Lance une Error si manquant, trop court ou placeholder.
 * À appeler au début des handlers qui utilisent la session (GET session, POST login, etc.).
 */
export function validateNextAuthSecret(): void {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || typeof secret !== "string") {
    throw new Error("❌ NEXTAUTH_SECRET manquant dans .env");
  }
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `❌ NEXTAUTH_SECRET trop court (${MIN_SECRET_LENGTH} caractères minimum, actuel: ${secret.length})`
    );
  }
  if (isPlaceholder(secret)) {
    throw new Error(
      "❌ NEXTAUTH_SECRET ne doit pas être une valeur d'exemple. Générez avec: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    );
  }
}
