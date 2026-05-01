"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UfoCtaButton } from "./UfoCtaButton";
import { Button } from "@/components/ui/button";
import { CtaLink } from "@/components/CtaLink";
import { cn } from "@/lib/utils";

export interface HeroHolographicProps {
  title?: string;
  slogan?: string;
  showScanlines?: boolean;
  className?: string;
}

const motionTransition = (duration: number, delay = 0) => ({
  duration,
  delay,
});

/**
 * Hero holographique : glow, scanlines optionnelles, slogan animé, double CTA
 */
export function HeroHolographic({
  title = "BoTooLogIA",
  slogan = "Le Futur dès aujourd'hui",
  showScanlines = true,
  className,
}: HeroHolographicProps) {
  const reduceMotion = useReducedMotion();
  const t = reduceMotion ? 0 : 0.6;
  const tDelay = (d: number) => motionTransition(t, d);
  return (
    <section
      className={cn(
        "relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-600/30 bg-[rgb(var(--background))] bg-holographic-gradient px-6 py-16 md:py-20",
        "shadow-[0_0_40px_rgba(0,212,255,0.06)]",
        showScanlines && "scanlines",
        className
      )}
      aria-labelledby="hero-title"
    >
      {/* Légère lueur centrale, bannière épurée thème IA */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-holographic-cyan/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 text-center max-w-4xl mx-auto">
        <motion.h1
          id="hero-title"
          className="font-heading text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tDelay(0)}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg text-slate-600 dark:text-slate-300 sm:text-xl md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tDelay(0.15)}
        >
          {slogan}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tDelay(0.3)}
        >
          <UfoCtaButton asLink href="/botohub#cta" size="lg" />
          <Button asChild variant="outline" size="lg">
            <CtaLink href="/botolab">BoTo Lab</CtaLink>
          </Button>
        </motion.div>
      </div>

      {/* Bordure glow basse */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-holographic-cyan/50 to-transparent"
        aria-hidden
      />
    </section>
  );
}
