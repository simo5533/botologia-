"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import {
  Cpu,
  Zap,
  BarChart3,
  Eye,
  Compass,
  GraduationCap,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Cpu,
  Zap,
  BarChart3,
  Eye,
  Compass,
  GraduationCap,
};

export interface HolographicServiceCardProps {
  title: string;
  description: string;
  icon: string;
  className?: string;
}

/**
 * Carte service type tablette holographique — 3D tilt, glow au hover
 */
export function HolographicServiceCard({
  title,
  description,
  icon,
  className,
}: HolographicServiceCardProps) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glow = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(0,212,255,0.15), transparent 80%)`;

  const Icon = iconMap[icon] ?? Cpu;

  return (
    <motion.article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/20 bg-slate-800/60 backdrop-blur-xl p-6 md:p-8 transition-shadow duration-300 holographic-border",
        className
      )}
      onMouseMove={reduceMotion ? undefined : (e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: glow }}
        />
      )}
      <div className="relative z-10">
        <div className="mb-4 inline-flex rounded-xl bg-holographic-cyan/10 p-3 text-holographic-cyan">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </motion.article>
  );
}
