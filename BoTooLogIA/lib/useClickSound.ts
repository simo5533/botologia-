"use client";

import { useCallback, useRef } from "react";

/**
 * Son discret au clic — thème futuriste (blip court via Web Audio).
 * À appeler une fois au montage pour activer le son sur les clics.
 */
export function useClickSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    try {
      const ctx = ctxRef.current ?? (typeof window !== "undefined" ? new window.AudioContext() : null);
      if (!ctx) return;
      ctxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.04);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // ignore
    }
  }, []);

  return { playClickSound: play };
}
