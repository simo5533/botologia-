"use client";

import React, { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";

type TeleportContextValue = {
  navigateWithTeleport: (href: string) => void;
};

const TeleportContext = React.createContext<TeleportContextValue | null>(null);

export function useTeleport() {
  const ctx = React.useContext(TeleportContext);
  return ctx;
}

/**
 * Fournit l’effet de téléportation vers une cible (ex. /botolink) puis navigation.
 */
export function TeleportProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [teleporting, setTeleporting] = useState(false);
  const [, setTarget] = useState<string | null>(null);

  const navigateWithTeleport = useCallback(
    (href: string) => {
      if (pathname === href) return;
      if (reduceMotion) {
        router.push(href);
        return;
      }
      setTarget(href);
      setTeleporting(true);
      setTimeout(() => {
        router.push(href);
        setTeleporting(false);
        setTarget(null);
      }, 480);
    },
    [pathname, reduceMotion, router]
  );

  return (
    <TeleportContext.Provider value={{ navigateWithTeleport }}>
      {children}
      {teleporting && (
        <div
          className="fixed inset-0 z-[9998] pointer-events-none bg-slate-900/30 animate-teleport-out"
          aria-hidden
          style={{ animation: "teleport-out 0.5s ease-in forwards" }}
        />
      )}
    </TeleportContext.Provider>
  );
}
