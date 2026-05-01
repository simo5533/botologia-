"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { DynamicSceneCanvas } from "@/components/scene";
import { HolographicSceneContent } from "@/components/scene";
import { ScanlineBackground } from "@/components/holographic";

/**
 * Section Hero avec fond 3D (orbes + grille) chargé dynamiquement.
 * Ne monte le canvas que lorsque la section est dans le viewport (performance).
 * Désactive les effets postprocessing si prefers-reduced-motion.
 */
export function Hero3DBackground() {
  const reduceMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted || !ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "100px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted]);

  return (
    <section
      ref={ref}
      className="relative min-h-[50vh] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-[rgb(var(--background))]"
      aria-hidden
    >
      <ScanlineBackground intensity={0.025} className="absolute inset-0">
        {inView && (
          <DynamicSceneCanvas
            disableEffects={!!reduceMotion}
            dprMax={1.5}
            className="absolute inset-0"
            camera={{ position: [0, 0, 4], fov: 50 }}
          >
            <HolographicSceneContent />
          </DynamicSceneCanvas>
        )}
      </ScanlineBackground>
    </section>
  );
}
