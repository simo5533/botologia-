/**
 * Helper pour logger sans exposer de données sensibles (password, token, secret, hash).
 * À utiliser dans les routes auth et partout où on log des objets utilisateur.
 */

import { logger } from "@/lib/logger";

const SENSITIVE_KEYS = ["password", "token", "secret", "hash", "passwordHash", "twoFactorSecret", "twoFactorBackupCodes"];

function stripSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const out = { ...obj };
  for (const key of SENSITIVE_KEYS) {
    if (key in out) delete out[key];
  }
  for (const key of Object.keys(out)) {
    const lower = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lower.includes(s))) delete out[key];
  }
  return out;
}

/**
 * Log un objet en supprimant les champs sensibles. À utiliser à la place de console.log(body) en auth.
 */
export function safeLog(data: Record<string, unknown>): void {
  logger.info("safeLog", stripSensitive(data));
}

/**
 * Retourne une copie de l'objet sans les champs sensibles (pour passer à logger.info, etc.).
 */
export function sanitizeForLog<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  return stripSensitive(data) as Record<string, unknown>;
}
