import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Charger .env local sans écraser les variables déjà définies (Vercel / CI injectent DATABASE_URL).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath, override: false });
dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: false });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl?.trim()) {
  throw new Error(
    "DATABASE_URL manquant : créez un .env local ou ajoutez DATABASE_URL dans Vercel (Settings → Environment Variables) avec une URL PostgreSQL accessible depuis les builders (Neon, Supabase, etc.), sans localhost."
  );
}

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
