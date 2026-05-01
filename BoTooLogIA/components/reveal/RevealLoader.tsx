"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REVEAL_STORAGE_KEY = "botoologia-reveal-shown";

/**
 * Overlay reveal inspiré du thème CODE (11) — Landing Page Reveal.
 * Compteur 0-100%, logo BoTooLogIA, bande d'images, fade-out.
 * Palette harmonisée : crème #e6e0d8 + cyan BoTooLogIA.
 */
export function RevealLoader() {
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const [phase, setPhase] = useState<"counter" | "logo">("counter");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shown = sessionStorage.getItem(REVEAL_STORAGE_KEY);
    if (shown === "1") {
      setVisible(false);
      return;
    }
    setVisible(true);

    // Compteur 0-100%
    const counterInterval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(counterInterval);
          setPhase("logo");
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 80);

    return () => clearInterval(counterInterval);
  }, []);

  const onLogoComplete = () => {
    setTimeout(() => {
      sessionStorage.setItem(REVEAL_STORAGE_KEY, "1");
      setVisible(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="reveal-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-reveal-cream"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
        <div className="w-full max-w-lg px-8">
          {/* Bande d'images (loader.jpg) — CODE (11) */}
          <motion.div
            className="relative h-[280px] overflow-hidden md:h-[380px]"
            initial="hidden"
            animate={phase === "counter" ? "hidden" : "visible"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <div className="relative mx-auto flex h-full w-[80%] items-stretch gap-2 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="relative flex-1 overflow-hidden"
                  variants={{
                    hidden: { x: "-110%" },
                    visible: { x: 0 },
                  }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- image décorative fixe, pas besoin d'optimisation next/image */}
                  <img
                    src="/images/reveal/loader.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Compteur + Logo */}
          <div className="relative mt-4 overflow-hidden">
            {phase === "counter" && (
              <motion.div
                className="font-reveal text-center text-[clamp(4rem,18vw,12rem)] font-medium uppercase leading-none text-reveal-dark"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -80 }}
                transition={{ duration: 0.5 }}
              >
                {Math.min(counter, 100)}%
              </motion.div>
            )}
            {phase === "logo" && (
              <motion.div
                className="font-reveal text-center text-[clamp(3rem,12vw,8rem)] font-medium uppercase leading-none text-reveal-dark"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                onAnimationComplete={onLogoComplete}
              >
                BoTooLogIA
              </motion.div>
            )}
          </div>

          {/* Accent cyan subtil — harmonisation BoTooLogIA */}
          <div className="mt-4 h-px w-full max-w-[120px] mx-auto bg-gradient-to-r from-transparent via-holographic-cyan/40 to-transparent" />
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
