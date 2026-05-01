"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { AgenticSceneCanvas } from "./AgenticSceneCanvas";
import { HeroOverlay } from "./HeroOverlay";

const DynamicCanvas = dynamic(() => Promise.resolve(AgenticSceneCanvas), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#060a12]">
      <div className="h-10 w-10 animate-pulse rounded-full border-2 border-agentic-cyan/50" />
    </div>
  ),
});

export function AgenticHeroSection() {
  const reduceMotion = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scanSweep, setScanSweep] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: -(e.clientY / window.innerHeight - 0.5) * 2,
    });
  }, []);

  const handleScroll = useCallback(() => {
    const hero = document.getElementById("agentic-hero");
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.8)));
    setScrollProgress(progress);
  }, []);

  const handleClick = useCallback(() => {
    setScanSweep(1);
    setTimeout(() => setScanSweep(0), 800);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  return (
    <section
      id="agentic-hero"
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0">
        <DynamicCanvas
          mouse={mouse}
          scrollProgress={scrollProgress}
          scanSweep={scanSweep}
          disableEffects={!!reduceMotion}
        />
      </div>
      <HeroOverlay onCtaClick={handleClick} scanSweep={scanSweep} />
    </section>
  );
}
