"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import HeroBanner from "@/components/ui/HeroBanner";
import { Check, X } from "lucide-react";

const BANNER_VIDEO_SRC = "/videos/banner-botoadvantage.mp4";

/* Étapes de la méthode — formulations factuelles (pas de KPI inventés) */
const methodeSteps = [
  {
    numero: "01",
    tag: "Découverte & Diagnostic",
    titre: "Audit de vos processus",
    description:
      "Analyse de votre contexte (outils, données, contraintes) et identification des leviers où l’IA et l’automatisation peuvent apporter une valeur concrète. Livrable typique : synthèse et pistes de mise en œuvre priorisées.",
    kpis: ["Sans engagement initial", "Cadre clair", "Échange ciblé"],
    icon: "🔍",
    duree: "Sur devis",
    couleur: "#00c8ff",
  },
  {
    numero: "02",
    tag: "Stratégie & Architecture",
    titre: "Feuille de route sur mesure",
    description:
      "Co-construction d’une trajectoire adaptée à vos objectifs : cas d’usage, architecture cible, jalons et périmètre technique. Pas de promesse chiffrée sans base mesurée côté client.",
    kpis: ["Alignement métier", "Périmètre défini", "Priorisation"],
    icon: "🎯",
    duree: "Sur devis",
    couleur: "#7c3aed",
  },
  {
    numero: "03",
    tag: "Conception & Développement",
    titre: "Itérations courtes et livrables visibles",
    description:
      "Développement par incréments avec points d’étape réguliers. Connexion aux systèmes existants (API, CRM, outils internes) lorsque c’est pertinent et réalisable techniquement.",
    kpis: ["Visibilité régulière", "Intégrations réalistes", "Qualité de code"],
    icon: "⚙️",
    duree: "Sur devis",
    couleur: "#059669",
  },
  {
    numero: "04",
    tag: "Lancement & Suivi",
    titre: "Mise en conditions réelles",
    description:
      "Déploiement mesuré, suivis de stabilité et améliorations continues en fonction des usages. L’accompagnement post-lancement est précisé dans le contrat, sans chiffre marketing imposé.",
    kpis: ["Stabilité", "Amélioration continue", "Transparence"],
    icon: "🚀",
    duree: "Sur devis",
    couleur: "#f59e0b",
  },
] as const;

type MethodeStep = (typeof methodeSteps)[number];

