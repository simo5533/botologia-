"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, KeyRound, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statIcons = {
  users: Users,
  sessions: KeyRound,
  auditLogs: FileText,
  activity: Activity,
} as const;

type StatsData = { users: number; sessions: number; auditLogs: number } | null;

/**
 * BoToAdmin — Dashboard : stats réelles (API), liens vers Tables, UI premium.
 */
export default function BoToAdminPage() {
  const reduceMotion = useReducedMotion();
  const [stats, setStats] = useState<StatsData>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Non autorisé"))))
      .then((json) => setStats(json.data))
      .catch(() => setError("Impossible de charger les statistiques"));
  }, []);

  const statCards = stats
    ? [
        { label: "Utilisateurs", value: stats.users.toLocaleString("fr-FR"), icon: statIcons.users, href: "/botoadmin/tables?tab=users" },
        { label: "Sessions", value: stats.sessions.toLocaleString("fr-FR"), icon: statIcons.sessions, href: "/botoadmin/tables" },
        { label: "Journaux d'audit", value: stats.auditLogs.toLocaleString("fr-FR"), icon: statIcons.auditLogs, href: "/botoadmin/tables?tab=audit" },
        { label: "Activité", value: stats.auditLogs > 0 ? "Récente" : "—", icon: statIcons.activity, href: "/botoadmin/stats" },
      ]
    : [];

  return (
    <div className="p-6 md:p-10">
      <header className="mb-10">
        <h1 className="font-heading text-2xl font-bold text-white md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-400">
          Vue d&apos;ensemble de l&apos;activité BoTooLogIA (données en direct)
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm">
          {error}. Vérifiez que la base est configurée et que la protection admin est cohérente.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : i * 0.05 }}
          >
            <Link
              href={stat.href}
              className={cn(
                "block rounded-xl border border-white/10 bg-slate-800/50 backdrop-blur-sm p-5",
                "hover:border-holographic-cyan/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)] transition-all duration-300"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="mt-1 font-heading text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-lg bg-holographic-cyan/10 p-2 text-holographic-cyan">
                  <stat.icon className="h-5 w-5" aria-hidden />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.section
        className="overflow-hidden rounded-xl border border-white/10 bg-slate-800/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.2 }}
      >
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">
            Accès rapides
          </h2>
          <Link
            href="/botoadmin/tables"
            className="text-sm text-holographic-cyan hover:underline"
          >
            Tables →
          </Link>
        </div>
        <div className="p-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/botoadmin/tables?tab=users"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition-colors"
          >
            Utilisateurs (liste paginée)
          </Link>
          <Link
            href="/botoadmin/tables?tab=audit"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition-colors"
          >
            Journaux d&apos;audit
          </Link>
          <Link
            href="/botoadmin/stats"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition-colors"
          >
            Statistiques détaillées
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
