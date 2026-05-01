"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UfoCtaButton } from "./UfoCtaButton";
import { Button } from "@/components/ui/button";
import { CtaLink } from "@/components/CtaLink";

/**
 * Bloc CTA affiché sur toutes les pages publiques (sauf BoToAdmin)
 * Double CTA : Entrer dans le futur (principal + secondaire)
 */
export function PublicCtaBlock() {
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="cta"
      className="relative mx-4 mb-8 min-w-0 max-w-7xl overflow-hidden rounded-2xl border border-white/20 bg-holographic-gradient px-4 py-12 sm:mx-6 sm:px-6 md:mx-auto md:px-8 md:py-16 lg:px-8 lg:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08)_0%,transparent_70%)]" />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
      >
        <h2
          id="cta-heading"
          className="font-heading text-2xl font-bold text-slate-900 dark:text-white md:text-3xl"
        >
          Prêt à embarquer ?
        </h2>
        <p className="max-w-lg text-slate-600 dark:text-slate-400">
          Rejoignez le futur avec BoTooLogIA. Nos experts vous accompagnent.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <UfoCtaButton asLink href="/botohub#cta" size="lg" />
          <Button asChild variant="outline" size="lg">
            <CtaLink href="/botolab">BoTo Lab</CtaLink>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
