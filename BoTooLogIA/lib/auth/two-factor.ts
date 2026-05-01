/**
 * 2FA TOTP (Google Authenticator) : génération secret, vérification code, codes de secours.
 */

import speakeasy from "speakeasy";
import { createHash, timingSafeEqual } from "crypto";

/** Fenêtre TOTP stricte (demi-périodes autorisées de chaque côté). Ne pas dépasser 1. */
export const TOTP_VERIFY_WINDOW = 1 as const;

const BACKUP_CODE_LENGTH = 8;
const BACKUP_CODE_COUNT = 10;

function hashBackupCode(plain: string): string {
  return createHash("sha256").update(plain, "utf8").digest("hex");
}

/**
 * Génère un secret TOTP (base32) pour l'utilisateur.
 * À stocker en base (twoFactorSecret). Ne pas logger.
 */
export function generateTotpSecret(): string {
  const secret = speakeasy.generateSecret({ length: 32 });
  return secret.base32;
}

/**
 * Génère une URL otpauth pour afficher un QR code (Google Authenticator, etc.).
 */
export function getTotpAuthUrl(secret: string, email: string, issuer = "BoTooLogIA"): string {
  return speakeasy.otpauthURL({
    secret,
    label: email,
    encoding: "base32",
    issuer,
  });
}

/**
 * Vérifie un code TOTP à 6 chiffres.
 */
export function verifyTotp(secret: string, token: string): boolean {
  if (!secret || !token || token.length !== 6) return false;
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: TOTP_VERIFY_WINDOW,
  });
}

const REPLAY_WINDOW_MS = 30_000;
const TWO_FA_LOCKOUT_MS = 15 * 60 * 1000;
const TWO_FA_MAX_ATTEMPTS = 5;

/**
 * Comparaison temps constante pour codes TOTP 6 caractères.
 */
export function timingSafeEqualTotpCode(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Même code TOTP soumis deux fois dans la fenêtre de rejeu. */
export function isTotpReplay(
  code: string,
  lastToken: string | null,
  lastAt: Date | null,
  now: Date
): boolean {
  if (!lastToken || !lastAt || code.length !== 6) return false;
  if (!timingSafeEqualTotpCode(code, lastToken)) return false;
  return now.getTime() - lastAt.getTime() < REPLAY_WINDOW_MS;
}

/** Verrouillage après trop d’échecs 2FA sur une fenêtre de 15 minutes. */
export function isTwoFaLockoutActive(
  failedAttempts: number,
  windowStartedAt: Date | null,
  now: Date
): boolean {
  if (failedAttempts < TWO_FA_MAX_ATTEMPTS) return false;
  if (!windowStartedAt) return false;
  return now.getTime() - windowStartedAt.getTime() < TWO_FA_LOCKOUT_MS;
}

export function nextTwoFaFailureState(
  failedAttempts: number,
  windowStartedAt: Date | null,
  now: Date
): { twoFaFailedAttempts: number; twoFaWindowStartedAt: Date | null } {
  const inWindow =
    windowStartedAt !== null && now.getTime() - windowStartedAt.getTime() < TWO_FA_LOCKOUT_MS;
  const start = inWindow ? windowStartedAt : now;
  const nextCount = inWindow ? failedAttempts + 1 : 1;
  return { twoFaFailedAttempts: nextCount, twoFaWindowStartedAt: start };
}

export function resetTwoFaFailureState(): {
  twoFaFailedAttempts: number;
  twoFaWindowStartedAt: null;
} {
  return { twoFaFailedAttempts: 0, twoFaWindowStartedAt: null };
}

/**
 * Génère des codes de secours (à afficher une fois, puis hasher pour twoFactorBackupCodes).
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
    let code = "";
    for (let j = 0; j < BACKUP_CODE_LENGTH; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    codes.push(code);
  }
  return codes;
}

/**
 * Hash d'un code de secours pour stockage (tableau de strings hex).
 */
export function hashBackupCodeForStorage(plain: string): string {
  return hashBackupCode(plain);
}

/**
 * Vérifie un code de secours contre la liste des hash stockés.
 * Retourne l'index du code utilisé (pour le retirer ensuite si usage unique).
 */
export function verifyBackupCode(plain: string, hashedCodes: string[]): number {
  if (!plain || !Array.isArray(hashedCodes)) return -1;
  const hash = hashBackupCodeForStorage(plain);
  return hashedCodes.indexOf(hash);
}
