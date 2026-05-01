/**
 * Purge des sessions expirées — à appeler périodiquement (cron ou au démarrage) pour garder la table Session légère.
 */

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function purgeExpiredSessions(): Promise<number> {
  const now = new Date();
  const result = await prisma.session.deleteMany({
    where: { expiresAt: { lt: now } },
  });
  if (result.count > 0) {
    logger.info(`Sessions expirées supprimées: ${result.count}`, { route: "session.cleanup" });
  }
  return result.count;
}
