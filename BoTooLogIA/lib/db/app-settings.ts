/**
 * Paramètres applicatifs (table AppSettings) — get/set par clé.
 */
import { prisma } from "@/lib/prisma";

export async function getAppSetting(key: string): Promise<string | null> {
  const row = await prisma.appSettings.findUnique({
    where: { key },
    select: { value: true },
  });
  return row?.value ?? null;
}

export async function setAppSetting(key: string, value: string): Promise<void> {
  await prisma.appSettings.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function deleteAppSetting(key: string): Promise<void> {
  await prisma.appSettings.deleteMany({ where: { key } });
}
