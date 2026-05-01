"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ScanlineBackgroundProps {
  children?: ReactNode;
  /** Intensité des scanlines (0 = désactivé) */
  intensity?: number;
  className?: string;
}

/**
 * Fond avec overlay scanlines type holographique (CSS).
 * Respecte prefers-reduced-motion en désactivant l’animation.
 */
export function ScanlineBackground({
  children,
  intensity = 0.03,
  className,
}: ScanlineBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,${intensity}) 2px,
            rgba(0,0,0,${intensity}) 4px
          )`,
        }}
      />
    </div>
  );
}
