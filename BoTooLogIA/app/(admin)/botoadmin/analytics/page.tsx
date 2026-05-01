"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AnimatedCounter from "@/components/effects/AnimatedCounter";
import AILoader from "@/components/effects/AILoader";

const COLORS = ["#00c8ff", "#7b5cff", "#00e5a0", "#fbbf24", "#ff4d6d"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<{
    totalEvents?: number;
    recentEvents?: number;
    demandesDevis?: number;
    topPages?: { page: string; _count: { page: number } }[];
    eventsByDay?: { createdAt: string; _count: { id: number } }[];
    serviceClicks?: { name: string; _count: { id: number } }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <AILoader text="Chargement analytics" />
      </div>
    );
  }

  const kpis = [
    { label: "Événements totaux", value: stats?.totalEvents ?? 0, suffix: "", icon: "👁", color: "#00c8ff" },
    { label: "Cette semaine", value: stats?.recentEvents ?? 0, suffix: "", icon: "📈", color: "#00e5a0" },
    { label: "Devis reçus", value: stats?.demandesDevis ?? 0, suffix: "", icon: "📋", color: "#7b5cff" },
    {
      label: "Taux conversion",
      value: stats?.totalEvents && stats.totalEvents > 0 ? Math.round(((stats.demandesDevis ?? 0) / stats.totalEvents) * 100) : 0,
      suffix: "%",
      icon: "🎯",
      color: "#fbbf24",
    },
  ];

  const maxPageCount = stats?.topPages?.[0]?._count?.page ?? 1;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Analytics CEO</h1>
          <p className="text-white/40 text-sm mt-1">Vue d&apos;ensemble en temps réel</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-400 font-mono">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 p-5 hover:border-cyan-500/20 transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: kpi.color }} />
            </div>
            <div className="text-3xl font-black text-white">
              <AnimatedCounter end={kpi.value} suffix={kpi.suffix} />
            </div>
            <div className="text-white/40 text-xs mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h2 className="text-white font-bold mb-6">Activité 30 derniers jours</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats?.eventsByDay ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="createdAt" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid rgba(0,200,255,0.2)", borderRadius: "8px", color: "white" }} />
            <Line type="monotone" dataKey="_count.id" stroke="#00c8ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h2 className="text-white font-bold mb-4">Pages les plus visitées</h2>
          <div className="space-y-3">
            {(stats?.topPages ?? []).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-xs font-mono text-white/30 w-4">{i + 1}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{p.page}</span>
                    <span className="text-cyan-400 font-mono">{p._count.page}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded overflow-hidden">
                    <div className="h-full rounded" style={{ width: `${(p._count.page / maxPageCount) * 100}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h2 className="text-white font-bold mb-4">Services les plus demandés</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={stats?.serviceClicks ?? []} dataKey="_count.id" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label={({ name }: { name?: string }) => name}>
                {(stats?.serviceClicks ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid rgba(0,200,255,0.2)", borderRadius: "8px", color: "white" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
