"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Arrière-plan type portail dimension : gradient radial cyan, overlay fade bottom, particules flottantes.
 * Désactivé sur mobile (particules) et si prefers-reduced-motion.
 */
export function PortalBackground({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const showParticles = !reduceMotion && !isMobile;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* Radial gradient cyan subtil */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: "radial-gradient(circle at center, rgba(6, 182, 212, 0.15), transparent 70%)",
        }}
      />
      {/* Overlay gradient fade bottom */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: "linear-gradient(to top, rgba(11, 18, 32, 0.85) 0%, transparent 50%)",
        }}
      />
      {/* 6 particules flottantes animées en CSS */}
      {showParticles &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan-400/60"
            style={{
              left: `${15 + i * 16}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: "float 5s ease-in-out infinite",
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
    </div>
  );
}
