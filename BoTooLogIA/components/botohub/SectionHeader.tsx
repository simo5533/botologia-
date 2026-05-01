"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { hubPageCopy } from "@/lib/seo/copy";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function SectionHeader() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="text-center mb-8 md:mb-10"
    >
      <motion.p
        variants={reduceMotion ? undefined : item}
        className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400/90"
      >
        {hubPageCopy.whyEyebrow}
      </motion.p>
      <motion.h2
        id="why-botohub-heading"
        variants={reduceMotion ? undefined : item}
        className={cn(
          "text-4xl md:text-5xl font-bold text-white tracking-tight font-heading",
          !reduceMotion && "animate-glow-pulse"
        )}
      >
        BoToHub
      </motion.h2>
      <motion.div
        variants={reduceMotion ? undefined : item}
        className="mt-3 space-y-1 text-xl md:text-2xl text-white/90 font-medium"
      >
        <p className="leading-snug">
          Nous cherchons les{" "}
          <span
            className="whitespace-nowrap text-cyan-400 font-semibold"
            style={{
              textShadow: "0 0 12px rgba(34,211,238,0.5), 0 0 24px rgba(34,211,238,0.25)",
            }}
          >
            PROBLÈMES&nbsp;!
          </span>
        </p>
        <p className="leading-snug">
          Nous avons beaucoup de{" "}
          <span
            className="whitespace-nowrap text-cyan-400 font-semibold"
            style={{
              textShadow: "0 0 12px rgba(34,211,238,0.5), 0 0 24px rgba(34,211,238,0.25)",
            }}
          >
            SOLUTIONS&nbsp;!
          </span>
        </p>
      </motion.div>
      <motion.p
        variants={reduceMotion ? undefined : item}
        className="mx-auto mt-6 max-w-2xl px-2 text-sm leading-relaxed text-slate-400 md:text-base"
      >
        {hubPageCopy.whyLead}
      </motion.p>
    </motion.div>
  );
}
