/**
 * Garantit l’admin E2E (sans 2FA) — idempotent.
 * Usage : npx tsx scripts/seed-e2e.ts
 */
import path from "path";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/auth/password";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@botoologia.local";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "admin123";

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL manquant");
    process.exit(1);
  }
  const adapter = new PrismaPg({ connectionString: url });
  const prisma = new PrismaClient({ adapter });
  const passwordHash = hashPassword(PASSWORD);

  await prisma.user.upsert({
    where: { email: EMAIL },
    create: {
      email: EMAIL,
      name: "Admin E2E",
      role: "admin",
      status: "active",
      passwordHash,
      twoFactorSecret: null,
    },
    update: {
      passwordHash,
      status: "active",
      twoFactorSecret: null,
    },
  });

  console.log("Seed E2E OK —", EMAIL);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
