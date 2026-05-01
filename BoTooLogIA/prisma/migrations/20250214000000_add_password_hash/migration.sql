-- AlterTable: ajout du champ passwordHash au modèle User (pour login)
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
