"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("splashShown")) {
      setShow(false);
      return;
    }
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2500);
    const t4 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("splashShown", "1");
    }, 3200);
    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-[#04060f] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Grille futuriste */}
          <div
            className="absolute inset-0 opacity-10 animate-grid-move"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,200,255,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,200,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Cercles orbitaux */}
          <div
            className="absolute w-64 h-64 rounded-full border border-cyan-400/10 animate-spin"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute w-96 h-96 rounded-full border border-purple-400/10 animate-spin"
            style={{ animationDuration: "12s", animationDirection: "reverse" }}
          />
          <div
            className="absolute w-[32rem] h-[32rem] rounded-full border border-cyan-400/5 animate-spin"
            style={{ animationDuration: "20s" }}
          />

          {/* Logo */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl shadow-2xl shadow-cyan-500/50">
                🤖
              </div>
              <div className="absolute -inset-2 rounded-2xl bg-cyan-400/20 animate-ping" />
            </div>

            <motion.h1
              className="text-5xl font-black text-white tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              BoToo<span className="text-cyan-400">Log</span>IA
            </motion.h1>

            <motion.p
              className="text-cyan-400/70 text-sm font-mono tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
            >
              Agence IA • ChatBot & Automatisation
            </motion.p>

            <motion.div
              className="w-48 h-px bg-white/10 rounded overflow-hidden mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                initial={{ width: "0%" }}
                animate={{ width: phase >= 3 ? "100%" : "60%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p
              className="text-white/20 text-xs font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
            >
              {phase < 3 ? "Initialisation..." : "Prêt ✓"}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
