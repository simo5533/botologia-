const CONSENT_KEY = "botoologia_analytics_consent";

/**
 * Envoie un événement analytics au serveur (table Analytics).
 * Côté client : n'envoie que si le consentement cookies a été donné.
 */
export function trackAnalytics(payload: {
  page: string;
  event: string;
  metadata?: Record<string, unknown>;
  userId?: string;
}): void {
  if (typeof window !== "undefined") {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (consent !== "accepted") return;
    } catch {
      return;
    }
  }
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Échec silencieux pour ne pas impacter l'UX
  });
}
