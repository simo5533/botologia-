"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const easeSmooth = [0.25, 0.1, 0.25, 1];
const TERMINAL_LINES = [
  "$ agent deploy --env prod",
  "► Perceive: reading spec and repo...",
  "► Plan: 3 agents assigned (backend, frontend, infra)",
  "► Act: generating code...",
  "  ✓ 12 files updated",
  "► Verify: running tests...",
  "  ✓ 47 passed",
  "► Deploying to prod...",
  "  ✓ Live in 12s",
  "",
];

const CHART_POINTS = [40, 55, 48, 72, 65, 88, 78];

export function LiveDemoSection() {
  const [lineIndex, setLineIndex] = useState(0);
  const [typedLine, setTypedLine] = useState("");

  useEffect(() => {
    if (lineIndex >= TERMINAL_LINES.length) return;
    const line = TERMINAL_LINES[lineIndex];
    let i = 0;
    const id = setInterval(() => {
      if (i <= line.length) {
        setTypedLine(line.slice(0, i));
        i++;
      } else {
        clearInterval(id);
        setTimeout(() => {
          setLineIndex((prev) => prev + 1);
          setTypedLine("");
        }, lineIndex === TERMINAL_LINES.length - 1 ? 2000 : 400);
      }
    }, 40);
    return () => clearInterval(id);
  }, [lineIndex]);

  return (
    <section
      id="live-demo"
      className="relative border-t border-white/5 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-heading text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: easeSmooth }}
        >
          Live demo
        </motion.h2>
        <motion.p
          className="mt-3 text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          See agents plan, act, and deploy in real time.
        </motion.p>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Fake terminal */}
          <motion.div
            className="overflow-hidden rounded-xl border border-agentic-glass-border bg-[#0a0e14] font-mono text-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeSmooth }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-red-500/80" />
              <span className="h-2 w-2 rounded-full bg-amber-500/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs text-slate-500">agent-cli</span>
            </div>
            <div className="min-h-[240px] p-4">
              {TERMINAL_LINES.slice(0, lineIndex).map((l, i) => (
                <div key={i} className="text-slate-400">
                  {l || " "}
                </div>
              ))}
              <div className="text-agentic-cyan">
                {typedLine}
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </motion.div>

          {/* Fake dashboard chart */}
          <motion.div
            className="overflow-hidden rounded-xl border border-agentic-glass-border bg-agentic-glass/60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeSmooth }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Deployments</span>
              <span className="text-xs text-agentic-cyan">Last 7 days</span>
            </div>
            <div className="mt-6 flex h-32 items-end justify-between gap-2">
              {CHART_POINTS.map((p, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t bg-agentic-cyan/30"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${p}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.05, ease: easeSmooth }}
                  style={{ minHeight: 8 }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Mon</span>
              <span>Sun</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
