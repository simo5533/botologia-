"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CtaVortexProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * CTA avec halo lumineux animé et effet vortex subtil au hover.
 * Respecte reduced-motion (pas d'animation du halo).
 */
export function CtaVortex({ href, children, className }: CtaVortexProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="relative inline-flex"
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Halo / anneau énergie (derrière le bouton) */}
      {!reduceMotion && (
        <span
          className="absolute -inset-1 rounded-2xl bg-[#7dd3fc]/20 blur-md animate-portal-energy-ring pointer-events-none"
          aria-hidden
        />
      )}
      <Link
        href={href}
        className={cn(
          "relative z-10 inline-flex items-center justify-center rounded-xl border px-8 py-4 font-semibold backdrop-blur-sm",
          "border-[#7dd3fc]/40 bg-[#0c1222]/80 text-[#7dd3fc]",
          "transition-all duration-200",
          "hover:border-[#7dd3fc]/70 hover:bg-[#0c1222]/95 hover:shadow-[0_0_24px_rgba(125,211,252,0.25)]",
          "focus:outline-none focus:ring-2 focus:ring-[#7dd3fc]/50 focus:ring-offset-2 focus:ring-offset-black",
          "dimension-portal-cta-vortex",
          className
        )}
      >
        {children}
      </Link>
    </motion.span>
  );
}
