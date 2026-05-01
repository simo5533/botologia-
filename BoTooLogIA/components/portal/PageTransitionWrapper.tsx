"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const defaultPageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(6px)",
  },
};

const reducedPageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export interface PageTransitionWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper pour transitions de page type "teleport" : fade spatial + micro blur.
 * À envelopper autour du contenu des pages (layout ou par page).
 * Respecte prefers-reduced-motion (simple fade).
 */
export function PageTransitionWrapper({ children, className }: PageTransitionWrapperProps) {
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? reducedPageVariants : defaultPageVariants;

  return (
    <motion.div
      className={cn("min-h-full w-full min-w-0", className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{
        duration: reduceMotion ? 0.2 : 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
