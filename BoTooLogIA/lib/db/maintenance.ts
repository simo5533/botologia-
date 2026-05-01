import type { InputJsonValue } from "@prisma/client/runtime/client";
import { prisma } from "./prisma";

export async function cleanExpiredSessions(): Promise<{ deleted: number }> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const result = await prisma.session.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        {
          isValid: false,
          createdAt: { lt: sevenDaysAgo },
        },
      ],
    },
  });
  return { deleted: result.count };
}

export async function cleanOldAnalytics(): Promise<{ deleted: number }> {
  const limit = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const result = await prisma.analytics.deleteMany({
    where: { createdAt: { lt: limit } },
  });
  return { deleted: result.count };
}

export async function cleanOldPageViews(): Promise<{ deleted: number }> {
  const limit = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const result = await prisma.pageView.deleteMany({
    where: { createdAt: { lt: limit } },
  });
  return { deleted: result.count };
}

export async function cleanOldNotifications(): Promise<{ deleted: number }> {
  const limit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await prisma.notification.deleteMany({
    where: { isRead: true, createdAt: { lt: limit } },
  });
  return { deleted: result.count };
}

export async function runFullMaintenance(): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  try {
    results.sessions = (await cleanExpiredSessions()).deleted;
  } catch {
    results.sessions = -1;
  }
  try {
    results.analytics = (await cleanOldAnalytics()).deleted;
  } catch {
    results.analytics = -1;
  }
  try {
    results.pageViews = (await cleanOldPageViews()).deleted;
  } catch {
    results.pageViews = -1;
  }
  try {
    results.notifications = (await cleanOldNotifications()).deleted;
  } catch {
    results.notifications = -1;
  }
  try {
    await prisma.scheduledTask.upsert({
      where: { name: "cleanup_sessions" },
      update: {
        lastRunAt: new Date(),
        nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "ACTIVE",
        result: results as InputJsonValue,
      },
      create: {
        name: "cleanup_sessions",
        lastRunAt: new Date(),
        nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "ACTIVE",
        result: results as InputJsonValue,
      },
    });
  } catch {
    // ignore
  }
  return results;
}
