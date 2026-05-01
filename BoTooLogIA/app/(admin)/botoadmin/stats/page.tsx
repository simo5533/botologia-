"use client";

import { useEffect, useState } from "react";
import { Users, KeyRound, FileText } from "lucide-react";

type StatsData = { users: number; sessions: number; auditLogs: number; timestamp: string } | null;

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((json) => setStats(json.data))
      .catch(() => setError("Chargement impossible"));
  }, []);

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-heading text-2xl font-bold text-white">
        Statistiques
      </h1>
      <p className="mt-2 text-slate-400">
        Métriques en direct depuis la base de données.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm">
          {error}
        </div>
      )}

      {stats && (
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-6">
            <Users className="h-8 w-8 text-holographic-cyan mb-3" aria-hidden />
            <p className="text-sm text-slate-400">Utilisateurs</p>
            <p className="font-heading text-3xl font-bold text-white mt-1">{stats.users.toLocaleString("fr-FR")}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-6">
            <KeyRound className="h-8 w-8 text-holographic-cyan mb-3" aria-hidden />
            <p className="text-sm text-slate-400">Sessions</p>
            <p className="font-heading text-3xl font-bold text-white mt-1">{stats.sessions.toLocaleString("fr-FR")}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-800/50 p-6">
            <FileText className="h-8 w-8 text-holographic-cyan mb-3" aria-hidden />
            <p className="text-sm text-slate-400">Journaux d&apos;audit</p>
            <p className="font-heading text-3xl font-bold text-white mt-1">{stats.auditLogs.toLocaleString("fr-FR")}</p>
          </div>
        </div>
      )}

      {stats && (
        <p className="mt-8 text-xs text-slate-500">
          Dernière mise à jour : {new Date(stats.timestamp).toLocaleString("fr-FR")}
        </p>
      )}
    </div>
  );
}
