"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Cpu, Target, Zap } from "lucide-react";
import { RobotSection } from "@/components/botohub/RobotSection";
import { PortalBackground } from "@/components/effects/PortalBackground";
import { useTilt } from "@/components/effects/useTilt";
import { SectionHeader } from "./SectionHeader";
import { CardVideoBackground } from "@/components/ui/CardVideoBackground";
import { SiteContentFrame } from "@/components/layout/SiteContentFrame";
import { hubPageCopy } from "@/lib/seo/copy";
import { cn } from "@/lib/utils";

/** Même vidéo que toutes les cartes — fond carte service */
const CARD_VIDEO_SRC = "/videos/fond-carte-service.mp4";

const pillarIcons = [Cpu, Target, Zap] as const;

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

function TiltCard({
  children,
  className,
  disableHoverScale,
}: {
  children: React.ReactNode;
  className?: string;
  disableHoverScale?: boolean;
}) {
  const { onMouseMove, onMouseLeave, style, isTiltEnabled } = useTilt();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={item}
      whileHover={
        disableHoverScale || reduceMotion ? undefined : { scale: 1.03 }
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative rounded-2xl transition-shadow duration-300 overflow-hidden",
        "hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
        className
      )}
      style={{ position: "relative" }}
    >
      <CardVideoBackground
        videoSrc={CARD_VIDEO_SRC}
        overlayOpacity={0.82}
        className="relative w-full h-full rounded-2xl border border-cyan-500/20 shadow-xl"
      >
        <div
          onMouseMove={isTiltEnabled ? onMouseMove : undefined}
          onMouseLeave={isTiltEnabled ? onMouseLeave : undefined}
          style={isTiltEnabled ? style : undefined}
          className="relative p-8 h-full min-h-[200px]"
        >
          {children}
        </div>
      </CardVideoBackground>
    </motion.div>
  );
}

export function WhyBoToHubSection() {
  const reduceMotion = useReducedMotion();
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarsePointer(mq.matches);
    const fn = () => setCoarsePointer(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <section
      className="relative py-14 md:py-16 bg-[#0b1220] border-t border-white/10 overflow-hidden"
      aria-labelledby="why-botohub-heading"
    >
      <PortalBackground />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SiteContentFrame variant="subtle" className="mb-10 p-6 sm:p-8 md:p-10">
          <SectionHeader />
          <RobotSection />
        </SiteContentFrame>

        {/* Séparateur entre bloc intro et carrousel */}
        <div
          style={{
            width: "100%",
            maxWidth: "200px",
            height: "1px",
            margin: "0 auto 24px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,200,255,0.2), transparent)",
          }}
          aria-hidden
        />

        {/* BLOC 3 — Cartes (Expertise, Résultats, Déploiement) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={
            reduceMotion
              ? undefined
              : {
                  show: { transition: { staggerChildren: 0.15 } },
                }
          }
          className={cn(
            "flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-pb-2 touch-pan-x pb-1 pt-1 md:gap-10",
            "[scrollbar-width:thin] [scrollbar-color:rgba(71,85,105,0.45)_transparent]",
            "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600/40",
            "md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:pt-0 md:snap-none"
          )}
        >
          {hubPageCopy.whyPillars.map(({ title, description }, idx) => {
            const Icon = pillarIcons[idx];
            return (
            <TiltCard
              key={title}
              disableHoverScale={coarsePointer}
              className="w-[min(82vw,340px)] shrink-0 snap-center md:w-auto md:max-w-none md:shrink"
            >
              <div className="flex h-full min-h-0 flex-col items-start text-left">
                <div className="mb-4 shrink-0 rounded-xl bg-cyan-500/10 p-3 text-cyan-400 ring-1 ring-cyan-500/20">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-heading mb-3 shrink-0 text-xl font-semibold tracking-tight text-white">
                  {title}
                </h3>
                <p
                  className="w-full flex-1 text-sm leading-relaxed text-gray-400"
                  style={{
                    textShadow: "0 0 8px rgba(148,163,184,0.15)",
                  }}
                >
                  {description}
                </p>
              </div>
            </TiltCard>
            );
          })}
        </motion.div>
        <div className="mt-16 text-center">
          <Link
            href="/botolink"
            className="inline-flex items-center justify-center px-8 py-3 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0b1220]"
          >
            Planifier une consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
