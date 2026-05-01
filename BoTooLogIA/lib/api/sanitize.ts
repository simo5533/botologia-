/**
 * Retire les champs sensibles avant exposition JSON (A02).
 */

export type UserLike = Record<string, unknown> & {
  passwordHash?: unknown;
  twoFactorSecret?: unknown;
  twoFactorBackupCodes?: unknown;
};

export function sanitizeUserForApi<T extends UserLike>(user: T): Omit<T, "passwordHash" | "twoFactorSecret" | "twoFactorBackupCodes"> {
  const { passwordHash: _p, twoFactorSecret: _t, twoFactorBackupCodes: _b, ...safe } = user;
  return safe;
}
