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
import { JsonLdBotoHub } from "@/components/seo/JsonLdBotoHub";
import { SiteContentFrame } from "@/components/layout/SiteContentFrame";
import Link from "next/link";
import { absoluteUrl, buildCanonical, SITE_NAME } from "@/lib/seo";
import { hubPageCopy } from "@/lib/seo/copy";
import { buildBoToHubSupplementStructuredData } from "@/lib/seo/schema-graph";

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Settings,
  BarChart3,
  ClipboardList,
  Globe,
  Headphones,
};

const canonicalSite = buildCanonical("/botohub");
const ogImage = absoluteUrl("/logo-mark.png");

export const metadata: Metadata = {
  title: 'Agence IA & Automatisation au Maroc — BoToHub',
  description: hubPageCopy.metaDescription,
  alternates: {
    canonical: 'https://www.botoologia.ai/botohub',
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: canonicalSite,
    siteName: SITE_NAME,
    title: "BoToHub — Plateforme IA & Automatisation | BoTooLogIA",
    description:
      "BoToHub : plateforme principale IA et automatisation au Maroc.",
    images: [
      {
        url: ogImage,
        width: 512,
        height: 512,
        alt: "BoToHub — Agence IA et Automatisation au Maroc | BoTooLogIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoToHub | BoTooLogIA — Agence IA Maroc",
    description: "Plateforme IA et automatisation pour entreprises au Maroc.",
    images: [ogImage],
  },
};

/**
 * BoToHub — Page d'accueil : hero, WhyBoToHub (portail dimension), Code 37, 3D, services, valeurs
 */
export default function BoToHubPage() {
  return (
    <>
      <JsonLdBotoHub />
      <JsonLd data={buildBoToHubSupplementStructuredData()} />
      <div>
        <ScrollToBanner />
        <HeroBanner />

        {/* ══════════════════════════════
          BLOC 1 — Titre (BoToHub + tagline PROBLÈMES/SOLUTIONS)
          BLOC 2 — Robot + texte (entre titre et carousel)
          BLOC 3 — Carousel cards (Expertise IA, Résultats ciblés, Déploiement agile)
          ══════════════════════════════ */}
        <WhyBoToHubSection />

        <section className="w-full px-6 py-8">
          <div className="mx-auto max-w-3xl">
            <SiteContentFrame className="p-6 sm:p-8">
              <div className="mb-8 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  {hubPageCopy.agentEyebrow}
                </span>
                <h2 className="mt-2 text-3xl font-black text-white">
                  Parlez à notre{" "}
                  <GlitchText text="Agent IA" intensity="low" className="text-cyan-400" />
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-[0.9375rem]">
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

        <section
          className="seo-rich-text border-t border-white/10 bg-slate-950/50"
          aria-label="Description détaillée BoToHub"
        >
          <div className="container mx-auto max-w-4xl px-6 py-16">
            <h2 className="font-heading text-2xl font-semibold text-white">
              BoToHub : Votre Partenaire IA &amp; Automatisation au Maroc
            </h2>
            <p className="mb-4 mt-4 text-base leading-relaxed text-slate-300">
              BoToHub est la plateforme principale de BoTooLogIA, dédiée à la conception et au
              déploiement de solutions d&apos;intelligence artificielle pour les entreprises
              marocaines. Que votre besoin soit un chatbot de support client, un workflow automatisé
              ou un agent IA connecté à vos données internes, BoToHub est le point d&apos;entrée de
              votre transformation numérique.
            </p>

            <h3 className="mt-8 font-heading text-xl font-semibold text-white">
              Comment fonctionne notre approche ?
            </h3>
            <p className="mb-4 mt-3 text-base leading-relaxed text-slate-300">
              Nous partons toujours de vos processus réels. Pas de solution générique : chaque projet
              commence par un atelier de cadrage où nous analysons vos flux de travail, identifions
              les points de friction et estimons le retour sur investissement attendu. Cette rigueur
              nous permet de livrer des solutions IA qui s&apos;intègrent naturellement dans votre
              organisation.
            </p>

            <h3 className="mt-8 font-heading text-xl font-semibold text-white">
              Quels secteurs accompagnons-nous au Maroc ?
            </h3>
            <p className="mb-4 mt-3 text-base leading-relaxed text-slate-300">
              BoTooLogIA intervient dans des secteurs variés : éducation (plateformes de soutien
              scolaire intelligentes), e-commerce (recommandations et support automatisé),
              institutions publiques (gestion documentaire et portails IA), santé (prise de
              rendez-vous vocale) et PME de services (automatisation commerciale et CRM enrichi par
              l&apos;IA).
            </p>

            <h3 className="mt-8 font-heading text-xl font-semibold text-white">
              Technologies utilisées par BoTooLogIA
            </h3>
            <p className="mb-6 mt-3 text-base leading-relaxed text-slate-300">
              Notre stack technique est orientée résultats : GPT-4o et Claude pour les modèles de
              langage, n8n pour l&apos;orchestration des workflows, Supabase et pgvector pour la base
              de données vectorielle (RAG), Next.js 14 pour les interfaces web et Python FastAPI pour
              les backends IA. Chaque composant est sélectionné pour sa fiabilité en production, pas
              pour sa popularité.
            </p>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-sm text-slate-400">
                <strong>BoTooLogIA</strong> — Agence IA &amp; Automatisation basée à Rabat, Maroc.
                RC : 183221 — ICE : 003896691000005. Nous intervenons sur tout le territoire marocain
                et accompagnons les projets à distance pour les clients à l&apos;international.{" "}
                <Link href="/botolink" className="text-cyan-400 underline hover:text-cyan-300">
                  Contact
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
