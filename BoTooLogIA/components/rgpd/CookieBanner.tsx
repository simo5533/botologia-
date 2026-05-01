"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "botoologia_analytics_consent";

export function useCookieConsent(): {
  consent: "accepted" | "refused" | null;
  accept: () => void;
  refuse: () => void;
} {
  const [consent, setConsent] = useState<"accepted" | "refused" | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === "accepted" || stored === "refused") setConsent(stored);
    } catch {
      setConsent(null);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
      setConsent("accepted");
    } catch {
      setConsent("accepted");
    }
  };

  const refuse = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "refused");
      setConsent("refused");
    } catch {
      setConsent("refused");
    }
  };

  return { consent, accept, refuse };
}

export default function CookieBanner() {
  const { consent, accept, refuse } = useCookieConsent();

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      aria-modal={false}
      className="fixed bottom-6 left-4 right-4 z-[9998] max-w-[560px] mx-auto p-5 rounded-2xl border border-holographic-cyan/20 bg-slate-900/95 backdrop-blur-xl shadow-xl"
    >
      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        Nous utilisons des cookies analytiques pour améliorer votre expérience et
        mesurer nos performances. Aucune donnée n&apos;est vendue.{" "}
        <Link
          href="/politique-confidentialite"
          className="text-holographic-cyan hover:underline"
        >
          En savoir plus
        </Link>
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={accept}
          className="px-5 py-2.5 rounded-lg bg-holographic-cyan text-slate-900 font-semibold text-sm hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-holographic-cyan focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Accepter
        </button>
        <button
          type="button"
          onClick={refuse}
          className="px-5 py-2.5 rounded-lg border border-slate-500 text-slate-400 font-medium text-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
