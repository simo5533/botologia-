"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DimensionPortalBackgroundProps {
  className?: string;
  /** Désactiver les particules (ex. mobile) */
  disableParticles?: boolean;
}

/**
 * Arrière-plan Hero dimension portal : étoiles CSS, scanlines, gradient spatial.
 * Léger (pas de Three.js ici), respecte reduced-motion et mobile.
 */
export function DimensionPortalBackground({
  className,
  disableParticles: disableParticlesProp = false,
}: DimensionPortalBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  const showParticles = !disableParticlesProp && !isMobile && !reduceMotion;

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      aria-hidden
    >
      {/* Gradient spatial animé très subtil */}
      <div
        className={cn(
          "absolute inset-0 bg-dimension-portal-gradient bg-[length:100%_100%]",
          !reduceMotion && "animate-pulse-glow"
        )}
        style={{ animationDuration: "4s" }}
      />
      {/* Lignes holographiques verticales (scanlines) */}
      {!reduceMotion && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 212, 255, 0.6) 2px,
              rgba(0, 212, 255, 0.6) 3px
            )`,
            backgroundSize: "60px 100%",
            animation: "shimmer 8s linear infinite",
          }}
        />
      )}
      {/* Champ d'étoiles (particules CSS) */}
      {showParticles && (
        <div className="absolute inset-0">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#7dd3fc] opacity-60"
              style={{
                left: `${(i * 7 + 13) % 100}%`,
                top: `${(i * 11 + 31) % 100}%`,
                animation: "pulse-glow 2s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
