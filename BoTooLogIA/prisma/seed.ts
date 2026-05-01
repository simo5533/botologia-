/**
 * Seed des données de base — User admin (avec mot de passe) + entrées AuditLog.
 * Exécution : npm run db:seed ou npx prisma db seed
 */
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

// Résolution du .env depuis la racine projet (compatible ESM)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env");
console.log("📂 Chargement .env depuis :", envPath);
console.log("📄 Fichier existe :", fs.existsSync(envPath));

dotenv.config({ path: envPath });
const prodLocal = path.resolve(__dirname, "..", ".env.production.local");
if (process.env.PRISMA_SEED_PRODUCTION === "1" && fs.existsSync(prodLocal)) {
  dotenv.config({ path: prodLocal, override: true });
  console.log("📂 PRISMA_SEED_PRODUCTION=1 — fusion .env.production.local (DATABASE_URL prod)");
}

function redactDatabaseUrlForLog(raw: string): string {
  try {
    const u = new URL(raw.replace(/^["']+|["']+$/g, ""));
    if (u.password) u.password = "***";
    return u.toString();
  } catch {
    return "(url masquée)";
  }
}

// Nettoyage strict de l'URL
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL
    .trim()
    .replace(/^["']+|["']+$/g, "")  // supprime guillemets
    .replace(/\s+/g, "");             // supprime espaces internes
  console.log("🔗 DATABASE_URL chargée :", redactDatabaseUrlForLog(process.env.DATABASE_URL));
} else {
  console.error("❌ DATABASE_URL est undefined après chargement du .env !");
  process.exit(1);
}

import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/auth/password";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquant. Fichier .env attendu :", envPath);
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const DEFAULT_ADMIN_PASSWORD = "admin123";

/** Admins nominatifs (sans 2FA pour connexion email+mot de passe directe). */
const NAMED_ADMINS = [
  { email: "aomarlaasri@gmail.com", name: "Aomar", adminLevel: 1, password: "Aomar2fa!24" },
  { email: "elhassane@botoologia.local", name: "Elhassane", adminLevel: 2, password: "Elhassane2fa!24" },
  { email: "basma@botoologia.local", name: "Basma", adminLevel: 3, password: "Basma2fa!24" },
] as const;

async function main() {
  console.log("Seed en cours…");

  const adminEmail = "admin@botoologia.local";
  const bossEmail = "boss@botoologia.local";
  const passwordHash = hashPassword(DEFAULT_ADMIN_PASSWORD);

  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin BoTooLogIA",
        role: "admin",
        status: "active",
        passwordHash,
      },
    });
    console.log("Utilisateur admin créé:", admin.email, "(hash bcrypt)");
  } else {
    await prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash, status: "active" },
    });
    console.log("Utilisateur admin déjà présent, hash bcrypt mis à jour:", admin.email);
  }

  let boss = await prisma.user.findUnique({ where: { email: bossEmail } });
  if (!boss) {
    boss = await prisma.user.create({
      data: {
        email: bossEmail,
        name: "Boss BoTooLogIA",
        role: "boss",
        status: "active",
        passwordHash,
      },
    });
    console.log("Utilisateur BOSS créé:", boss.email, "(hash bcrypt)");
  } else {
    await prisma.user.update({
      where: { id: boss.id },
      data: { passwordHash, role: "boss", status: "active" },
    });
    console.log("Utilisateur BOSS déjà présent, hash bcrypt mis à jour:", boss.email);
  }

  for (const { email, name, adminLevel, password } of NAMED_ADMINS) {
    const hash = hashPassword(password);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email,
          name: `${name} (Admin niveau ${adminLevel})`,
          firstName: name,
          role: "admin",
          adminLevel,
          status: "active",
          passwordHash: hash,
          twoFactorSecret: null,
          twoFactorBackupCodes: Prisma.JsonNull,
        },
      });
      console.log("Admin créé:", email, "(niveau " + adminLevel + ")");
    } else {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: `${name} (Admin niveau ${adminLevel})`,
          firstName: name,
          role: "admin",
          adminLevel,
          status: "active",
          passwordHash: hash,
          twoFactorSecret: null,
          twoFactorBackupCodes: Prisma.JsonNull,
        },
      });
      console.log("Admin déjà présent, mis à jour (sans 2FA):", email);
    }
  }

  const count = await prisma.auditLog.count();
  if (count === 0) {
    await prisma.auditLog.createMany({
      data: [
        { action: "seed.init", resource: "audit", details: { message: "Données de base initialisées" } },
        { action: "system.start", resource: "app", details: { env: process.env.NODE_ENV || "development" } },
      ],
    });
    console.log("2 entrées d'audit créées.");
  } else {
    console.log("Journaux d'audit déjà présents:", count);
  }

  // BotConversation (si table existante)
  try {
    const bcCount = await prisma.botConversation.count();
    if (bcCount === 0) {
      await prisma.botConversation.createMany({
        data: [
          {
            sessionId: "demo-session-1",
            messages: [
              { role: "assistant", content: "Bonjour ! Je suis BOTO...", timestamp: new Date().toISOString() },
              { role: "user", content: "génération des rendez-vous", timestamp: new Date().toISOString() },
              { role: "assistant", content: "Excellente idée ! La génération automatique de RDV est notre spécialité...", timestamp: new Date().toISOString() },
            ],
            source: "/botohub",
            converted: true,
          },
          {
            sessionId: "demo-session-2",
            messages: [
              { role: "assistant", content: "Bonsoir !", timestamp: new Date().toISOString() },
              { role: "user", content: "quel est le prix d'un chatbot ?", timestamp: new Date().toISOString() },
            ],
            source: "/botolab",
            converted: false,
          },
        ],
        skipDuplicates: true,
      });
      console.log("BotConversations démo créées.");
    }
  } catch {
    // Table peut ne pas exister si migration non appliquée
  }

  // ScheduledTask (si table existante)
  try {
    await prisma.scheduledTask.createMany({
      data: [
        {
          name: "cleanup_sessions",
          status: "ACTIVE",
          lastRunAt: new Date(),
          nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          result: { deleted: 0 },
        },
        {
          name: "cleanup_analytics",
          status: "ACTIVE",
          nextRunAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          name: "send_followup_emails",
          status: "ACTIVE",
          nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      ],
      skipDuplicates: true,
    });
    console.log("ScheduledTasks créées (skip si déjà présentes).");
  } catch {
    // Table peut ne pas exister
  }

  // Notifications additionnelles (si table existante)
  try {
    await prisma.notification.createMany({
      data: [
        { title: "Migration BDD réussie", message: "Tables et index optimisés.", type: "SUCCESS", isRead: false },
        { title: "Nouveau prospect qualifié", message: "Pierre Lefebvre — 45 000€ — Signature prévue.", type: "SUCCESS", isRead: false, link: "/botoadmin/crm" },
        { title: "Analytics actifs", message: "Événements trackés, RGPD compliant.", type: "INFO", isRead: true },
        { title: "CI/CD configuré", message: "GitHub Actions actif — typecheck, lint, tests.", type: "SUCCESS", isRead: false },
      ],
      skipDuplicates: false,
    });
    console.log("Notifications additionnelles créées.");
  } catch {
    // Ignorer si erreur (ex. contraintes)
  }

  console.log("Seed terminé.");
}

