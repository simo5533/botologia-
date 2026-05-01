"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useLenisScrollToTop } from "@/components/providers/LenisProvider";
import { PageTransitionWrapper } from "./PageTransitionWrapper";

/**
 * Enveloppe le contenu du layout public pour appliquer les transitions de page (teleport).
 * Utilise le pathname comme clé pour déclencher exit/enter à chaque navigation.
 */
export function PublicLayoutTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scrollToTop = useLenisScrollToTop();

  useEffect(() => {
    if (scrollToTop) {
      scrollToTop();
    } else {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    const main = document.getElementById("main-content");
    main?.focus({ preventScroll: true });
  }, [pathname, scrollToTop]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransitionWrapper key={pathname}>
        {children}
      </PageTransitionWrapper>
    </AnimatePresence>
  );
}
