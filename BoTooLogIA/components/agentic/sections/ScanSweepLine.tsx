"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const easeSmooth = [0.25, 0.1, 0.25, 1];

export function ScanSweepLine({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: (sectionRef as React.RefObject<HTMLElement>) ?? undefined,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 0.6, 0.6, 0]);
  const scaleY = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  return (
    <motion.div
      className="pointer-events-none absolute left-0 right-0 h-px overflow-hidden"
      style={{ opacity }}
      aria-hidden
    >
      <motion.div
        className="h-full w-full origin-top bg-gradient-to-b from-transparent via-agentic-cyan/50 to-transparent"
        style={{ scaleY }}
        transition={{ type: "tween", duration: 0.6, ease: easeSmooth }}
      />
    </motion.div>
  );
}
