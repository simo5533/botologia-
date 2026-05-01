"use client";

import { type ReactNode } from "react";
import Tilt from "react-parallax-tilt";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FloatingCard3DProps {
  children: ReactNode;
  className?: string;
  /** Désactiver le tilt (ex. reduced-motion) */
  disableTilt?: boolean;
  /** Perspective en px (effet 3D) */
  perspective?: number;
  /** Angle max en degrés */
  tiltMax?: number;
  glareBorderRadius?: string;
}

/**
 * Carte avec micro-effet 3D au survol (parallax tilt) + glassmorphism.
 * Cohérent avec le design system holographique cyan/glass.
 */
export function FloatingCard3D({
  children,
  className,
  disableTilt,
  perspective = 800,
  tiltMax = 8,
  glareBorderRadius = "1rem",
}: FloatingCard3DProps) {
  const reduceMotion = useReducedMotion();
  const noTilt = disableTilt ?? reduceMotion;

  const content = (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-slate-800/70 backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(0,212,255,0.12),0_8px_32px_rgba(0,0,0,0.08)]",
        "hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]",
        "transition-shadow duration-300",
        className
      )}
    >
      {children}
    </div>
  );

  if (noTilt) return content;

  return (
    <Tilt
      tiltMaxAngleX={tiltMax}
      tiltMaxAngleY={tiltMax}
      perspective={perspective}
      glareEnable
      glareMaxOpacity={0.12}
      glareColor="#00d4ff"
      glarePosition="all"
      glareBorderRadius={glareBorderRadius}
      scale={1.02}
    >
      {content}
    </Tilt>
  );
}