main()
  .catch((e: unknown) => {
    const err = e as { code?: string; message?: string };
    const msg = err?.message ?? (e && typeof e === "object" && "message" in e ? String((e as { message: unknown }).message) : String(e));
    const code = err?.code ?? (msg.includes("P1001") ? "P1001" : msg.includes("P1000") ? "P1000" : "");
    if (code === "P1001" || msg.includes("Can't reach database server")) {
      console.error("");
      console.error("❌ Base de données injoignable (P1001). Le serveur PostgreSQL ne tourne pas.");
      console.error("");
      console.error("Démarrez la base avec l'une des commandes suivantes :");
      console.error("  • Standalone (port 5433) :  npm run db:up:standalone");
      console.error("  • Docker standard (5432) : npm run db:up");
      console.error("");
      console.error("Puis attendez quelques secondes et relancez :  npm run db:push  puis  npm run db:seed");
      console.error("");
    } else if (code === "P1000" || msg.includes("Authentication") || msg.includes("AuthenticationFailed")) {
      console.error("");
      console.error("Erreur d'authentification PostgreSQL (P1000).");
      console.error("Vérifiez que .env contient DATABASE_URL avec user/mot de passe corrects.");
      console.error("  Standalone : postgresql://postgres:postgres@127.0.0.1:5433/botoologia?schema=public");
      console.error("  Standard   : postgresql://botoologia:BotoLogIA2025@localhost:5432/botoologia?schema=public");
      console.error("");
    }
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
