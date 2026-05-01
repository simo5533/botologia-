/**
 * Nom du cookie de session (sans dépendance à la BDD).
 * Utilisé par le middleware (Edge Runtime) qui ne peut pas charger Prisma/pg.
 */

export const SESSION_COOKIE_NAME = "session";

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}
