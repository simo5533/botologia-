"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PortalEntrance, GlitchTitle, ShimmerSpan } from "@/components/motion";
import { DimensionPortalBackground, CtaVortex } from "@/components/effects";
import { cn } from "@/lib/utils";

const BANNER_SRC = "/images/banner-botologila.jpg";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative flex min-h-[100vh] w-full items-center justify-center overflow-hidden bg-[#050508] dimension-portal-scope"
      aria-label="Hero BoToHub"
    >
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <Image
            src={BANNER_SRC}
            alt="BoTooLogIA — Agence IA, ChatBot & Automatisation"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/65" aria-hidden />
      <DimensionPortalBackground />
      <PortalEntrance
        delay={0.1}
        className="relative z-10 flex w-full flex-col items-center justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16 md:pb-20 lg:pb-24"
      >
        {/* Bloc écriture en bas — bien structuré */}
        <div className="mx-auto w-full max-w-3xl text-center">
          {/* Titre principal */}
          <div
            className={cn(
              "relative inline-block rounded-2xl px-6 py-2",
              !reduceMotion && "animate-dimension-glow-pulse"
            )}
            style={
              !reduceMotion
                ? {
                    boxShadow: "0 0 40px rgba(0, 212, 255, 0.2), 0 0 80px rgba(0, 212, 255, 0.1)",
                  }
                : undefined
            }
          >
            <GlitchTitle>BoToHub</GlitchTitle>
          </div>

          {/* Sous-titre — deux lignes bien séparées */}
          <motion.div
            className="mt-6 space-y-2 sm:mt-8 sm:space-y-3"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.4 }}
          >
            <p className="text-lg font-medium leading-relaxed text-white/95 sm:text-xl md:text-2xl">
              Nous cherchons les{" "}
              <ShimmerSpan className="inline-block whitespace-nowrap font-semibold">PROBLÈMES&nbsp;!</ShimmerSpan>
            </p>
            <p className="text-lg font-medium leading-relaxed text-white/95 sm:text-xl md:text-2xl">
              Nous avons les{" "}
              <ShimmerSpan className="inline-block whitespace-nowrap font-semibold">SOLUTIONS&nbsp;!</ShimmerSpan>
            </p>
          </motion.div>

          {/* CTA — espacement net */}
          <motion.div
            className="mt-8 sm:mt-10"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.7 }}
          >
            <CtaVortex href="#services">Découvrir nos solutions</CtaVortex>
          </motion.div>
        </div>
      </PortalEntrance>
    </section>
  );
}
