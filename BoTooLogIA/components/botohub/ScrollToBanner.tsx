"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sur la page BoToHub, scroll vers la bannière (début de page) au chargement
 * quand on arrive via le lien "BoToHub" ou le logo, pas vers le bot.
 */
export function ScrollToBanner() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || pathname !== "/botohub") return;
    const hash = window.location.hash;
    if (hash !== "" && hash !== "#banner") return;

    const el = document.getElementById("banner");
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
