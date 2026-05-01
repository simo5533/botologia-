"use client";

import { motion } from "framer-motion";

const easeSmooth = [0.25, 0.1, 0.25, 1];

export function FinalCtaSection() {
  return (
    <section className="relative border-t border-white/5 px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-t from-agentic-cyan/5 to-transparent" />
      <motion.div
        className="relative mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: easeSmooth }}
      >
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Teleport your team into the future.
        </h2>
        <p className="mt-6 text-slate-400">
          One deploy away. Book a demo and see agents build, ship, and improve for you.
        </p>
        <motion.a
          href="#agentic-hero"
          data-cursor-magnetic
          className="mt-10 inline-block rounded-lg border border-agentic-cyan/50 bg-agentic-cyan/10 px-10 py-4 font-medium text-agentic-cyan backdrop-blur-sm transition-colors hover:bg-agentic-cyan/20 hover:border-agentic-cyan"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "tween", duration: 0.2, ease: easeSmooth }}
        >
          Book a Demo
        </motion.a>
      </motion.div>
    </section>
  );
}
