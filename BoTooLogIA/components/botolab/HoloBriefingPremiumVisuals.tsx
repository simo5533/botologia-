"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const frameClass = cn(
  "mx-auto w-full max-w-2xl overflow-hidden rounded-2xl",
  "border border-cyan-500/25 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90",
  "shadow-[inset_0_1px_0_rgba(0,200,255,0.12),0_0_32px_rgba(0,200,255,0.08)]"
);

const cap = (t: string) => (
  <figcaption
    className="mt-2.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.16em] text-slate-500 sm:text-xs"
  >
    {t}
  </figcaption>
);

type VProps = { uid: string };

/* ─── Service 1 — Chatbots IA ─── */
function V1A({ uid }: VProps) {
  const g = `g1a-${uid}`;
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${g}-lg`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <text x="200" y="24" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Conversation &amp; intent
      </text>
      <rect x="40" y="48" width="140" height="52" rx="10" stroke={`url(#${g}-lg)`} fill="rgba(15,23,42,0.5)" />
      <text x="110" y="80" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 9 }}>NLP &amp; FAQ</text>
      <rect x="220" y="48" width="140" height="52" rx="10" stroke="#22d3ee" strokeOpacity="0.5" fill="rgba(6,78,90,0.3)" />
      <text x="290" y="80" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 9 }}>Transfert humain</text>
      <path d="M180 74 H220" stroke={`url(#${g}-lg)`} strokeWidth="1.2" />
      <path d="M200 100 L200 128 M32 150 H368" stroke="rgba(34,211,238,0.4)" strokeWidth="1.2" />
      <rect x="80" y="150" width="240" height="40" rx="8" stroke="#a78bfa" strokeOpacity="0.5" fill="rgba(49,40,80,0.25)" />
      <text x="200" y="174" textAnchor="middle" fill="#cbd5e1" style={{ fontSize: 8 }}>Même ton · même politique · journaux d&apos;audit</text>
    </svg>
  );
}
function V1B({ uid }: VProps) {
  const g = `g1b-${uid}`;
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${g}-lg`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="1" stopColor="#1e3a5f" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Résolution &amp; preuve
      </text>
      <rect x="50" y="40" width="300" height="100" rx="12" fill={`url(#${g}-lg)`} fillOpacity="0.15" stroke="#22d3ee" strokeWidth="0.8" />
      <text x="200" y="70" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 8 }}>CSAT · FCR · abandon</text>
      <rect x="100" y="90" width="200" height="32" rx="6" fill="rgba(0,0,0,0.2)" stroke="rgba(0,200,255,0.3)" />
      <text x="200" y="110" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 8 }}>Tableau de bord &amp; itérations</text>
      <path d="M200 150 L200 170 M170 180 H230" stroke="#a78bfa" strokeWidth="1.2" />
      <text x="200" y="194" textAnchor="middle" fill="#64748b" style={{ fontSize: 7 }}>Boucle d&apos;amélioration sur logs utiles (RGPD)</text>
    </svg>
  );
}

/* ─── Service 2 — Automatisation ─── */
function V2A(_props: VProps) {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Tâches → RPA + IA
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={50 + i * 85}
            y="55"
            width="70"
            height="36"
            rx="6"
            stroke="#22d3ee"
            strokeOpacity={0.4 + i * 0.1}
            fill="rgba(15,30,50,0.4)"
          />
          {i < 3 && (
            <path
              d={`M${50 + i * 85 + 70} 73 H${50 + (i + 1) * 85}`}
              stroke="#7c3aed"
              strokeWidth="1.2"
            />
          )}
        </g>
      ))}
      <text x="200" y="78" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 7 }}>Lecture doc · scoring</text>
      <rect x="90" y="120" width="220" height="50" rx="8" stroke="#3b82f6" strokeOpacity="0.4" fill="rgba(20,40,80,0.3)" />
      <text x="200" y="150" textAnchor="middle" fill="#cbd5e1" style={{ fontSize: 8 }}>Orchestration &amp; file d&apos;attente</text>
    </svg>
  );
}
function V2B(_props: VProps) {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <text x="200" y="24" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Avant / après
      </text>
      <text x="100" y="100" textAnchor="middle" fill="#64748b" style={{ fontSize: 8 }}>Cycle</text>
      <text x="300" y="100" textAnchor="middle" fill="#22d3ee" style={{ fontSize: 8 }}>−40%</text>
      <rect x="60" y="50" width="100" height="100" stroke="rgba(100,100,100,0.3)" fill="none" />
      <rect x="240" y="50" width="100" height="100" stroke="#22d3ee" strokeOpacity="0.4" fill="rgba(0,200,255,0.05)" />
      <text x="200" y="180" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 7 }}>Journaux, seuils, reprise fiable</text>
    </svg>
  );
}

