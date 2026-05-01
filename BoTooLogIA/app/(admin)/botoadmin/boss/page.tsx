"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Users,
  KeyRound,
  FileText,
  MessageSquare,
  TrendingUp,
  Crown,
  Download,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardData = {
  users: { total: number; active: number; inactive: number; newThisMonth: number };
  sessions: number;
  auditLogs: number;
  contactRequests: number;
  revenue: { total: number; thisMonth: number; currency: string };
  timestamp: string;
};

type StatisticsData = DashboardData & {
  usersByRole: { role: string; count: number }[];
  signupsByDay: { date: string; count: number }[];
  signupsByMonth: { month: string; count: number }[];
  activityByDay: { date: string; count: number }[];
};

export default function BossDashboardPage() {
  const reduceMotion = useReducedMotion();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/boss/dashboard").then((r) => {
        if (r.status === 401) setForbidden(true);
        return r.ok ? r.json() : Promise.reject(new Error("Erreur"));
      }),
      fetch("/api/boss/statistics").then((r) => {
        if (r.status === 401) setForbidden(true);
        return r.ok ? r.json() : Promise.reject(new Error("Erreur"));
      }),
    ])
      .then(([dRes, sRes]) => {
        setDashboard(dRes.data);
        setStatistics(sRes.data);
      })
      .catch(() => setError("Impossible de charger les données BOSS"));
  }, []);

  if (forbidden) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <Crown className="h-16 w-16 text-amber-500/80 mb-4" aria-hidden />
        <h2 className="font-heading text-xl font-bold text-white">Accès réservé au BOSS</h2>
        <p className="mt-2 text-slate-400 text-center max-w-md">
          Cette section est réservée aux comptes BOSS. Connectez-vous avec un compte BOSS pour y accéder.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboard || !statistics) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <p className="text-slate-400">Chargement du dashboard BOSS…</p>
      </div>
    );
  }

  const statCards = [
    { label: "Utilisateurs (total)", value: dashboard.users.total.toLocaleString("fr-FR"), icon: Users },
    { label: "Actifs ce mois", value: dashboard.users.newThisMonth.toLocaleString("fr-FR"), icon: TrendingUp },
    { label: "Sessions", value: dashboard.sessions.toLocaleString("fr-FR"), icon: KeyRound },
    { label: "Journaux d'audit", value: dashboard.auditLogs.toLocaleString("fr-FR"), icon: FileText },
    { label: "Demandes de contact", value: dashboard.contactRequests.toLocaleString("fr-FR"), icon: MessageSquare },
    {
      label: `Revenus (${dashboard.revenue.currency})`,
      value: dashboard.revenue.total.toLocaleString("fr-FR"),
      icon: BarChart3,
    },
  ];

  const handleExport = (type: string) => {
    window.open(`/api/boss/export/${type}?format=csv`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-6 md:p-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white md:text-3xl flex items-center gap-2">
            <Crown className="h-8 w-8 text-amber-500/90" aria-hidden />
            Dashboard BOSS
          </h1>
          <p className="mt-1 text-slate-400">
            Statistiques générales de l&apos;agence — données en direct
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleExport("users")}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> Export users CSV
          </button>
          <button
            type="button"
            onClick={() => handleExport("contacts")}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> Export contacts CSV
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-10">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, delay: (i % 6) * 0.05 }}
            className={cn(
              "rounded-xl border border-white/10 bg-slate-800/50 backdrop-blur-sm p-4",
              "hover:border-amber-500/20 transition-colors"
            )}
          >
            <stat.icon className="h-6 w-6 text-amber-500/80 mb-2" aria-hidden />
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className="mt-1 font-heading text-xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Graphiques — chargement dynamique Recharts (client only) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-slate-800/50 p-6">
          <h2 className="font-heading text-lg font-semibold text-white mb-4">
            Inscriptions par jour (30 derniers jours)
          </h2>
          {statistics.signupsByDay.length > 0 ? (
            <BossLineChart data={statistics.signupsByDay} dataKey="count" nameKey="date" />
          ) : (
            <p className="text-slate-500 text-sm py-8">Aucune donnée sur la période.</p>
          )}
        </section>
        <section className="rounded-xl border border-white/10 bg-slate-800/50 p-6">
          <h2 className="font-heading text-lg font-semibold text-white mb-4">
            Répartition des utilisateurs par rôle
          </h2>
          {statistics.usersByRole.length > 0 ? (
            <BossBarChart data={statistics.usersByRole} dataKey="count" nameKey="role" />
          ) : (
            <p className="text-slate-500 text-sm py-8">Aucune donnée.</p>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-slate-800/50 p-6">
          <h2 className="font-heading text-lg font-semibold text-white mb-4">
            Activité (audit) par jour
          </h2>
          {statistics.activityByDay.length > 0 ? (
            <BossLineChart data={statistics.activityByDay} dataKey="count" nameKey="date" />
          ) : (
            <p className="text-slate-500 text-sm py-8">Aucune donnée sur la période.</p>
          )}
        </section>
        <section className="rounded-xl border border-white/10 bg-slate-800/50 p-6">
          <h2 className="font-heading text-lg font-semibold text-white mb-4">
            Inscriptions par mois
          </h2>
          {statistics.signupsByMonth.length > 0 ? (
            <BossBarChart data={statistics.signupsByMonth} dataKey="count" nameKey="month" />
          ) : (
            <p className="text-slate-500 text-sm py-8">Aucune donnée.</p>
          )}
        </section>
      </div>

      <p className="mt-8 text-xs text-slate-500">
        Dernière mise à jour : {new Date(dashboard.timestamp).toLocaleString("fr-FR")}
      </p>
    </div>
  );
}

function BossLineChart({
  data,
  dataKey,
  nameKey,
}: {
  data: { [k: string]: string | number }[];
  dataKey: string;
  nameKey: string;
}) {
  const [Recharts, setRecharts] = useState<typeof import("recharts") | null>(null);
  useEffect(() => {
    import("recharts").then(setRecharts);
  }, []);
  if (!Recharts) return <div className="h-[280px] flex items-center justify-center text-slate-500">Chargement…</div>;
  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey={nameKey} stroke="#94a3b8" fontSize={11} tick={{ fill: "#94a3b8" }} />
        <YAxis stroke="#94a3b8" fontSize={11} tick={{ fill: "#94a3b8" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)" }}
          labelStyle={{ color: "#e2e8f0" }}
        />
        <Line type="monotone" dataKey={dataKey} stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function BossBarChart({
  data,
  dataKey,
  nameKey,
}: {
  data: { [k: string]: string | number }[];
  dataKey: string;
  nameKey: string;
}) {
  const [Recharts, setRecharts] = useState<typeof import("recharts") | null>(null);
  useEffect(() => {
    import("recharts").then(setRecharts);
  }, []);
  if (!Recharts) return <div className="h-[280px] flex items-center justify-center text-slate-500">Chargement…</div>;
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey={nameKey} stroke="#94a3b8" fontSize={11} tick={{ fill: "#94a3b8" }} />
        <YAxis stroke="#94a3b8" fontSize={11} tick={{ fill: "#94a3b8" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)" }}
          labelStyle={{ color: "#e2e8f0" }}
        />
        <Bar dataKey={dataKey} fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
