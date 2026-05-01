import { NextResponse } from "next/server";
import {
  testDbConnection,
  getDbStats,
  prisma,
} from "@/lib/prisma";
import { handleDbFailure } from "@/lib/db-error-handler";
import { logger } from "@/lib/logger";

/**
 * GET /api/health — Liveness : DB obligatoire pour 200 + status "ok".
 * Champs additionnels (stats, mémoire) sans données sensibles.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const startTotal = Date.now();
  const dbTest = await testDbConnection();

  const dbConnected = dbTest.ok;
  const dbLabel = dbConnected ? "connected" : "unreachable";

  let dbStats = { tables: [] as Array<{ name: string; rows: number }>, sizeKb: 0 };
  let counts = {
    users: 0,
    contacts: 0,
    prospects: 0,
    sessions: 0,
    analytics: 0,
    revenue: 0,
    notifications: 0,
  };

  if (dbTest.ok) {
    try {
      dbStats = await getDbStats();
      const [
        users,
        contacts,
        prospects,
        sessions,
        analytics,
        revenue,
        notifications,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.contact.count(),
        prisma.prospect.count(),
        prisma.session.count({ where: { isValid: true } }),
        prisma.analytics.count(),
        prisma.revenue.count(),
        prisma.notification.count({ where: { isRead: false } }),
      ]);
      counts = { users, contacts, prospects, sessions, analytics, revenue, notifications };
    } catch (error: unknown) {
      const db = handleDbFailure("GET /api/health", error);
      if (db) return db;
      logger.error("GET /api/health stats", error, { route: "GET /api/health" });
    }
  }

  const topLevelStatus = dbConnected ? "ok" : "degraded";
  const httpStatus = dbConnected ? 200 : 503;

  const body = {
    status: topLevelStatus,
    db: dbLabel,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.1.0",
    database: {
      latencyMs: dbTest.latencyMs,
      error: dbTest.error ?? null,
      tables: dbStats.tables.length,
      data: counts,
    },
    responseMs: Date.now() - startTotal,
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json(body, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-store, no-cache",
      "Content-Type": "application/json",
      "X-Health-Status": topLevelStatus,
    },
  });
}
