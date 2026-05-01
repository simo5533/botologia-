"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const easeSmooth = [0.25, 0.1, 0.25, 1];
const FEATURES = [
  { title: "Multi-Agent Orchestration", desc: "Agents collaborate with clear roles and handoffs.", icon: "◇" },
  { title: "Tool Calling", desc: "APIs, DBs, and external tools with type-safe wrappers.", icon: "⚡" },
  { title: "Code Generation", desc: "Full-stack code from specs with tests and docs.", icon: "⌘" },
  { title: "Secure Deploy", desc: "One-click deploy with audit logs and rollback.", icon: "◆" },
  { title: "Live Monitoring", desc: "Traces, metrics, and alerts in one dashboard.", icon: "▣" },
  { title: "Self-Improvement", desc: "Agents learn from production and suggest patches.", icon: "◎" },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-heading text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: easeSmooth }}
        >
          Built for production
        </motion.h2>
        <motion.p
          className="mt-3 text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Six pillars of the agentic stack.
        </motion.p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
  index,
}: {
  title: string;
  desc: string;
  icon: string;
  index: number;
}) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);
  const tiltX = (mouse.y - 0.5) * -10;
  const tiltY = (mouse.x - 0.5) * 10;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl border border-agentic-glass-border bg-agentic-glass/80 p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4 }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setMouse({ x: 0.5, y: 0.5 })}
      style={{
        transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        boxShadow: "0 0 0 1px rgba(0,229,255,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-70"
        style={{
          background: `radial-gradient(circle 120px at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(0,229,255,0.12) 0%, transparent 70%)`,
        }}
      />
      <span className="relative text-2xl text-agentic-cyan/80">{icon}</span>
      <h3 className="relative mt-3 font-heading text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="relative mt-2 text-sm text-slate-400">{desc}</p>
    </motion.div>
  );
}
