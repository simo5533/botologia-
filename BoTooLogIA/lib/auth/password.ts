/**
 * Hash et vérification de mot de passe.
 * RÈGLE : bcrypt (bcryptjs, pur JS — fiable sur Vercel/serverless) saltRounds = 12 minimum.
 * Compatibilité : anciens hachages scrypt (format salt:hex) toujours supportés.
 */

import { scryptSync, timingSafeEqual } from "crypto";
import { hashSync, compareSync } from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 12;

const SALT_LEN = 16;
const KEY_LEN = 64;
const COST = 16384;

const MIN_PASSWORD_LENGTH = 6;

/** Format legacy scrypt : "salt:hex" */
function isLegacyScryptFormat(stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [salt, hex] = parts;
  return salt.length === SALT_LEN * 2 && /^[a-f0-9]+$/i.test(hex);
}

/** Vérifie si un hash est au format bcrypt ($2a$, $2b$, $2y$). */
export function isBcryptHash(hash: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(hash);
}

/** Indique si le hash doit être migré vers bcrypt (legacy scrypt). */
export function needsMigration(hash: string): boolean {
  return !isBcryptHash(hash);
}

export function hashPassword(plain: string): string {
  if (!plain || plain.length < MIN_PASSWORD_LENGTH) {
    throw new Error("Mot de passe trop court (6 caractères minimum)");
  }
  return hashSync(plain, BCRYPT_SALT_ROUNDS);
}

/** Alias synchrone pour le seed / scripts. */
export function hashPasswordSync(plain: string): string {
  return hashPassword(plain);
}

export function verifyPassword(plain: string, stored: string): boolean {
  if (!plain || !stored) return false;
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    return compareSync(plain, stored);
  }
  if (isLegacyScryptFormat(stored)) {
    const parts = stored.split(":");
    const [salt, hashHex] = parts;
    const derived = scryptSync(plain, salt, KEY_LEN, { N: COST });
    const hash = Buffer.from(hashHex, "hex");
    if (derived.length !== hash.length) return false;
    return timingSafeEqual(derived, hash);
  }
  return false;
}
