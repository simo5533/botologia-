import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/auth-guard";
import { respondApiCatch } from "@/lib/db-error-handler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.allowed) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalEvents, recentEvents, demandesDevis, allRecent, topPagesResult, serviceClicksResult] =
      await Promise.all([
        prisma.analytics.count(),
        prisma.analytics.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        prisma.analytics.count({ where: { event: "devis_submitted" } }),
        prisma.analytics.findMany({
          where: { createdAt: { gte: thirtyDaysAgo } },
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.analytics.groupBy({
          by: ["page"],
          _count: { page: true },
          orderBy: { _count: { page: "desc" } },
          take: 5,
        }),
        prisma.analytics.findMany({
          where: { event: "service_click" },
          select: { metadata: true },
        }),
      ]);

    // Agrégation par jour pour le graphique
    const dayMap = new Map<string, number>();
    for (const a of allRecent) {
      const day = a.createdAt.toISOString().slice(0, 10);
      dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
    }
    const eventsByDay = Array.from(dayMap.entries())
      .map(([createdAt, count]) => ({ createdAt, _count: { id: count } }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    const topPages = topPagesResult.map((p) => ({
      page: p.page,
      _count: { page: p._count.page },
    }));

    // Service clicks : grouper par metadata (label de service)
    const serviceCounts = new Map<string, number>();
    for (const s of serviceClicksResult) {
      const key = typeof s.metadata === "object" && s.metadata && "service" in s.metadata
        ? String((s.metadata as { service?: string }).service ?? "autre")
        : "autre";
      serviceCounts.set(key, (serviceCounts.get(key) ?? 0) + 1);
    }
    const serviceClicks = Array.from(serviceCounts.entries()).map(([name, count]) => ({
      name,
      _count: { id: count },
    }));

    return NextResponse.json({
      totalEvents,
      recentEvents,
      demandesDevis,
      topPages,
      eventsByDay,
      serviceClicks,
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "GET /api/analytics/stats");
  }
}
