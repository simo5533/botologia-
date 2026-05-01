"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ScanSweepLine } from "./ScanSweepLine";

const easeSmooth = [0.25, 0.1, 0.25, 1];
const STEPS = [
  { id: "perceive", label: "Perceive", desc: "Ingest context, logs, and specs from your stack." },
  { id: "plan", label: "Plan", desc: "Multi-agent orchestration and task decomposition." },
  { id: "act", label: "Act", desc: "Code generation, tool use, and deployment execution." },
  { id: "verify", label: "Verify", desc: "Tests, monitoring, and continuous improvement." },
];

export function AgentWorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/5 bg-gradient-to-b from-transparent via-luna-5/50 to-transparent px-6 py-24"
    >
      <ScanSweepLine sectionRef={sectionRef} />
      <div className="relative mx-auto max-w-5xl">
        <motion.h2
          className="font-heading text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: easeSmooth }}
        >
          Agent Workflow
        </motion.h2>
        <motion.p
          className="mt-3 text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          From perception to verification — one seamless pipeline.
        </motion.p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              className="relative overflow-hidden rounded-xl border border-agentic-glass-border bg-agentic-glass/80 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: easeSmooth }}
            >
              <span className="text-xs font-medium tracking-wider text-agentic-cyan/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-heading text-lg font-semibold text-white">
                {step.label}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden text-agentic-cyan/30 lg:inline">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