/* ─── Service 3 — Analyse prédictive ─── */
function V3A({ uid }: VProps) {
  const gid = `pv3a-${uid}`;
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Prévision &amp; intervalle
      </text>
      <path
        d="M40 160 Q120 100 200 80 T360 50"
        stroke={`url(#${gid})`}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M40 170 Q120 120 200 100 T360 80"
        stroke="rgba(124,58,237,0.3)"
        strokeWidth="1"
        strokeDasharray="4 2"
        fill="none"
      />
      <text x="200" y="190" textAnchor="middle" fill="#64748b" style={{ fontSize: 7 }}>Cône d&apos;incertitude &amp; revue métier</text>
    </svg>
  );
}
function V3B(_props: VProps) {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Monitoring modèle
      </text>
      <circle cx="200" cy="100" r="50" stroke="#22d3ee" strokeOpacity="0.4" fill="none" />
      <text x="200" y="90" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 8 }}>Drift / biais</text>
      <text x="200" y="110" textAnchor="middle" fill="#a78bfa" style={{ fontSize: 7 }}>Réentraînement cadré</text>
      <rect x="120" y="150" width="160" height="32" rx="6" stroke="#3b82f6" strokeOpacity="0.35" fill="rgba(0,0,0,0.2)" />
      <text x="200" y="170" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 7 }}>Alerter · documenter · arbitrer</text>
    </svg>
  );
}

/* ─── Service 4 — CRM & workflow ─── */
function V4A(_props: VProps) {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Donnée unique client
      </text>
      <rect x="160" y="50" width="80" height="50" rx="8" fill="rgba(0,200,255,0.1)" stroke="#22d3ee" />
      <text x="200" y="80" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 8 }}>CRM</text>
      {[-1, 0, 1].map((i) => (
        <path
          key={i}
          d={`M200 100 L${200 + i * 90} 130`}
          stroke="#7c3aed"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />
      ))}
      <text x="80" y="150" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 7 }}>Mail</text>
      <text x="200" y="150" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 7 }}>Chat</text>
      <text x="320" y="150" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 7 }}>Tel</text>
    </svg>
  );
}
function V4B(_props: VProps) {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Workflow signé
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={50 + i * 85}
          y="60"
          width="70"
          height="70"
          rx="8"
          stroke="#22d3ee"
          strokeOpacity="0.25"
          fill={i < 2 ? "rgba(0,200,255,0.08)" : "rgba(30,30,30,0.2)"}
        />
      ))}
      <text x="200" y="180" textAnchor="middle" fill="#64748b" style={{ fontSize: 7 }}>Rôles, horodatage, reprise d&apos;erreur</text>
    </svg>
  );
}

/* ─── Service 5 — Web / app / contenu IA ─── */
function V5A(_props: VProps) {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Site · app · contenu
      </text>
      <rect x="30" y="50" width="100" height="100" rx="8" stroke="#22d3ee" strokeOpacity="0.4" fill="rgba(0,30,50,0.2)" />
      <text x="80" y="105" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 7 }}>Front</text>
      <rect x="150" y="50" width="100" height="100" rx="8" stroke="#7c3aed" strokeOpacity="0.4" fill="rgba(40,20,60,0.2)" />
      <text x="200" y="105" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 7 }}>API</text>
      <rect x="270" y="50" width="100" height="100" rx="8" stroke="#3b82f6" strokeOpacity="0.4" fill="rgba(20,30,60,0.2)" />
      <text x="320" y="105" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 7 }}>Médias IA</text>
    </svg>
  );
}
function V5B(_props: VProps) {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Validation &amp; droits
      </text>
      <path d="M80 100 H320" stroke="rgba(100,100,100,0.3)" />
      <circle cx="120" cy="100" r="20" fill="rgba(0,200,255,0.15)" stroke="#22d3ee" />
      <text x="120" y="104" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 7 }}>A</text>
      <circle cx="200" cy="100" r="20" fill="rgba(124,58,237,0.15)" stroke="#a78bfa" />
      <text x="200" y="104" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 7 }}>B</text>
      <circle cx="280" cy="100" r="20" fill="rgba(50,200,100,0.1)" stroke="#4ade80" />
      <text x="200" y="180" textAnchor="middle" fill="#64748b" style={{ fontSize: 7 }}>Variante gagnante · sources citées</text>
    </svg>
  );
}

