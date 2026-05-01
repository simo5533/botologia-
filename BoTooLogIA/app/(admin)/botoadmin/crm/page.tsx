"use client";

import { useEffect, useState } from "react";
import AILoader from "@/components/effects/AILoader";

const STATUSES = [
  { key: "NOUVEAU", label: "Nouveaux", color: "#00c8ff", emoji: "🆕" },
  { key: "CONTACTE", label: "Contactés", color: "#7b5cff", emoji: "📞" },
  { key: "QUALIFIE", label: "Qualifiés", color: "#fbbf24", emoji: "⭐" },
  { key: "DEVIS_ENVOYE", label: "Devis envoyé", color: "#f97316", emoji: "📄" },
  { key: "NEGOCIATION", label: "Négociation", color: "#a855f7", emoji: "🤝" },
  { key: "CLIENT", label: "Clients", color: "#00e5a0", emoji: "✅" },
  { key: "PERDU", label: "Perdus", color: "#ff4d6d", emoji: "❌" },
];

type Prospect = {
  id: string;
  nom: string;
  societe: string | null;
  email: string;
  telephone: string | null;
  poste: string | null;
  services: string[];
  budget: string | null;
  delai: string | null;
  description: string | null;
  appointmentAt?: string | null;
  status: string;
  priority: number;
  notes: string | null;
  assignedTo: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  activities: unknown[];
};

export default function CRMPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prospects")
      .then((r) => r.json())
      .then((data) => {
        setProspects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/prospects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    } catch {
      // ignore
    }
  };

  const filtered = prospects.filter(
    (p) =>
      !search ||
      p.nom?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.societe?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <AILoader text="Chargement CRM" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">CRM Prospects</h1>
          <p className="text-white/40 text-sm">{prospects.length} prospects total</p>
        </div>
        <input
          id="crm-prospect-search"
          name="q"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          aria-label="Rechercher un prospect"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-cyan-400/50 w-64"
        />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => {
          const cards = filtered.filter((p) => p.status === status.key);
          return (
            <div
              key={status.key}
              className="flex-shrink-0 w-64 rounded-2xl border border-white/5 p-3"
              style={{ background: "rgba(255,255,255,0.02)" }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("prospectId");
                if (id) updateStatus(id, status.key);
              }}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <span>{status.emoji}</span>
                <span className="text-white/70 text-xs font-semibold flex-1">{status.label}</span>
                <span className="text-xs font-mono rounded-full px-2 py-0.5" style={{ background: `${status.color}20`, color: status.color }}>
                  {cards.length}
                </span>
              </div>
              <div className="space-y-2">
                {cards.map((prospect) => (
                  <div
                    key={prospect.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("prospectId", prospect.id)}
                    className="rounded-xl border border-white/5 p-3 cursor-grab hover:border-cyan-400/20 transition-all duration-200 active:cursor-grabbing active:scale-95"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="text-white text-xs font-semibold">{prospect.nom}</div>
                        <div className="text-white/40 text-[10px]">{prospect.societe || prospect.email}</div>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: status.color }} />
                    </div>
                    {prospect.appointmentAt && (
                      <div className="text-[10px] text-emerald-400/90 font-medium mb-1">
                        📅{" "}
                        {new Date(prospect.appointmentAt).toLocaleString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                    {prospect.budget && (
                      <div className="text-[10px] text-cyan-400/70 font-mono mb-1">💰 {prospect.budget}</div>
                    )}
                    {prospect.services?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prospect.services.slice(0, 2).map((s: string, i: number) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/40">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-[10px] text-white/20 mt-2">{new Date(prospect.createdAt).toLocaleDateString("fr-FR")}</div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <div className="text-center py-6 text-white/10 text-xs border border-dashed border-white/5 rounded-xl">
                    Glisser ici
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
