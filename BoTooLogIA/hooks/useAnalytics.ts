"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { trackAnalytics } from "@/lib/analytics";
import { EVENTS, type EventName } from "@/lib/analytics/events";

export { EVENTS };
export type { EventName };

/**
 * Hook pour envoyer des événements analytics depuis les composants.
 * Respecte le consentement cookies (CookieBanner). Utilise la page courante comme contexte.
 */
export function useTrack() {
  const pathname = usePathname();

  return useCallback(
    (event: EventName | string, metadata?: Record<string, unknown>) => {
      const page = typeof window !== "undefined" ? window.location.pathname || pathname || "/" : pathname || "/";
      trackAnalytics({ page, event, metadata });
    },
    [pathname]
  );
}
