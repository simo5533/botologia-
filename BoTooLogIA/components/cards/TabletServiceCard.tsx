"use client";

import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { trackAnalytics } from "@/lib/analytics";
import {
  Cpu,
  Bot,
  Settings,
  BarChart3,
  ClipboardList,
  Globe,
  Headphones,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CardVideoBackground } from "@/components/ui/CardVideoBackground";

/** Même vidéo que toutes les cartes — fond carte service */
const CARD_VIDEO_SRC = "/videos/fond-carte-service.mp4";

const iconMap: Record<string, LucideIcon> = {
  Cpu,
  Bot,
  Settings,
  BarChart3,
  ClipboardList,
  Globe,
  Headphones,
};

export interface TabletServiceCardProps {
  title: string;
  description: string;
  icon: string;
  className?: string;
}

/**
 * Carte service en forme de tablette holographique — cadre type écran, glow
 */
export function TabletServiceCard({
  title,
  description,
  icon,
  className,
}: TabletServiceCardProps) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(rotateYValue, { stiffness: 300, damping: 25 });
  const glow = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(0,212,255,0.12), transparent 70%)`;
  const Icon = iconMap[icon] ?? Cpu;
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = reduceMotion
    ? undefined
    : (e: React.MouseEvent<HTMLElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
        rotateXValue.set(-y * 4);
        rotateYValue.set(x * 4);
      };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    rotateXValue.set(0);
    rotateYValue.set(0);
    setHovered(false);
  };
  const handleMouseEnter = () => setHovered(true);

  const handleClick = () => {
    if (typeof window !== "undefined") {
      trackAnalytics({
        page: window.location.pathname || "/",
        event: "service_click",
        metadata: { service: title },
      });
    }
  };

  return (
    <motion.article
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Voir le service ${title}`}
      className={cn(
        "group relative flex-shrink-0 w-[280px] md:w-[320px] rounded-[1.75rem] overflow-hidden",
        "border-2 border-reveal-cream/40 dark:border-white/20",
        "shadow-[0_0_0_1px_rgba(0,212,255,0.15),0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]",
        "hover:shadow-[0_0_20px_rgba(0,212,255,0.2),0_0_40px_rgba(0,212,255,0.1),inset_0_0_30px_rgba(0,212,255,0.03)]",
        "transition-shadow duration-300 robotic-steel-reflection",
        "dimension-micro-grid",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Fond vidéo carte — même vidéo que toutes les cartes */}
      <CardVideoBackground
        videoSrc={CARD_VIDEO_SRC}
        overlayOpacity={0.82}
        className="absolute inset-0 z-0"
      />
      {/* Light sweep au hover (une seule fois par survol) */}
      {!reduceMotion && hovered && (
        <div
          key="sweep"
          className="pointer-events-none absolute inset-0 z-[1] w-1/2 dimension-light-sweep"
          aria-hidden
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.1) 50%, transparent 100%)",
            animation: "light-sweep 2s ease-in-out 1",
          }}
        />
      )}
      {/* Encadré type tablette : barre supérieure (notch) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-lg bg-slate-100 dark:bg-slate-700/80 border border-t-0 border-slate-200 dark:border-white/10 z-10" aria-hidden />
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[5]"
          style={{ background: glow }}
        />
      )}
      {/* Contenu au-dessus de la vidéo — z-index élevé + couleurs claires pour lisibilité */}
      <div
        className="relative z-20 p-6 pt-8 pb-6 min-h-[180px] flex flex-col isolate"
        style={{ transform: "none" }}
      >
        <div className="mb-3 inline-flex rounded-xl bg-cyan-500/20 p-2.5 text-cyan-300 w-fit">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <h3
          className="font-heading text-lg font-semibold text-white"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)" }}
        >
          {title}
        </h3>
        <p
          className="mt-1.5 text-sm text-slate-200 line-clamp-3"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}
        >
          {description}
        </p>
      </div>
    </motion.article>
  );
}
