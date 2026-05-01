import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiUnauthorized } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { requireAdminSession } from "@/lib/api/auth-guard";

/**
 * GET /api/admin/stats — Statistiques agrégées pour le dashboard admin (données DB réelles).
 * Protégé par session admin/boss.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) return apiUnauthorized("Session admin requise");

  try {
    const now = new Date();
    const d30 = new Date(now.getTime() - 30 * 86400000);
    const d7 = new Date(now.getTime() - 7 * 86400000);
    const d1 = new Date(now.getTime() - 86400000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      usersCount,
      sessionsCount,
      auditLogsCount,
      totalContacts,
      newContacts7d,
      totalProspects,
      prospectsByStatus,
      totalRevenueSum,
      revenueThisMonthSum,
      totalVisitors30d,
      totalVisitors7d,
      totalVisitors1d,
      topPagesRows,
      recentContacts,
      recentActivities,
      notificationsUnread,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.session.count(),
      prisma.auditLog.count(),
      prisma.contact.count(),
      prisma.contact.count({ where: { createdAt: { gte: d7 } } }),
      prisma.prospect.count(),
      prisma.prospect.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.revenue.aggregate({
        where: { status: "CONFIRME" },
        _sum: { amount: true },
      }),
      prisma.revenue.aggregate({
        where: {
          status: "CONFIRME",
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.pageView.count({ where: { createdAt: { gte: d30 } } }),
      prisma.pageView.count({ where: { createdAt: { gte: d7 } } }),
      prisma.pageView.count({ where: { createdAt: { gte: d1 } } }),
      prisma.pageView.groupBy({
        by: ["page"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 8,
      }),
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          name: true,
          email: true,
          societe: true,
          services: true,
          budget: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          prospect: {
            select: { nom: true, societe: true },
          },
        },
      }),
      prisma.notification.count({ where: { isRead: false } }),
    ]);

    const prospectMap: Record<string, number> = {};
    for (const p of prospectsByStatus) {
      prospectMap[p.status] = p._count.id;
    }

    const topPages = topPagesRows.map((r) => ({
      page: r.page,
      count: r._count.id,
    }));

    const conversionRate =
      totalVisitors30d > 0
        ? ((totalContacts / totalVisitors30d) * 100).toFixed(1)
        : "0";

    return apiSuccess({
      users: usersCount,
      sessions: sessionsCount,
      auditLogs: auditLogsCount,
      visitors: {
        total30d: totalVisitors30d,
        total7d: totalVisitors7d,
        total1d: totalVisitors1d,
      },
      contacts: {
        total: totalContacts,
        new7d: newContacts7d,
        recent: recentContacts,
      },
      prospects: {
        total: totalProspects,
        byStatus: prospectMap,
      },
      revenue: {
        total: Number(totalRevenueSum._sum.amount ?? 0),
        thisMonth: Number(revenueThisMonthSum._sum.amount ?? 0),
      },
      conversion: conversionRate,
      topPages,
      recentActivities,
      notifications: notificationsUnread,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/admin/stats");
  }
}
