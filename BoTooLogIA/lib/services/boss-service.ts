/**
 * Service BOSS — agrégations et statistiques pour le dashboard et les rapports.
 * Centralise les requêtes Prisma pour les routes /api/boss/*.
 * Utilise la table Contact pour les demandes de contact (performance) avec fallback AuditLog.
 */

import { prisma } from "@/lib/prisma";
import { getContactCount, getContactsPaginated } from "@/lib/db/contact";

const DEFAULT_CURRENCY = "EUR";

export type DashboardData = {
  users: { total: number; active: number; inactive: number; newThisMonth: number };
  sessions: number;
  auditLogs: number;
  contactRequests: number;
  revenue: { total: number; thisMonth: number; currency: string };
  timestamp: string;
};

export type StatisticsData = DashboardData & {
  usersByRole: { role: string; count: number }[];
  signupsByDay: { date: string; count: number }[];
  signupsByMonth: { month: string; count: number }[];
  activityByDay: { date: string; count: number }[];
};

export type UserAnalytics = {
  byRole: { role: string; count: number }[];
  total: number;
  newThisWeek: number;
  newThisMonth: number;
  createdAtDistribution: { period: string; count: number }[];
};

export type RevenueData = {
  total: number;
  byPeriod: { period: string; amount: number; currency: string }[];
  thisMonth: number;
  thisQuarter: number;
  thisYear: number;
  currency: string;
};

export type ReportPeriod = "monthly" | "quarterly" | "yearly";

export type ReportData = {
  period: ReportPeriod;
  label: string;
  from: string;
  to: string;
  users: { total: number; new: number };
  sessions: number;
  auditLogs: number;
  contactRequests: number;
  revenue: number;
  currency: string;
};

async function getRevenueSums(): Promise<{ total: number; byMonth: { period: string; amount: number }[] }> {
  const rows = await prisma.revenue.findMany({
    select: { amount: true, periodType: true, periodValue: true },
  });
  const total = rows.reduce((sum, r) => sum + Number(r.amount), 0);
  const byMonth = rows
    .filter((r) => r.periodType === "month" && r.periodValue != null)
    .map((r) => ({ period: r.periodValue as string, amount: Number(r.amount) }));
  return { total, byMonth };
}

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    usersCount,
    usersNewMonth,
    sessionsCount,
    auditLogsCount,
    contactCountFromContact,
    contactCountFromAudit,
    revenueSums,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.session.count({ where: { expiresAt: { gt: now } } }),
    prisma.auditLog.count(),
    getContactCount().catch(() => 0),
    prisma.auditLog.count({ where: { action: "contact.request" } }),
    getRevenueSums(),
  ]);
  const contactCount = contactCountFromContact > 0 ? contactCountFromContact : contactCountFromAudit;

  await prisma.session.count({ where: { expiresAt: { gt: now } } });
  const activeUsers = await prisma.user.count({
    where: { sessions: { some: { expiresAt: { gt: now } } } },
  });

  return {
    users: {
      total: usersCount,
      active: activeUsers,
      inactive: usersCount - activeUsers,
      newThisMonth: usersNewMonth,
    },
    sessions: sessionsCount,
    auditLogs: auditLogsCount,
    contactRequests: contactCount,
    revenue: {
      total: revenueSums.total,
      thisMonth: revenueSums.byMonth.find((m) => m.period === now.toISOString().slice(0, 7))?.amount ?? 0,
      currency: DEFAULT_CURRENCY,
    },
    timestamp: now.toISOString(),
  };
}

