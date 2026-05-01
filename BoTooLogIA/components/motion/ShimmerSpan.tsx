"use client";

import { useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerSpanProps {
  children: ReactNode;
  className?: string;
}

/**
 * Mot ou phrase avec effet holographic shimmer (dégradé animé).
 * Désactivé si prefers-reduced-motion.
 */
export function ShimmerSpan({ children, className }: ShimmerSpanProps) {
  const reduceMotion = useReducedMotion();

  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-[length:200%_100%]",
        "bg-gradient-to-r from-[#7dd3fc] via-[#00d4ff] to-[#7dd3fc]",
        !reduceMotion && "animate-shimmer dimension-shimmer",
        className
      )}
      style={reduceMotion ? undefined : { backgroundPosition: "200% 0" }}
    >
      {children}
    </span>
  );
}
