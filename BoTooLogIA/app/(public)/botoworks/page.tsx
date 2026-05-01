"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper, sectionTitleGradientClass } from "@/components/layout/SectionWrapper";
import { ArrowUpRight } from "lucide-react";
import HoloCard from "@/components/effects/HoloCard";
import { cn } from "@/lib/utils";
import { VIDEO_POSTER } from "@/lib/seo/video-posters";

const BANNER_VIDEO_SRC = "/videos/banniere-botoworks.mp4";
const BOTOSQUAD_URL = "https://botosquad-main.vercel.app/";

const projects = [
  {
    id: "1",
    title: "Assistant client intelligent",
    domain: "Services",
    description: "Chatbot NLP pour support client avec réduction de 40% du temps de traitement.",
  },
  {
    id: "2",
    title: "Prédiction de demande",
    domain: "Retail",
    description: "Modèles de forecast pour optimisation des stocks et des approvisionnements.",
  },
  {
    id: "3",
    title: "Détection d'anomalies",
    domain: "Industrie",
    description: "Vision par ordinateur pour contrôle qualité en temps réel sur chaîne.",
  },
  {
    id: "4",
    title: "Recommandation personnalisée",
    domain: "E-commerce",
    description: "Système de recommandation multi-canal augmentant le panier moyen.",
  },
  {
    id: "5",
    title: "Automatisation documentaire",
    domain: "Legal",
    description: "Extraction et classification de documents pour cabinets juridiques.",
  },
  {
    id: "6",
    title: "Pilotage énergétique",
    domain: "Energy",
    description: "IA pour optimisation de la consommation et intégration renouvelables.",
  },
];

/**
 * BoToWorks — Vidéo en fond de la section réalisations (pas en début de page)
 */
export default function BoToWorksPage() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative w-full min-h-screen min-w-0 overflow-x-hidden">
      {/* Vidéo en fond de cette partie uniquement */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={VIDEO_POSTER.bannerWorks}
        className="absolute inset-0 z-0 h-full min-h-full w-full min-w-full object-cover object-center"
        aria-hidden
      >
        <source src={BANNER_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-[1] bg-black/20" />

      {/* Fond type verre dépoli : la vidéo reste visible à travers */}
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:py-12 lg:px-8">
        <div className="w-full min-w-0 rounded-2xl border border-white/20 bg-slate-900/50 px-4 py-8 shadow-2xl sm:px-6 sm:py-9 md:py-10 md:px-8 lg:px-10">
        <SectionWrapper
          title="BoToWorks"
          subtitle="Réalisations et projets emblématiques."
          headingLevel={1}
          titleGradient
          className="!bg-transparent !px-0 !py-6 sm:!py-8"
        >
      <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="flex h-full min-h-0"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.06 }}
          >
            <HoloCard className="group relative flex h-full min-h-[16rem] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/20 bg-slate-800/60 p-6 backdrop-blur-xl md:min-h-[17rem] md:p-8 holographic-border transition-all duration-300 hover:shadow-glow">
              <span className="block shrink-0 text-left text-xs font-medium uppercase tracking-wider text-white/80">
                {project.domain}
              </span>
              <h2
                className={cn(
                  "mt-2 w-full min-w-0 shrink-0 break-words text-left font-heading text-xl font-semibold leading-snug",
                  sectionTitleGradientClass,
                  "block"
                )}
              >
                {project.title}
              </h2>
              <p className="mt-3 min-h-0 flex-1 text-left text-sm text-white/75 leading-relaxed md:text-base">
                {project.description}
              </p>
              <a
                href={BOTOSQUAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-4 inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF]",
                  "bg-gradient-to-r from-[#00D2FF] via-[#A855F7] to-[#3B82F6]"
                )}
              >
                BoTosquad
                <ArrowUpRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              </a>
            </HoloCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
        </div>
      </div>
    </section>
  );
}
