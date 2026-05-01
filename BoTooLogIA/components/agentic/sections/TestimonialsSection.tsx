"use client";

import { motion } from "framer-motion";

const easeSmooth = [0.25, 0.1, 0.25, 1];
const TESTIMONIALS = [
  {
    quote: "We cut our release cycle from two weeks to two days. The agents handle the boilerplate; we focus on product.",
    author: "Sarah Chen",
    role: "CTO, Flowstack",
  },
  {
    quote: "Tool calling and multi-agent planning just work. First platform that felt production-ready from day one.",
    author: "Marcus Webb",
    role: "Head of Eng, Nexus",
  },
  {
    quote: "Secure deploy with full audit trail was non-negotiable. They nailed it. Our compliance team is happy.",
    author: "Elena Voss",
    role: "VP Engineering, SecureShip",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-heading text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: easeSmooth }}
        >
          What teams say
        </motion.h2>
        <motion.p
          className="mt-3 text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          From startups to enterprises.
        </motion.p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.author}
              className="relative rounded-xl border border-agentic-glass-border bg-agentic-glass/60 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: easeSmooth }}
              style={{
                transform: `translateY(${i === 1 ? -8 : 0}px)`,
              }}
            >
              <p className="text-slate-300">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-medium text-white">{t.author}</p>
              <p className="text-xs text-slate-500">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
