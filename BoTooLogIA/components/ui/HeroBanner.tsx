"use client";

import { useEffect, useRef } from "react";
import { defaultHeroLead } from "@/lib/seo/copy";
import { posterForVideoSrc } from "@/lib/seo/video-posters";

const BOUTON_CTA_LABEL = "Entrer dans le futur →";

const DEFAULT_VIDEO_SRC = "/videos/banner_BOTOLOOGIA.mp4";

export type HeroBannerProps = {
  videoSrc?: string;
  /** Poster affiché avant lecture (par défaut selon la vidéo) */
  poster?: string;
  sectionId?: string;
  eyebrow?: string;
  title?: string;
  pillText?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

/**
 * Bannière plein écran BoToHub : vidéo, overlay, titre centré, CTA, indicateur de scroll.
 * Props optionnelles pour BoToLab, BoToAdvantage, etc.
 */
export default function HeroBanner({
  videoSrc = DEFAULT_VIDEO_SRC,
  poster: posterProp,
  sectionId = "banner",
  eyebrow = "Agence IA",
  title = "BoTooLogIA",
  pillText = "Bot TooL Log IA",
  description = defaultHeroLead,
  primaryHref = "/botolink#section-creneau",
  primaryLabel = BOUTON_CTA_LABEL,
  secondaryHref = "#services",
  secondaryLabel = "Découvrir nos services",
}: HeroBannerProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const poster = posterProp ?? posterForVideoSrc(videoSrc);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [videoSrc]);

  return (
    <section
      id={sectionId}
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
    >
      <video
        ref={videoRef}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        aria-hidden
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 animate-fadeInUp text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400 opacity-0 [animation-delay:0.2s]">
          {eyebrow}
        </p>

        <h1 className="mb-4 animate-fadeInUp font-heading text-5xl font-black leading-tight text-white opacity-0 [animation-delay:0.4s] md:text-7xl">
          {title}
        </h1>

        <p
          className="title-gradient-animated mb-6 inline-flex items-center rounded-full border border-[#00d4ff]/40 bg-[#00d4ff]/10 px-4 py-2 font-heading text-xs font-semibold uppercase tracking-[0.28em] md:text-sm"
          style={{
            boxShadow:
              "0 0 24px rgba(0,212,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          aria-hidden
        >
          {pillText}
        </p>

        <p className="mb-10 max-w-2xl animate-fadeInUp text-lg font-light text-white/80 opacity-0 [animation-delay:0.6s] md:text-2xl">
          {description}
        </p>

        <div className="flex flex-col gap-4 opacity-0 animate-fadeInUp [animation-delay:0.8s] sm:flex-row">
          <a
            href={primaryHref}
            className="rounded-full bg-cyan-400 px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {primaryLabel}
          </a>
          <a
            href={secondaryHref}
            className="rounded-full border border-white/30 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-cyan-400 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {secondaryLabel}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 opacity-60">
        <span className="text-xs uppercase tracking-widest text-white">
          Défiler
        </span>
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-cyan-400 to-transparent" />
      </div>
    </section>
  );
}
