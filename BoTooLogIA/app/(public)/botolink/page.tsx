"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DevisForm } from "@/components/devis/DevisForm";
import { sectionTitleGradientClass } from "@/components/layout/SectionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { isExternalCreneauLink, resolveCreneauHref } from "@/lib/booking";
import { VIDEO_POSTER } from "@/lib/seo/video-posters";

/**
 * BoToLink — Hero (titre + 2 boutons scroll) → Section formulaire (fond opaque) → Section créneau.
 */
export default function BoToLinkPage() {
  const reduceMotion = useReducedMotion();
  const motionDuration = reduceMotion ? 0 : 0.5;
  const videoRef = useRef<HTMLVideoElement>(null);
  const creneauHref = resolveCreneauHref();
  const creneauExternal = isExternalCreneauLink();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <>
      {/* Hero — z-index bas, position relative */}
      <section
        className="hero-section min-h-screen flex flex-col"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        <video
          ref={videoRef}
          poster={VIDEO_POSTER.bannerBoToLink}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{ objectPosition: "center center" }}
          aria-hidden
        >
          <source src="/videos/Fond-BoToLink.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "rgba(4,6,15,0.75)" }}
          aria-hidden
        />

        <div className="relative z-[2] flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-16" role="main">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionDuration }}
          >
            <h1
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className={sectionTitleGradientClass}>BoToLink</span>
            </h1>
            <p className="mt-5 text-xl md:text-2xl font-semibold text-cyan-200/95">
              Connectons votre business à l&apos;intelligence artificielle
            </p>
            <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">
              Une question ? Un projet ? Besoin d&apos;une solution intelligente ?
              <br />
              Notre équipe est à votre écoute pour vous accompagner dans votre
              transformation digitale IA.
            </p>

            <div className="hero-cta-row mt-8 flex flex-wrap gap-4 justify-center">
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("section-formulaire")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="btn-hero-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#00c8ff] hover:bg-[#00a8dd] transition-colors"
              >
                <span>🚀</span>
                <span>Entrer dans le futur</span>
                <span className="btn-arrow">→</span>
              </button>
              <Link
                href="/botolab"
                className="btn-hero-secondary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#00c8ff] border border-[#00c8ff]/50 bg-transparent hover:bg-[#00c8ff]/10 transition-colors"
              >
                <span>BoTo Lab</span>
              </Link>
            </div>

            {/* Nos Coordonnées */}
            <div
              className="mt-12 pt-8 border-t border-white/10 text-left max-w-md mx-auto"
              style={{ pointerEvents: "auto" }}
            >
              <h2 className="text-sm font-semibold text-cyan-400/90 uppercase tracking-wider flex items-center gap-2">
                <span aria-hidden>📍</span> Nos Coordonnées
              </h2>
              <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed flex items-start gap-2">
                <span className="text-cyan-400/80 shrink-0" aria-hidden>📌</span>
                <span>
                  <strong className="text-white/90">Adresse :</strong>
                  <br />
                  Appt N°10, 4ème étage, Imm 7, Rue Moulay Rachid, Hassan – Rabat, Maroc
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section formulaire — z-index élevé, fond OPAQUE */}
      <section
        id="section-formulaire"
        style={{
          position: "relative",
          zIndex: 10,
          background: "#04060f",
          borderTop: "1px solid rgba(0,200,255,0.1)",
          paddingTop: "80px",
          paddingBottom: "80px",
          isolation: "isolate",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "rgba(0,200,255,0.7)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "12px",
              }}
            >
              ● Votre projet IA
            </span>
            <h2
              className="font-heading m-0 mb-4 text-center text-transparent font-black tracking-tight"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              <span className={sectionTitleGradientClass}>Décrivez votre projet</span>
            </h2>
            <p className="m-0 text-base leading-[1.65] text-[#e2e8f0]/90">
              Remplissez ce formulaire en 4 étapes. Notre équipe vous répond sous
              24h.
            </p>
          </div>

          <DevisForm />
        </div>
      </section>

      {/* Section créneau */}
      <section
        id="section-creneau"
        style={{
          position: "relative",
          zIndex: 10,
          background: "#04060f",
          borderTop: "1px solid rgba(0,200,255,0.1)",
          paddingTop: "48px",
          paddingBottom: "80px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div
            className="rounded-2xl border border-white/20 bg-slate-800/60 backdrop-blur-xl p-6 md:p-8"
            style={{ borderColor: "rgba(0,200,255,0.1)" }}
          >
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">
              Réserver un créneau
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Choisissez votre date et heure directement dans le formulaire
              « Décrivez votre projet » (dernière étape), avant l&apos;envoi. Un
              expert vous confirmera l&apos;appel de 30 min sans engagement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-holographic-cyan hover:bg-holographic-cyan/10"
              >
                <a href="#section-formulaire">
                  <Calendar className="mr-2 h-4 w-4" aria-hidden />
                  Ouvrir le formulaire avec calendrier
                </a>
              </Button>
              {creneauExternal ? (
                <Button asChild variant="ghost" size="lg" className="text-slate-300">
                  <a
                    href={creneauHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Agenda en ligne
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
