"use client";

import { useCallback, useEffect } from "react";
import { useClickSound } from "@/lib/useClickSound";

/**
 * Joue un son discret au premier clic (souris/tactile) pour feedback futuriste.
 */
export function ClickSoundProvider({ children }: { children: React.ReactNode }) {
  const { playClickSound } = useClickSound();

  const onInteraction = useCallback(() => {
    playClickSound();
  }, [playClickSound]);

  useEffect(() => {
    const opts = { capture: true, passive: true };
    const handle = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.("button") || target?.closest?.("a") || target?.closest?.("[role='button']")) {
        onInteraction();
      }
    };
    document.addEventListener("click", handle, opts);
    document.addEventListener("touchend", handle, opts);
    return () => {
      document.removeEventListener("click", handle, opts);
      document.removeEventListener("touchend", handle, opts);
    };
  }, [onInteraction]);

  return <>{children}</>;
}
