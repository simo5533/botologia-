/**
 * Initialisation des 3 administrateurs avec 2FA (Aomar, Elhassane, Basma).
 * Génère mots de passe forts, secrets TOTP, codes de secours et QR pour Google Authenticator.
 * Exécution : npm run db:seed:admins
 *
 * IMPORTANT : Conservez la sortie console ou le fichier ADMIN_CREDENTIALS.txt en lieu sûr.
 * Supprimez ou ne commitez jamais ce fichier.
 */
import path from "path";
import dotenv from "dotenv";
import { hashPassword } from "../lib/auth/password";
import {
  generateTotpSecret,
  getTotpAuthUrl,
  generateBackupCodes,
  hashBackupCodeForStorage,
} from "../lib/auth/two-factor";

// Charger .env en premier (dossier projet puis cwd) pour que DATABASE_URL soit défini
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env");
dotenv.config({ path: envPath });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

let url = (process.env.DATABASE_URL ?? "").trim().replace(/^["']|["']$/g, "");
if (!url) {
  const cwdEnv = path.resolve(process.cwd(), ".env");
  if (cwdEnv !== envPath) dotenv.config({ path: cwdEnv });
  url = (process.env.DATABASE_URL ?? "").trim().replace(/^["']|["']$/g, "");
}
if (!url) {
  console.error("");
  console.error("DATABASE_URL manquant ou vide.");
  console.error("  - Fichier .env attendu :", envPath);
  console.error("  - Ou dans :", path.resolve(process.cwd(), ".env"));
  console.error("  - Standalone (port 5433) : DATABASE_URL=\"postgresql://postgres:postgres@127.0.0.1:5433/botoologia?schema=public\"");
  console.error("  - Standard (port 5432)  : DATABASE_URL=\"postgresql://botoologia:BotoLogIA2025@localhost:5432/botoologia?schema=public\"");
  console.error("");
  process.exit(1);
}

// Masquer le mot de passe dans les logs (pour diagnostic)
function maskUrl(u: string): string {
  try {
    const parsed = new URL(u.replace(/^postgresql:/, "http:"));
    const host = parsed.hostname + (parsed.port ? ":" + parsed.port : "");
    return `postgresql://***@${host}/${(parsed.pathname || "/").slice(1) || "?"}`;
  } catch {
    return "postgresql://***";
  }
}

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const ADMINS = [
  { email: "aomarlaasri@gmail.com", name: "Aomar", adminLevel: 1, password: "Aomar2fa!24" },
  { email: "elhassane@botoologia.local", name: "Elhassane", adminLevel: 2, password: "Elhassane2fa!24" },
  { email: "basma@botoologia.local", name: "Basma", adminLevel: 3, password: "Basma2fa!24" },
] as const;

async function main() {
  console.log("Initialisation des 3 administrateurs avec 2FA…");
  console.log("Connexion :", maskUrl(url), "\n");

  const lines: string[] = [];
  lines.push("=== BoTooLogIA — Identifiants administrateurs (2FA) ===");
  lines.push("Généré le : " + new Date().toISOString());
  lines.push("Mots de passe fixes (voir docs/CREDENTIALS.md). Conservez ce fichier en lieu sûr.\n");

  for (const { email, name, adminLevel, password } of ADMINS) {
    const secret = generateTotpSecret();
    const backupCodes = generateBackupCodes();
    const backupHashes = backupCodes.map(hashBackupCodeForStorage);
    const passwordHash = hashPassword(password);

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: `${name} (Admin niveau ${adminLevel})`,
        firstName: name,
        role: "admin",
        adminLevel,
        status: "active",
        passwordHash,
        twoFactorSecret: secret,
        twoFactorBackupCodes: backupHashes,
      },
      update: {
        name: `${name} (Admin niveau ${adminLevel})`,
        firstName: name,
        role: "admin",
        adminLevel,
        status: "active",
        passwordHash,
        twoFactorSecret: secret,
        twoFactorBackupCodes: backupHashes,
      },
    });

    const otpauthUrl = getTotpAuthUrl(secret, email, "BoTooLogIA");
    console.log(`✅ ${name} (niveau ${adminLevel}) — ${email}`);
    console.log(`   Mot de passe (à changer à la première connexion) : ${password}`);
    console.log(`   QR Code (Google Authenticator) : ${otpauthUrl}`);
    console.log(`   Codes de secours : ${backupCodes.join(", ")}\n`);

    lines.push(`--- ${name} (niveau ${adminLevel}) ---`);
    lines.push(`Email : ${email}`);
    lines.push(`Mot de passe : ${password}`);
    lines.push(`QR TOTP : ${otpauthUrl}`);
    lines.push(`Codes de secours : ${backupCodes.join(" ")}`);
    lines.push("");
  }

  const fs = await import("fs");
  const outPath = path.join(projectRoot, "ADMIN_CREDENTIALS.txt");
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`Identifiants écrits dans ${outPath} — supprimez ce fichier après sauvegarde sécurisée.`);
  console.log("\nPremière connexion : 1) Email + mot de passe  2) Scanner le QR dans Google Authenticator ou saisir un code de secours.");
}

main()
  .catch((e: unknown) => {
    const err = e as { code?: string; message?: string };
    if (err?.code === "P1000" || (typeof err?.message === "string" && err.message.includes("Authentication failed"))) {
      console.error("");
      console.error("Connexion refusée : identifiants PostgreSQL incorrects pour cette instance.");
      console.error("  - Si vous utilisez docker-compose.standalone.yml (port 5433), dans .env mettez :");
      console.error("    DATABASE_URL=\"postgresql://postgres:postgres@127.0.0.1:5433/botoologia?schema=public\"");
      console.error("  - Si vous utilisez docker-compose.yml (port 5432), dans .env mettez :");
      console.error("    DATABASE_URL=\"postgresql://botoologia:BotoLogIA2025@localhost:5432/botoologia?schema=public\"");
      console.error("");
    }
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
