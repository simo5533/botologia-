"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type Lenis from "lenis";

/** Remonte la vue en haut (Lenis si actif + fallback natif). */
type ScrollToTopFn = () => void;

const LenisScrollContext = createContext<ScrollToTopFn | null>(null);

export function useLenisScrollToTop(): ScrollToTopFn | null {
  return useContext(LenisScrollContext);
}

/**
 * Enveloppe Lenis pour le smooth scroll (chargement dynamique, pas de SSR).
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const rafRef = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  const scrollToTop = useCallback(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }
      rafRef.current = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisScrollContext.Provider value={scrollToTop}>
      {children}
    </LenisScrollContext.Provider>
  );
}