export async function getStatistics(): Promise<StatisticsData> {
  const dashboard = await getDashboardData();
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [usersByRole, signupsRaw, activityRaw] = await Promise.all([
    prisma.user.groupBy({ by: ["role"], _count: { id: true } }),
    prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.auditLog.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

  const signupsByDay = aggregateByDay(signupsRaw.map((u) => u.createdAt));
  const signupsByMonth = aggregateByMonth(signupsRaw.map((u) => u.createdAt));
  const activityByDay = aggregateByDay(activityRaw.map((a) => a.createdAt));

  return {
    ...dashboard,
    usersByRole: usersByRole.map((r) => ({ role: r.role, count: r._count.id })),
    signupsByDay,
    signupsByMonth,
    activityByDay,
  };
}

function aggregateByDay(dates: Date[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  dates.forEach((d) => {
    const key = d.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function aggregateByMonth(dates: Date[]): { month: string; count: number }[] {
  const map = new Map<string, number>();
  dates.forEach((d) => {
    const key = d.toISOString().slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export async function getUserAnalytics(): Promise<UserAnalytics> {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const [byRole, total, newThisWeek, newThisMonth, users] = await Promise.all([
    prisma.user.groupBy({ by: ["role"], _count: { id: true } }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.user.findMany({ select: { createdAt: true } }),
  ]);

  const byMonth = aggregateByMonth(users.map((u) => u.createdAt));
  const createdAtDistribution = byMonth.map((m) => ({ period: m.month, count: m.count }));

  return {
    byRole: byRole.map((r) => ({ role: r.role, count: r._count.id })),
    total,
    newThisWeek,
    newThisMonth,
    createdAtDistribution,
  };
}

export async function getRevenue(): Promise<RevenueData> {
  const rows = await prisma.revenue.findMany({
    orderBy: [{ periodType: "asc" }, { periodValue: "desc" }],
    take: 100,
  });
  const total = rows.reduce((sum, r) => sum + Number(r.amount), 0);
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);
  const thisQuarter = `${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`;
  const thisYear = String(now.getFullYear());

  const byPeriod = rows
    .filter((r) => r.periodValue != null)
    .map((r) => ({
      period: r.periodValue as string,
      amount: Number(r.amount),
      currency: r.currency,
    }));

  const monthRow = rows.find((r) => r.periodType === "month" && r.periodValue === thisMonth);
  const quarterRow = rows.find((r) => r.periodType === "quarter" && r.periodValue === thisQuarter);
  const yearRow = rows.find((r) => r.periodType === "year" && r.periodValue === thisYear);

  return {
    total,
    byPeriod,
    thisMonth: monthRow ? Number(monthRow.amount) : 0,
    thisQuarter: quarterRow ? Number(quarterRow.amount) : 0,
    thisYear: yearRow ? Number(yearRow.amount) : 0,
    currency: DEFAULT_CURRENCY,
  };
}

export async function getReport(period: ReportPeriod): Promise<ReportData> {
  const now = new Date();
  let from: Date;
  let label: string;

  switch (period) {
    case "monthly": {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      label = `Bilan mensuel ${from.toISOString().slice(0, 7)}`;
      break;
    }
    case "quarterly": {
      const q = Math.floor(now.getMonth() / 3) + 1;
      from = new Date(now.getFullYear(), (q - 1) * 3, 1);
      label = `Bilan trimestriel ${now.getFullYear()}-Q${q}`;
      break;
    }
    case "yearly": {
      from = new Date(now.getFullYear(), 0, 1);
      label = `Bilan annuel ${now.getFullYear()}`;
      break;
    }
    default:
      from = new Date(now.getFullYear(), 0, 1);
      label = `Bilan ${period}`;
  }

  const [contactCountInPeriod, contactCountFallback] = await Promise.all([
    getContactCount().then((total) => (total > 0 ? prisma.contact.count({ where: { createdAt: { gte: from } } }) : 0)),
    prisma.auditLog.count({ where: { action: "contact.request", createdAt: { gte: from } } }),
  ]);

  const [usersTotal, usersNew, sessions, auditLogs, revenueSums] = await Promise.all([
    prisma.user.count({ where: { createdAt: { lte: now } } }),
    prisma.user.count({ where: { createdAt: { gte: from } } }),
    prisma.session.count({ where: { createdAt: { gte: from } } }),
    prisma.auditLog.count({ where: { createdAt: { gte: from } } }),
    getRevenueSums(),
  ]);
  const contactRequests =
    contactCountInPeriod > 0 ? contactCountInPeriod : contactCountFallback;

  const periodKey = from.toISOString().slice(0, 7);
  const revenueInPeriod = revenueSums.byMonth
    .filter((m) => m.period >= periodKey)
    .reduce((s, m) => s + m.amount, 0);

  return {
    period,
    label,
    from: from.toISOString(),
    to: now.toISOString(),
    users: { total: usersTotal, new: usersNew },
    sessions,
    auditLogs,
    contactRequests,
    revenue: revenueInPeriod,
    currency: DEFAULT_CURRENCY,
  };
}

export type ExportType = "users" | "audit" | "contacts";

export async function getExportData(type: ExportType): Promise<{ headers: string[]; rows: (string | number)[][] }> {
  switch (type) {
    case "users": {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return {
        headers: ["id", "email", "name", "role", "createdAt"],
        rows: users.map((u) => [u.id, u.email, u.name ?? "", u.role, u.createdAt.toISOString()]),
      };
    }
    case "audit": {
      const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5000,
      });
      return {
        headers: ["id", "action", "userId", "resource", "details", "ip", "createdAt"],
        rows: logs.map((l) => [
          l.id,
          l.action,
          l.userId ?? "",
          l.resource ?? "",
          JSON.stringify(l.details ?? {}),
          l.ip ?? "",
          l.createdAt.toISOString(),
        ]),
      };
    }
    case "contacts": {
      const contactTotal = await getContactCount().catch(() => 0);
      if (contactTotal > 0) {
        const { items } = await getContactsPaginated({ limit: 5000 });
        const headers = ["id", "name", "email", "message", "status", "createdAt"];
        const rows = items.map((c) => [
          c.id,
          c.name,
          c.email,
          c.message,
          c.status,
          c.createdAt.toISOString(),
        ]);
        return { headers, rows };
      }
      const logs = await prisma.auditLog.findMany({
        where: { action: "contact.request" },
        orderBy: { createdAt: "desc" },
      });
      const headers = ["id", "name", "email", "message", "createdAt"];
      const rows = logs.map((l) => {
        const d = (l.details as { name?: string; email?: string; message?: string }) ?? {};
        return [l.id, d.name ?? "", d.email ?? "", d.message ?? "", l.createdAt.toISOString()];
      });
      return { headers, rows };
    }
    default:
      return { headers: [], rows: [] };
  }
}
