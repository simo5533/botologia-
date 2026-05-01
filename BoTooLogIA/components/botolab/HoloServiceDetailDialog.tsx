"use client";

import { Fragment, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { Compass, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { sectionTitleGradientClass } from "@/components/layout/SectionWrapper";
import type { BotolabServiceSection } from "@/lib/data/botolabServiceLongForm";
import { HoloServiceVisual } from "@/components/botolab/HoloBriefingPremiumVisuals";

type HoloServiceDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** id du service (1–6) — visuels premium distincts par carte */
  serviceId: string;
  title: string;
  /** Blocs titres SEO + paragraphes (briefing ~400 mots) */
  sections: BotolabServiceSection[];
};

/**
 * Panneau “holo” : bordure cyan, scanlines, contenu scrollable, accessible (Radix Dialog).
 */
export function HoloServiceDetailDialog({
  open,
  onOpenChange,
  serviceId,
  title,
  sections,
}: HoloServiceDetailDialogProps) {
  /* Désactive le curseur « holo » global (anneau) pendant le modal : curseur texte/lien natif pour la lecture. */
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.classList.add("holo-briefing-open");
    } else {
      root.classList.remove("holo-briefing-open");
    }
    return () => root.classList.remove("holo-briefing-open");
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[100] transition-opacity"
          style={{ backgroundColor: "rgba(0, 6, 20, 0.82)", backdropFilter: "blur(4px)" }}
        />
        <Dialog.Content
          className={cn(
            "fixed z-[101] flex max-h-[min(90dvh,900px)] w-full min-w-0 flex-col overflow-hidden p-0 outline-none",
            "left-0 top-0 h-full max-h-full rounded-none border-0",
            "sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[min(90dvh,900px)] sm:w-[min(100%-2rem,48rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border",
            "border-cyan-500/40",
            "bg-gradient-to-b from-slate-950/98 via-slate-900/99 to-slate-950/98",
            "shadow-[0_0_0_1px_rgba(0,200,255,0.2),0_0_60px_rgba(0,200,255,0.12),inset_0_0_80px_rgba(0,200,255,0.04)]"
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: [
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.04) 2px, rgba(0,200,255,0.04) 3px)",
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,200,255,0.12), transparent 55%)",
              ].join(", "),
            }}
            aria-hidden
          />

          <header className="relative z-10 flex items-start justify-between gap-3 border-b border-cyan-500/20 px-4 py-4 sm:px-6">
            <Dialog.Title className="font-heading pr-2 text-left text-base font-bold leading-snug text-white sm:text-lg">
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                {title}
              </span>
            </Dialog.Title>
            <Dialog.Close
              type="button"
              className="shrink-0 rounded-lg p-2 text-cyan-300/90 transition hover:bg-cyan-500/15 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Fermer le briefing"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </header>

          {/*
            Ne pas mettre cursor-text sur ce conteneur : ça recouvre la zone native de la
            scrollbar (WebKit) et le drag du thumb ne suit plus le curseur.
            Curseur texte seulement sur p / h3.
          */}
          <div
            className="holo-briefing-scroll relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 selection:bg-cyan-500/25"
            data-holo-briefing-scroll
          >
            <Dialog.Description asChild>
              <div className="flex flex-col gap-8 sm:gap-9">
                {sections.map((sec, i) => (
                  <section
                    key={`${sec.title}-${i}`}
                    className="space-y-3 border-b border-cyan-500/10 pb-6 last:mb-0 last:border-0 last:pb-0"
                    aria-labelledby={`holo-sec-${i}`}
                  >
                    <h3
                      id={`holo-sec-${i}`}
                      className={cn(
                        "cursor-text text-left text-sm font-bold uppercase leading-snug tracking-wide sm:text-base",
                        sectionTitleGradientClass,
                        "block w-full"
                      )}
                    >
                      {sec.title}
                    </h3>
                    {sec.paragraphs.map((p, j) => (
                      <Fragment key={j}>
                        <p className="cursor-text text-justify text-[0.95rem] leading-[1.78] text-slate-200/95 first:mt-0 sm:text-base">
                          {p}
                        </p>
                        {/* Deux visuels premium : après le 1er § de chaque grand bloc thématique */}
                        {i === 0 && j === 0 && serviceId ? (
                          <HoloServiceVisual serviceId={serviceId} slot={1} />
                        ) : null}
                        {i === 1 && j === 0 && serviceId ? (
                          <HoloServiceVisual serviceId={serviceId} slot={2} />
                        ) : null}
                      </Fragment>
                    ))}
                  </section>
                ))}
              </div>
            </Dialog.Description>
          </div>

          <footer
            className="relative z-10 shrink-0 border-t border-slate-700/80 bg-slate-900/95 px-2 py-2.5 sm:px-4"
            aria-label="Suite du parcours BoToLab"
          >
            <div className="mb-2 flex items-center gap-1.5 px-1">
              <Compass className="h-3.5 w-3.5 shrink-0 text-cyan-400/90" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Briefing holo · BoToLab
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Link
                href="/botolink"
                className={cn(
                  "inline-flex w-full items-center justify-center gap-1 rounded-lg border border-slate-600/90 bg-slate-800 px-3 py-2 text-center text-[13px] font-medium leading-snug text-slate-100 shadow-sm transition-colors duration-150",
                  "hover:border-cyan-400/60 hover:bg-slate-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  "sm:w-auto sm:justify-center"
                )}
                onClick={() => onOpenChange(false)}
              >
                Passer à l’action sur BoToLink
                <span aria-hidden className="text-cyan-400/90">
                  →
                </span>
              </Link>
            </div>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
