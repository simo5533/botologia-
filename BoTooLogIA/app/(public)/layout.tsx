import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PublicCtaBlock } from "@/components/sections/PublicCtaBlock";
import { SkipLink } from "@/components/layout/SkipLink";
import { LuxuryStarBackground } from "@/components/backgrounds/LuxuryStarBackground";
import { PublicLayoutTransition } from "@/components/portal/PublicLayoutTransition";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

/**
 * Layout des pages publiques : skip link, header premium, contenu, bloc CTA, footer
 * Fond étoilé luxe en arrière-plan (z-index -1).
 * Transitions de page type teleport (fade spatial + blur) via PublicLayoutTransition.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnalyticsTracker />
      <LuxuryStarBackground />
      <SkipLink />
      <Header />
      <main
        id="main-content"
        className="relative min-h-screen w-full min-w-0 bg-transparent"
        tabIndex={-1}
      >
        <PublicLayoutTransition>
          {children}
          <PublicCtaBlock />
        </PublicLayoutTransition>
      </main>
      <Footer />
    </>
  );
}
