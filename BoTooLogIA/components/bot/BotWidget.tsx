"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VIDEO_POSTER } from "@/lib/seo/video-posters";
import { ChatWindow } from "./ChatWindow";

/** Vidéo avatar du widget (également utilisée sur BoToHub) */
const WIDGET_VIDEO_SRC = "/videos/Widget-BOTO.mp4";

const PANEL_HEIGHT = "min(80vh, 560px)";
const PANEL_WIDTH = "min(400px, calc(100vw - 2rem))";

export function BotWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-[9990] flex h-14 w-14 items-center justify-center rounded-full overflow-hidden",
          "border-2 border-white/90 boto-widget-launcher",
          "ring-2 ring-holographic-cyan/40 ring-offset-2 ring-offset-slate-950",
          "hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-holographic-cyan focus-visible:ring-offset-2"
        )}
        aria-label={open ? "Fermer BotoAssist" : "Ouvrir BotoAssist — guide BoTooLogIA"}
        aria-expanded={open}
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      >
        <video
          src={WIDGET_VIDEO_SRC}
          poster={VIDEO_POSTER.widget}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          aria-hidden
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="BotoAssist — conversation"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            className={cn(
              "fixed bottom-24 right-6 z-[9989] flex flex-col rounded-2xl p-[1px]",
              "bg-gradient-to-br from-holographic-cyan/50 via-slate-600/40 to-blue-600/35",
              "shadow-[0_24px_48px_-12px_rgba(15,23,42,0.85),0_0_40px_-8px_rgba(34,211,238,0.35)]"
            )}
            style={{
              width: PANEL_WIDTH,
              height: PANEL_HEIGHT,
              maxHeight: PANEL_HEIGHT,
            }}
          >
            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[15px]",
                "border border-white/10 bg-slate-900/92 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/85"
              )}
            >
            <div className="relative flex shrink-0 items-center justify-between overflow-hidden border-b border-white/10 px-4 py-3">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_0%_-20%,rgba(34,211,238,0.22),transparent_55%)]"
              />
              <span className="relative flex flex-col gap-0.5">
                <span className="flex items-center gap-2 font-heading font-semibold tracking-tight">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-cyan-400 shadow-inner ring-1 ring-slate-600/80">
                    <MessageCircle className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-white drop-shadow-sm">
                    Boto<span className="text-cyan-300">Assist</span>
                  </span>
                </span>
                <span className="pl-10 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Carte du site · FAQ
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-holographic-cyan"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <ChatWindow />
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