/* ─── Service 6 — Voicebots ─── */
function V6A(_props: VProps) {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Voix → texte → intention
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <rect
          key={i}
          x={40 + i * 32}
          y={100 - 20 * Math.sin(i * 0.7)}
          width="4"
          height="40"
          fill="#22d3ee"
          fillOpacity={0.35 + 0.05 * i}
        />
      ))}
      <rect x="80" y="150" width="240" height="32" rx="6" fill="rgba(0,0,0,0.3)" stroke="rgba(0,200,255,0.3)" />
      <text x="200" y="170" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 7 }}>ASR + débruitage + contexte</text>
    </svg>
  );
}
function V6B(_props: VProps) {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden>
      <text x="200" y="22" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9, fontWeight: 600 }}>
        Passage opérateur
      </text>
      <rect x="60" y="60" width="100" height="80" rx="10" stroke="#22d3ee" fill="rgba(0,50,60,0.2)" />
      <text x="110" y="110" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 8 }}>Voix</text>
      <path d="M160 100 H240" stroke="#a78bfa" strokeWidth="2" />
      <polygon points="240,95 255,100 240,105" fill="#a78bfa" />
      <rect x="260" y="60" width="80" height="80" rx="10" stroke="#4ade80" fill="rgba(20,60,30,0.2)" />
      <text x="300" y="110" textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 7 }}>Humain</text>
    </svg>
  );
}

const SPECS: Record<
  string,
  {
    slot1: { Svg: (p: VProps) => ReactNode; caption: string; aria: string };
    slot2: { Svg: (p: VProps) => ReactNode; caption: string; aria: string };
  }
> = {
  "1": {
    slot1: {
      Svg: (p) => <V1A {...p} />,
      caption: "Chatbot — canaux, NLP et passation contrôlée",
      aria: "Schéma conversationnel, FAQ et escalade humaine",
    },
    slot2: {
      Svg: (p) => <V1B {...p} />,
      caption: "Mesure de l’impact et amélioration itérative (conforme)",
      aria: "Indicateurs FCR, CSAT, boucle d’amélioration",
    },
  },
  "2": {
    slot1: {
      Svg: (p) => <V2A {...p} />,
      caption: "Chaîne d’automatisation : tâches, RPA et couches IA",
      aria: "Pipeline de tâches en chaîne",
    },
    slot2: {
      Svg: (p) => <V2B {...p} />,
      caption: "Gains mesurables, traçabilité et reprise",
      aria: "Comparaison avant après et gouvernance",
    },
  },
  "3": {
    slot1: {
      Svg: (p) => <V3A {...p} />,
      caption: "Scénario prédictif et enveloppe d’incertitude",
      aria: "Courbe de prévision et zone d’incertitude",
    },
    slot2: {
      Svg: (p) => <V3B {...p} />,
      caption: "Surveillance du modèle, drift et arbitrage",
      aria: "Cycle de monitoring et réentraînement",
    },
  },
  "4": {
    slot1: {
      Svg: (p) => <V4A {...p} />,
      caption: "CRM comme hub : canaux et données alignés",
      aria: "Hub CRM relié à plusieurs canaux",
    },
    slot2: {
      Svg: (p) => <V4B {...p} />,
      caption: "Étapes de workflow et responsabilités claires",
      aria: "États de workflow et audit",
    },
  },
  "5": {
    slot1: {
      Svg: (p) => <V5A {...p} />,
      caption: "Cohérence produit : front, API, médias générés",
      aria: "Trois blocs site application et contenu",
    },
    slot2: {
      Svg: (p) => <V5B {...p} />,
      caption: "Test, validation et A/B sur les variantes générées",
      aria: "Sélection de variante gagnante",
    },
  },
  "6": {
    slot1: {
      Svg: (p) => <V6A {...p} />,
      caption: "Chaîne vocale : audio, ASR, intention",
      aria: "Forme d’onde et traitement de la voix",
    },
    slot2: {
      Svg: (p) => <V6B {...p} />,
      caption: "Reprise d’appel et transfert opérateur contextuel",
      aria: "Transfert de la voix vers un humain",
    },
  },
};

export type HoloServiceVisualProps = {
  serviceId: string;
  /** Premier paragraphe de la section 1 = 1, section 2 = 2 */
  slot: 1 | 2;
  className?: string;
};

/**
 * Visuels de briefing : **deux par service**, contenus et légendes distincts.
 */
export function HoloServiceVisual({ serviceId, slot, className }: HoloServiceVisualProps) {
  const uid = useId().replace(/:/g, "");
  const pack = SPECS[serviceId];
  if (!pack) return null;
  const spec = slot === 1 ? pack.slot1 : pack.slot2;
  const S = spec.Svg;

  return (
    <figure
      className={cn("my-5 w-full", className)}
      role="img"
      aria-label={spec.aria}
    >
      <div className={frameClass}>
        <div className="relative aspect-[16/9] w-full p-3 sm:p-4">
          <div
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{
              background: `repeating-linear-gradient(
                0deg, transparent, transparent 4px,
                rgba(0, 200, 255, 0.03) 4px, rgba(0, 200, 255, 0.03) 5px
              )`,
            }}
            aria-hidden
          />
          <S uid={uid} />
        </div>
      </div>
      {cap(spec.caption)}
    </figure>
  );
}
