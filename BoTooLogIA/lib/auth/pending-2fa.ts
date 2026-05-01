/**
 * Token temporaire pour l'étape 2 du login (vérification 2FA).
 * Cookie signé HMAC, courte durée (5 min).
 */

import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "pending2fa";
const TTL_SEC = 5 * 60; // 5 minutes
const SEP = ".";

function getSecret(): string {
  const secret = process.env.PENDING_2FA_SECRET ?? process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("PENDING_2FA_SECRET ou JWT_SECRET (32+ caractères) requis pour 2FA");
  }
  return secret;
}

function sign(payload: string): string {
  const secret = getSecret();
  return createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
}

/**
 * Crée un token signé contenant userId et expiration.
 */
export function createPending2faToken(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const payload = `${userId}${SEP}${exp}`;
  const signature = sign(payload);
  return `${Buffer.from(payload, "utf8").toString("base64url")}${SEP}${signature}`;
}

/**
 * Vérifie le token et retourne le userId ou null.
 */
export function verifyPending2faToken(token: string): string | null {
  if (!token || !token.includes(SEP)) return null;
  const lastSep = token.lastIndexOf(SEP);
  const payloadB64 = token.slice(0, lastSep);
  const signature = token.slice(lastSep + 1);
  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const parts = payload.split(SEP);
  if (parts.length !== 2) return null;
  const [, expStr] = parts;
  const exp = parseInt(expStr, 10);
  if (Number.isNaN(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  const expectedSig = sign(payload);
  if (expectedSig.length !== signature.length || !timingSafeEqual(Buffer.from(expectedSig, "utf8"), Buffer.from(signature, "utf8"))) return null;
  return parts[0];
}

export function getPending2faCookieName(): string {
  return COOKIE_NAME;
}

export function getPending2faCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TTL_SEC}${secure}`;
}

export function clearPending2faCookieHeader(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}
