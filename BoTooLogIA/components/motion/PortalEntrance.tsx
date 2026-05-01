"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const defaultEntrance = {
  initial: { opacity: 0, scale: 0.85, filter: "blur(8px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
};

const reducedEntrance = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

export interface PortalEntranceProps {
  children: ReactNode;
  className?: string;
  /** Délai en secondes avant le début de l'animation */
  delay?: number;
}

/**
 * Entrée type "Dimension Portal" : fade + scale 0.85 → 1 + blur radial.
 * Respecte prefers-reduced-motion (fade simple).
 */
export function PortalEntrance({ children, className, delay = 0 }: PortalEntranceProps) {
  const reduceMotion = useReducedMotion();
  const config = reduceMotion ? reducedEntrance : { ...defaultEntrance, transition: { ...defaultEntrance.transition, delay } };

  return (
    <motion.div
      className={cn("dimension-portal-scope", className)}
      initial={config.initial}
      animate={config.animate}
      transition={config.transition}
    >
      {children}
    </motion.div>
  );
}
