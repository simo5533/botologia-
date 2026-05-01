"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackAnalytics } from "@/lib/analytics";

/**
 * Envoie page_view à chaque changement de page et page_exit (durée) au démontage.
 * N'envoie pas en mode admin pour ne pas polluer les stats CEO.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/botoadmin") || pathname.startsWith("/boss")) return;

    const page = pathname === "" ? "/" : pathname;
    startTimeRef.current = Date.now();
    trackAnalytics({ page, event: "page_view" });

    return () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (duration >= 2) {
        trackAnalytics({ page, event: "page_exit", metadata: { duration } });
      }
    };
  }, [pathname]);

  return null;
}
