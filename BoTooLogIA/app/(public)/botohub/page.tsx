import type { Metadata } from "next";
import HeroBanner from "@/components/ui/HeroBanner";
import { WhyBoToHubSection, ScrollToBanner } from "@/components/botohub";
import AgentIA from "@/components/ai/AgentIA";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { GlitchText } from "@/components/effects";
import ServiceCard from "@/components/ui/ServiceCard";
import { ValueCardServiceStyle } from "@/components/ui/ValueCardServiceStyle";
import { services } from "@/lib/data/services";
import { Bot, Settings, BarChart3, ClipboardList, Globe, Headphones } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteContentFrame } from "@/components/layout/SiteContentFrame";
import { absoluteUrl, defaultSiteDescription, SITE_NAME } from "@/lib/seo";
import { hubPageCopy } from "@/lib/seo/copy";
import { buildBoToHubStructuredData } from "@/lib/seo/schema-graph";

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Settings,
  BarChart3,
  ClipboardList,
  Globe,
  Headphones,
};

export const metadata: Metadata = {
  title: hubPageCopy.metaTitle,
  description: hubPageCopy.metaDescription,
  alternates: { canonical: "/botohub" },
  openGraph: {
    title: hubPageCopy.metaTitle,
    description: defaultSiteDescription,
    url: absoluteUrl("/botohub"),
    siteName: SITE_NAME,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: hubPageCopy.metaTitle,
    description: defaultSiteDescription,
  },
};

/**
 * BoToHub — Page d'accueil : hero, WhyBoToHub (portail dimension), Code 37, 3D, services, valeurs
 */
export default function BoToHubPage() {
  return (
    <>
      <JsonLd data={buildBoToHubStructuredData()} />
      <main>
      <ScrollToBanner />
      <HeroBanner />

      {/* ══════════════════════════════
          BLOC 1 — Titre (BoToHub + tagline PROBLÈMES/SOLUTIONS)
          BLOC 2 — Robot + texte (entre titre et carousel)
          BLOC 3 — Carousel cards (Expertise IA, Résultats ciblés, Déploiement agile)
          ══════════════════════════════ */}
      <WhyBoToHubSection />

      <section className="w-full px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <SiteContentFrame className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <span className="text-cyan-400 text-xs font-semibold tracking-[0.2em] uppercase">
                {hubPageCopy.agentEyebrow}
              </span>
              <h2 className="text-3xl font-black text-white mt-2">
                Parlez à notre{" "}
                <GlitchText text="Agent IA" intensity="low" className="text-cyan-400" />
              </h2>
              <p className="text-slate-400 mt-3 text-sm md:text-[0.9375rem] leading-relaxed max-w-xl mx-auto">
                {hubPageCopy.agentSubtitle}
              </p>
            </div>
            <AgentIA />
          </SiteContentFrame>
        </div>
      </section>

      <SectionWrapper
        id="services"
        className="bg-[#0f172a]"
        eyebrow={hubPageCopy.servicesEyebrow}
        title={hubPageCopy.servicesTitle}
        titleGradient
        subtitle={hubPageCopy.servicesLead}
        framed
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Bot;
            return (
              <ServiceCard
                key={item.id}
                index={i}
                icon={<Icon className="h-6 w-6" aria-hidden />}
                title={item.title}
                description={item.description}
                href="/botolink"
                linkText="Entrer dans le futur →"
                delay={i * 80}
              />
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="values"
        eyebrow={hubPageCopy.valuesEyebrow}
        title={hubPageCopy.valuesTitle}
        titleGradient
        subtitle={hubPageCopy.valuesLead}
        framed
      >
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          <ValueCardServiceStyle
            index={0}
            delay={0}
            title="Visionnaire"
            description={hubPageCopy.valueVision}
          />
          <ValueCardServiceStyle
            index={1}
            delay={80}
            title="Premium"
            description={hubPageCopy.valuePremium}
          />
          <ValueCardServiceStyle
            index={2}
            delay={160}
            title="Impact"
            description={hubPageCopy.valueImpact}
          />
        </div>
      </SectionWrapper>
    </main>
    </>
  );
}
