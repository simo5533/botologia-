-- Anti-rejeu TOTP + compteur échecs 2FA
ALTER TABLE "User" ADD COLUMN "lastUsedTotpToken" TEXT;
ALTER TABLE "User" ADD COLUMN "lastUsedTotpAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "twoFaFailedAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "twoFaWindowStartedAt" TIMESTAMP(3);
