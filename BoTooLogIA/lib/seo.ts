/**
 * Constantes SEO — URL canonique et textes hors fantaisistes (pas de chiffres inventés).
 * Priorité env : NEXT_PUBLIC_SITE_URL puis NEXT_PUBLIC_APP_URL (déjà utilisé ailleurs).
 */

/** Nom affiché sur le site (marque) */
export const SITE_NAME = "BoTooLogIA" as const;

/**
 * Fallback production documenté dans le projet (Vercel) — surchargez avec NEXT_PUBLIC_SITE_URL.
 */
const SITE_URL_FALLBACK = "https://botoologia.vercel.app";

function normalizeOrigin(url: string): string {
  try {
    const u = new URL(url.trim());
    return u.origin;
  } catch {
    return SITE_URL_FALLBACK;
  }
}

/** Origine absolue du site pour JSON-LD, canonical, Open Graph */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "";
  return raw ? normalizeOrigin(raw) : SITE_URL_FALLBACK;
}

/** Description par défaut — source unique : lib/seo/copy (JSON-LD, Open Graph, meta) */
export { ORGANIZATION_META_DESCRIPTION as defaultSiteDescription } from "@/lib/seo/copy";

/** Logo public réel présent dans /public (voir TODO si vous ajoutez un logo dédié 1200px+) */
export const SITE_LOGO_PATH = "/favicon.svg" as const;

export function absoluteUrl(path = ""): string {
  const origin = getSiteUrl().replace(/\/$/, "");
  if (!path || path === "") return `${origin}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}
