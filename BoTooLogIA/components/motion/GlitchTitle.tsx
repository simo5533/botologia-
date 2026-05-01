"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface GlitchTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

/**
 * Titre avec glitch futuriste très léger à l'apparition (offset RGB subtil).
 * Respecte reduced-motion : pas de glitch.
 */
export function GlitchTitle({ children, className, as: Tag = "h1" }: GlitchTitleProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div className={cn("relative inline-block", className)}>
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="absolute inset-0 font-heading font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl opacity-20 mix-blend-screen pointer-events-none"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.12, 0, 0.08, 0],
            x: [0, -2, 2, 0, 0],
            y: [0, 1, -1, 0, 0],
          }}
          transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.7, 1] }}
          style={{
            color: "#00d4ff",
            textShadow: "2px 0 rgba(255,0,170,0.4), -2px 0 rgba(0,212,255,0.5)",
          }}
        >
          {children}
        </motion.span>
      )}
      <motion.span
        className="relative block"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0.97 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.12 }}
      >
        <Tag className="font-heading text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">{children}</Tag>
      </motion.span>
    </motion.div>
  );
}
