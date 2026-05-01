"use client";

import { motion } from "framer-motion";

const CHIPS = ["Multi-Agent", "Tool Calling", "Secure Deploy"];

const easeSmooth = [0.25, 0.1, 0.25, 1];

export function HeroOverlay({
  onCtaClick,
  scanSweep,
}: {
  onCtaClick?: () => void;
  scanSweep?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      {/* Micro HUD / scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.5) 2px, rgba(0,229,255,0.5) 3px)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-agentic-cyan/30 to-transparent opacity-60"
        aria-hidden
      />

      <div className="pointer-events-auto flex max-w-4xl flex-col items-center text-center">
        {/* Eye-scan HUD line behind headline (subtle) */}
        <div
          className="pointer-events-none absolute left-1/2 top-[42%] h-px w-[min(90vw,420px)] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-agentic-cyan/40 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: easeSmooth, delay: 0.3 }}
            style={{ originX: 0.5 }}
          />
          <div className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-agentic-cyan/30" />
        </div>

        <motion.h1
          className="relative font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: easeSmooth }}
          style={{
            textShadow: `0 0 40px rgba(0, 229, 255, ${0.15 + (scanSweep ?? 0) * 0.2})`,
          }}
        >
          Agentic AI that builds,
          <br />
          ships, and improves your product.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-base text-slate-400 sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: easeSmooth }}
        >
          Multi-agent planning, tool use, code generation, deployment, monitoring
          — end-to-end.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: easeSmooth }}
        >
          <motion.button
            data-cursor-magnetic
            onClick={onCtaClick}
            className="group relative overflow-hidden rounded-lg border border-agentic-cyan/50 bg-agentic-cyan/10 px-8 py-4 font-medium text-agentic-cyan backdrop-blur-sm transition-colors hover:bg-agentic-cyan/20 hover:border-agentic-cyan"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "tween", duration: 0.2, ease: easeSmooth }}
          >
            <span className="relative z-10">Book a Demo</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-agentic-cyan/30 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: easeSmooth }}
            />
            <span
              className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                boxShadow: "inset 0 0 30px rgba(0, 229, 255, 0.15)",
              }}
            />
          </motion.button>
          <motion.a
            href="#live-demo"
            data-cursor-magnetic
            className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "tween", duration: 0.2, ease: easeSmooth }}
          >
            Watch Live Agents
          </motion.a>
        </motion.div>

        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1, ease: easeSmooth }}
        >
          {CHIPS.map((label, _i) => (
            <span
              key={label}
              className="rounded-full border border-agentic-glass-border bg-agentic-glass px-4 py-1.5 text-xs font-medium tracking-wider text-agentic-cyan/90 backdrop-blur-sm"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
