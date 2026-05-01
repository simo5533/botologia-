/**
 * Configuration auth (JWT/session). À étendre avec votre logique de session.
 * Ne jamais exposer JWT_SECRET côté client.
 */

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET manquant ou trop court (min. 32 caractères)");
  }
  return secret;
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32);
}
