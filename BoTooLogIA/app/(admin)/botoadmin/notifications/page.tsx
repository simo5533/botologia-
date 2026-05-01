"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Mail, User, MessageSquare, Calendar, Check, Archive, Circle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAppointmentFr } from "@/lib/format-appointment";

type ContactItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  source: string | null;
  appointmentAt?: string | null;
  createdAt: string;
};

type ContactsData = {
  items: ContactItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const statusLabel: Record<string, string> = {
  new: "Non lu",
  read: "Lu",
  archived: "Archivé",
};

type ProspectItem = {
  id: string;
  nom: string;
  email: string;
  societe: string | null;
  services: string[];
  budget: string | null;
  status: string;
  appointmentAt?: string | null;
  createdAt: string;
};

/** Unifié pour l’affichage : prospects API + devis extraits des contacts (message type "devis") */
type DevisDisplayItem = Pick<
  ProspectItem,
  "id" | "nom" | "email" | "services" | "budget" | "appointmentAt" | "createdAt"
>;

/**
 * Notifications — Demandes de contact et demandes de devis (Prospects) BoToLink.
 */
export default function NotificationsPage() {
  const [data, setData] = useState<ContactsData | null>(null);
  const [prospects, setProspects] = useState<ProspectItem[]>([]);
  const [prospectsError, setProspectsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    const params = new URLSearchParams({
      page: String(page),
      limit: "15",
      source: "botolink",
    });
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/admin/contacts?${params}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erreur"))))
      .then((json) => (json?.data ? setData(json.data) : setData(null)))
      .catch(() => setError("Impossible de charger les notifications BoToLink"));
  }, [page, statusFilter]);

  const loadProspects = useCallback(() => {
    setProspectsError(null);
    fetch("/api/prospects", { credentials: "include" })
      .then((r) => {
        if (!r.ok) return Promise.reject(new Error(r.status === 401 ? "Non autorisé" : "Erreur serveur"));
        return r.json();
      })
      .then((list) => setProspects(Array.isArray(list) ? list.slice(0, 15) : []))
      .catch((e) => {
        setProspects([]);
        setProspectsError(e?.message === "Non autorisé" ? "Connexion requise pour voir les devis." : "Impossible de charger les demandes de devis.");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadProspects();
  }, [loadProspects]);

  /** Devis issus des contacts (message JSON type "devis") — affichés même si l’API prospects échoue ou est vide */
  const devisFromContacts = useMemo((): DevisDisplayItem[] => {
    if (!data?.items?.length) return [];
    const out: DevisDisplayItem[] = [];
    for (const item of data.items) {
      try {
        const m = JSON.parse(item.message) as {
          type?: string;
          fullName?: string;
          services?: string[];
          budget?: string;
          appointmentAt?: string;
        };
        if (m?.type !== "devis") continue;
        const fromMsg = typeof m.appointmentAt === "string" ? m.appointmentAt : null;
        out.push({
          id: item.id,
          nom: m.fullName ?? item.name,
          email: item.email,
          services: Array.isArray(m.services) ? m.services : [],
          budget: m.budget ?? null,
          appointmentAt: item.appointmentAt ?? fromMsg,
          createdAt: item.createdAt,
        });
      } catch {
        // message non-JSON ou invalide
      }
    }
    return out;
  }, [data?.items]);

  /** Liste unifiée : prospects API + devis contacts (sans doublon par email), tri par date */
  const allDevis = useMemo((): DevisDisplayItem[] => {
    const byEmail = new Map<string, DevisDisplayItem>();
    for (const p of prospects) {
      byEmail.set(p.email.toLowerCase(), {
        id: p.id,
        nom: p.nom,
        email: p.email,
        services: p.services,
        budget: p.budget,
        appointmentAt: p.appointmentAt ?? null,
        createdAt: p.createdAt,
      });
    }
    for (const d of devisFromContacts) {
      const key = d.email.toLowerCase();
      if (!byEmail.has(key)) byEmail.set(key, d);
      else {
        const cur = byEmail.get(key)!;
        if (!cur.appointmentAt && d.appointmentAt) {
          byEmail.set(key, { ...cur, appointmentAt: d.appointmentAt });
        }
      }
    }
    return Array.from(byEmail.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 30);
  }, [prospects, devisFromContacts]);

  const setStatus = (id: string, status: "read" | "archived") => {
    setUpdatingId(id);
    fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(() => load())
      .catch(() => setError("Erreur lors de la mise à jour"))
      .finally(() => setUpdatingId(null));
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="p-6 md:p-10">
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white md:text-3xl flex items-center gap-3">
          <Bell className="h-8 w-8 text-holographic-cyan" aria-hidden />
          Notifications
        </h1>
        <p className="mt-2 text-slate-400">
          Demandes de contact et <strong className="text-slate-300">devis</strong> (Prospects) depuis BoToLink
        </p>
      </header>

      <section className="mb-10">
        <h2 className="font-heading text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-holographic-cyan" aria-hidden />
          Demandes de devis (Prospects)
        </h2>
        {prospectsError && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm flex items-center justify-between gap-2 flex-wrap">
            <span>{prospectsError}</span>
            <button
              type="button"
              onClick={() => loadProspects()}
              className="rounded-lg px-3 py-1.5 text-sm font-medium bg-amber-500/20 text-amber-200 hover:bg-amber-500/30"
            >
              Réessayer
            </button>
          </div>
        )}
        {!prospectsError && allDevis.length > 0 && (
          <div className="space-y-3 mb-4">
            {allDevis.map((p) => (
              <article
                key={p.id}
                className="rounded-xl border border-white/10 bg-slate-800/50 p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-white">{p.nom}</p>
                  <p className="text-sm text-slate-400">{p.email}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {Array.isArray(p.services) ? p.services.join(", ") : "—"} — Budget: {p.budget ?? "—"}
                  </p>
                  {p.appointmentAt ? (
                    <p className="text-sm text-holographic-cyan/90 mt-2 font-medium">
                      📅 RDV souhaité : {formatAppointmentFr(p.appointmentAt)}
                    </p>
                  ) : null}
                  <p className="text-xs text-slate-500 mt-1">{new Date(p.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <Link
                  href="/botoadmin/crm"
                  className="rounded-lg px-3 py-2 text-sm font-medium bg-holographic-cyan/20 text-holographic-cyan hover:bg-holographic-cyan/30"
                >
                  Voir CRM
                </Link>
              </article>
            ))}
          </div>
        )}
        {!prospectsError && allDevis.length === 0 && data !== null && (
          <p className="text-slate-500 text-sm">Aucune demande de devis pour le moment.</p>
        )}
        {!prospectsError && allDevis.length === 0 && data === null && (
          <p className="text-slate-500 text-sm">Chargement des demandes…</p>
        )}
      </section>

      <h2 className="font-heading text-lg font-semibold text-white mb-4">Demandes de contact</h2>

      {error && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Filtrer :</span>
        {["", "new", "read", "archived"].map((s) => (
          <button
            key={s || "all"}
            type="button"
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              statusFilter === s
                ? "bg-holographic-cyan/20 text-holographic-cyan"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            )}
          >
            {s === "" ? "Toutes" : statusLabel[s] ?? s}
          </button>
        ))}
      </div>

      {!data ? (
        <div className="rounded-xl border border-white/10 bg-slate-800/30 p-8 text-center text-slate-400">
          Chargement…
        </div>
      ) : data.items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-slate-800/30 p-10 text-center text-slate-400">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-600 mb-3" aria-hidden />
          <p>Aucune notification BoToLink pour le moment.</p>
          <p className="mt-1 text-sm">Les demandes envoyées depuis la page BoToLink apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.items.map((item) => (
            <article
              key={item.id}
              className={cn(
                "rounded-xl border bg-slate-800/50 backdrop-blur-sm p-4 md:p-5 transition-colors",
                item.status === "new"
                  ? "border-holographic-cyan/30 shadow-[0_0_20px_rgba(0,212,255,0.06)]"
                  : "border-white/10"
              )}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium bg-white/10 text-slate-300">
                      {item.status === "new" && <Circle className="h-2.5 w-2.5 fill-holographic-cyan text-holographic-cyan" aria-hidden />}
                      {statusLabel[item.status] ?? item.status}
                    </span>
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="flex items-center gap-2 text-white font-medium">
                    <User className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                    {item.name}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-400 mt-0.5">
                    <Mail className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                    <a href={`mailto:${item.email}`} className="hover:text-holographic-cyan truncate">
                      {item.email}
                    </a>
                  </p>
                  {item.appointmentAt ? (
                    <p className="mt-2 text-sm font-medium text-holographic-cyan">
                      📅 RDV souhaité : {formatAppointmentFr(item.appointmentAt)}
                    </p>
                  ) : null}
                  <p className="mt-2 text-slate-300 text-sm whitespace-pre-wrap line-clamp-3">
                    <MessageSquare className="inline h-3.5 w-3.5 mr-1.5 text-slate-500 align-middle" aria-hidden />
                    {item.message}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {item.status === "new" && (
                    <button
                      type="button"
                      disabled={updatingId === item.id}
                      onClick={() => setStatus(item.id, "read")}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium bg-holographic-cyan/20 text-holographic-cyan hover:bg-holographic-cyan/30 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" aria-hidden />
                      Marquer lu
                    </button>
                  )}
                  {item.status !== "archived" && (
                    <button
                      type="button"
                      disabled={updatingId === item.id}
                      onClick={() => setStatus(item.id, "archived")}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium bg-white/10 text-slate-400 hover:bg-white/15 hover:text-white disabled:opacity-50"
                    >
                      <Archive className="h-4 w-4" aria-hidden />
                      Archiver
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}

          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg px-4 py-2 text-sm font-medium bg-white/10 text-slate-400 hover:bg-white/15 disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="flex items-center px-4 py-2 text-sm text-slate-400">
                {page} / {data.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg px-4 py-2 text-sm font-medium bg-white/10 text-slate-400 hover:bg-white/15 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
