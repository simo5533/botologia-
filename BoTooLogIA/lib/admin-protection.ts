/**
 * Règle unique pour /botoadmin, middleware et routes API admin.
 * Protection **activée par défaut** (développement et production).
 * Pour désactiver explicitement (tests locaux uniquement) : ADMIN_PROTECTION_ENABLED=false
 */
export function isAdminProtectionEnabled(): boolean {
  return process.env.ADMIN_PROTECTION_ENABLED !== "false";
}
