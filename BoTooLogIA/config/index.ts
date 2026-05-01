/**
 * Configuration centralisée — BoTooLogIA
 * Lit les variables d'environnement (.env chargé par Next.js / dotenv).
 * Utiliser côté serveur uniquement pour les secrets (DATABASE_URL, JWT_SECRET).
 */

const env = process.env;

/** Nom de l'application */
export const APP_NAME = env.APP_NAME ?? "BoTooLogIA";

/** URL publique du site (côté client : utiliser NEXT_PUBLIC_APP_URL) */
export const APP_URL = env.NEXT_PUBLIC_APP_URL ?? env.APP_URL ?? "http://localhost:3000";

/** Port du serveur (Next.js gère via -p ou PORT) */
export const APP_PORT = env.PORT ? parseInt(env.PORT, 10) : 3000;

/** Environnement d'exécution */
export const NODE_ENV = env.NODE_ENV ?? "development";
export const isProduction = NODE_ENV === "production";
export const isDevelopment = NODE_ENV === "development";

// ——— Base de données (Prisma utilise DATABASE_URL) ———
/** URL de connexion PostgreSQL (utilisée par Prisma) */
export const DATABASE_URL = env.DATABASE_URL ?? "";

/** Host PostgreSQL (optionnel, pour logs — Prisma utilise DATABASE_URL) */
export const DB_HOST = env.DB_HOST ?? "localhost";

export const DB_PORT = env.DB_PORT ?? "5432";
export const DB_NAME = env.DB_NAME ?? env.POSTGRES_DB ?? "botoologia";
export const DB_USER = env.DB_USER ?? env.POSTGRES_USER ?? "botoologia";
export const DB_PASSWORD = env.DB_PASSWORD ?? env.POSTGRES_PASSWORD ?? "";

// ——— Auth / JWT ———
/** Secret pour signatures (sessions, 2FA, etc.) — min. 32 caractères en production */
export const JWT_SECRET = env.JWT_SECRET ?? "";

/** Durée de vie du token (ex: "7d"). Les sessions utilisent lib/auth/session. */
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN ?? "7d";

/** Protection des routes admin — active sauf si ADMIN_PROTECTION_ENABLED=false */
export const ADMIN_PROTECTION_ENABLED = env.ADMIN_PROTECTION_ENABLED !== "false";

export default {
  APP_NAME,
  APP_URL,
  APP_PORT,
  NODE_ENV,
  isProduction,
  isDevelopment,
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ADMIN_PROTECTION_ENABLED,
};