function StepCard({ step, index: _index }: { step: MethodeStep; index: number }) {
  const [hovered, setHovered] = useState(false);

  const hoverBg =
    step.couleur === "#00c8ff"
      ? "rgba(0,200,255,0.05)"
      : step.couleur === "#7c3aed"
        ? "rgba(124,58,237,0.05)"
        : step.couleur === "#059669"
          ? "rgba(5,150,105,0.05)"
          : "rgba(245,158,11,0.05)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "clamp(24px, 3vw, 36px)",
        borderRadius: "20px",
        border: hovered ? `1px solid ${step.couleur}55` : "1px solid rgba(255,255,255,0.07)",
        background: hovered ? hoverBg : "rgba(255,255,255,0.02)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${step.couleur}22`
          : "0 4px 20px rgba(0,0,0,0.2)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        willChange: "transform",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              border: `1.5px solid ${step.couleur}44`,
              background: `${step.couleur}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              flexShrink: 0,
              transform: hovered ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.3s ease",
              willChange: "transform",
              boxShadow: hovered ? `0 0 20px ${step.couleur}30` : "none",
            }}
          >
            {step.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: step.couleur,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
            >
              {step.tag}
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                color: "rgba(255,255,255,0.3)",
                fontWeight: 500,
              }}
            >
              Durée : {step.duree}
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: "3.5rem",
            fontWeight: 900,
            color: `${step.couleur}18`,
            lineHeight: 1,
            fontFamily: "monospace",
            letterSpacing: "-0.04em",
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          {step.numero}
        </div>
      </div>

      <h3
        style={{
          fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
          fontWeight: 800,
          color: "#fff",
          margin: "0 0 12px",
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        {step.titre}
      </h3>

      <div
        style={{
          width: hovered ? "60px" : "30px",
          height: "2px",
          background: `linear-gradient(90deg, ${step.couleur}, transparent)`,
          borderRadius: "1px",
          marginBottom: "14px",
          transition: "width 0.4s ease",
        }}
      />

      <p
        style={{
          fontSize: "0.9rem",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.75,
          margin: "0 0 20px",
          fontWeight: 300,
        }}
      >
        {step.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {step.kpis.map((kpi, j) => (
          <span
            key={j}
            style={{
              padding: "5px 12px",
              borderRadius: "999px",
              border: `1px solid ${step.couleur}33`,
              background: `${step.couleur}0a`,
              fontSize: "0.75rem",
              fontWeight: 600,
              color: step.couleur,
              letterSpacing: "0.02em",
              transition: "background 0.2s ease",
            }}
          >
            ✓ {kpi}
          </span>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: "3px",
          borderRadius: "0 2px 2px 0",
          background: hovered
            ? `linear-gradient(to bottom, transparent, ${step.couleur}, transparent)`
            : "transparent",
          transition: "background 0.4s ease",
        }}
      />
    </div>
  );
}

const comparison = [
  { us: "Accompagnement de A à Z", other: "Livrables isolés" },
  { us: "Équipe technique dédiée", other: "Ressources génériques" },
  { us: "Focus valeur métier", other: "Focus technique seul" },
  {
    us: "Déploiement et suivi projet",
    other: "Livrable sans mise en production",
  },
];

/**
 * BoToAdvantage — Méthode et comparatif (sans chiffres inventés).
 */
export default function BoToAdvantagePage() {
  const reduceMotion = useReducedMotion();

  return (
    <main>
        <HeroBanner
          videoSrc={BANNER_VIDEO_SRC}
          eyebrow="Méthode & avantage concurrentiel"
          title="BoToAdvantage"
          pillText="Pourquoi BoTooLogIA"
          description="Une méthode en quatre étapes et un accompagnement technique solide, de la prise de besoin à la mise en conditions réelles."
          secondaryHref="#methode"
          secondaryLabel="Découvrir la méthode"
        />
        <SectionWrapper
          title="Pourquoi BoTooLogIA"
          titleTag="BoToAdvantage"
          subtitle="Vous propulse dans le futur grâce à des solutions d'intelligence artificielle conçues pour transformer votre performance et accélérer votre croissance. Notre équipe d'experts en IA, automatisation et stratégie digitale met son savoir-faire de haut niveau au service de votre domination technologique et commerciale."
          headingLevel={2}
          titleGradient
        >
        {/* ═══ SECTION NOTRE MÉTHODE — VERSION CEO PREMIUM ═══ */}
        <section
          id="methode"
          aria-label="Notre méthode BoTooLogIA"
          style={{
            padding: "clamp(80px, 10vw, 140px) 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 clamp(16px, 4vw, 48px)",
            }}
          >
            {/* En-tête section */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "clamp(48px, 6vw, 80px)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 18px",
                  borderRadius: "999px",
                  border: "1px solid rgba(0,200,255,0.3)",
                  background: "rgba(0,200,255,0.06)",
                  marginBottom: "8px",
                }}
              >
                <span
                  className="badge-dot-pulse"
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#00c8ff",
                    animation: "badge-dot-pulse 2s infinite",
                  }}
                />
                <span
                  className="methode-badge-text"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#00c8ff",
                    textTransform: "uppercase",
                  }}
                >
                  Méthode structurée • BoTooLogIA
                </span>
              </div>

              <h2
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.15,
                  margin: "0 0 8px",
                }}
              >
                <span className="methode-title-white">Notre méthode</span>{" "}
                <span className="methode-title-gradient">claire et pilotée</span>
              </h2>

              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "620px",
                  margin: "0 auto 16px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                Un cadre structuré en quatre étapes pour cadrer le besoin, concevoir une solution IA ou automatisée solide et la déployer sans promesses marketing non vérifiables.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "clamp(16px, 3vw, 40px)",
                }}
              >
                {[
                  { titre: "Phases lisibles", detail: "Diagnostic, stratégie, build, mise en ligne" },
                  { titre: "Sans promesse chiffrée", detail: "Pas de KPI ou ROI inventés dans la vitrine" },
                  { titre: "Sur mesure", detail: "Périmètre et jalons avec vous, sur devis" },
                ].map((kpi, i) => (
                  <div key={i} style={{ textAlign: "center", maxWidth: "220px" }}>
                    <div
                      style={{
                        fontSize: "clamp(1rem, 2vw, 1.15rem)",
                        fontWeight: 800,
                        color: "#00c8ff",
                        lineHeight: 1.2,
                        marginBottom: "6px",
                      }}
                    >
                      {kpi.titre}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.45)",
                        fontWeight: 500,
                        lineHeight: 1.45,
                      }}
                    >
                      {kpi.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Étapes méthode */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 520px), 1fr))",
                gap: "clamp(16px, 3vw, 28px)",
                position: "relative",
              }}
            >
              {methodeSteps.map((step, i) => (
                <StepCard key={step.numero} step={step} index={i} />
              ))}
            </div>

            {/* CTA CEO */}
            <div
              style={{
                textAlign: "center",
                marginTop: "clamp(48px, 6vw, 80px)",
                padding: "clamp(32px, 4vw, 56px)",
                borderRadius: "24px",
                border: "1px solid rgba(0,200,255,0.15)",
                background:
                  "linear-gradient(135deg, rgba(0,200,255,0.05) 0%, rgba(124,58,237,0.05) 100%)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "200px",
                  height: "200px",
                  background:
                    "radial-gradient(circle at top right, rgba(0,200,255,0.1), transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <p
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#00c8ff",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Prêt à démarrer votre transformation IA ?
              </p>

              <h3
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 900,
                  color: "#fff",
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}
              >
                Discutons de votre projet
              </h3>

              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.95rem",
                  marginBottom: "28px",
                  lineHeight: 1.6,
                }}
              >
                Décrivez vos enjeux via BoToLink : l’équipe revient vers vous avec une proposition adaptée à votre contexte.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link
                  href="/botolink"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 32px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #00c8ff, #0094cc)",
                    color: "#000d1a",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    willChange: "transform",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 30px rgba(0,200,255,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span>🚀</span>
                  <span>Ouvrir BoToLink</span>
                </Link>

                <Link
                  href="/botoworks"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 28px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0,200,255,0.3)",
                    color: "#00c8ff",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(0,200,255,0.6)";
                    e.currentTarget.style.background =
                      "rgba(0,200,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(0,200,255,0.3)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span>Voir nos réalisations →</span>
                </Link>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                {[
                  "Sans engagement préalable forcé",
                  "Contact réactif",
                  "Équipe technique impliquée",
                  "Confidentiel",
                ].map((g, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 500,
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparaison */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white mb-6 text-center">
            BoTooLogIA vs approche classique
          </h2>
          <div className="overflow-hidden rounded-2xl border border-white/20">
            <table className="w-full text-left text-sm" role="table">
              <thead>
                <tr className="border-b border-white/20 bg-slate-800/50">
                  <th
                    scope="col"
                    className="p-4 font-heading font-semibold text-holographic-cyan"
                  >
                    Chez nous
                  </th>
                  <th
                    scope="col"
                    className="p-4 font-heading font-semibold text-slate-500"
                  >
                    Ailleurs
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <motion.tr
                    key={i}
                    className="border-b border-white/10 bg-slate-800/40"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.3,
                      delay: reduceMotion ? 0 : i * 0.05,
                    }}
                  >
                    <td className="flex items-center gap-2 p-4 text-slate-700 dark:text-slate-300">
                      <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                      {row.us}
                    </td>
                    <td className="flex items-center gap-2 p-4 text-slate-500">
                      <X className="h-4 w-4 shrink-0 text-slate-400" />
                      {row.other}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </SectionWrapper>
      </main>
  );
}
