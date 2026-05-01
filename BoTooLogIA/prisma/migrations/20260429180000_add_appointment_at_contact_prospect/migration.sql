-- Colonnes attendues par schema.prisma (BoToLink) mais absentes des migrations historiques.
-- Sans elles, prisma.contact.create(..., appointmentAt) échoue en SQL → 500 sur POST /api/contact.

ALTER TABLE "Contact" ADD COLUMN IF NOT EXISTS "appointmentAt" TIMESTAMP(3);

ALTER TABLE "Prospect" ADD COLUMN IF NOT EXISTS "appointmentAt" TIMESTAMP(3);
