import { portfolioProjects } from "@/lib/data/portfolio-projects";
import { services } from "@/lib/data/services";
import { socialLinks, SOCIAL_INBOX_EMAIL } from "@/lib/data/social";
import { hubPageCopy } from "@/lib/seo/copy";
import {
  SITE_LOGO_PATH,
  SITE_NAME,
  absoluteUrl,
  buildCanonical,
  defaultSiteDescription,
  getSiteUrl,
} from "@/lib/seo";

function orgId(): string {
  return `${getSiteUrl()}/#organization`;
}

function webId(): string {
  return `${getSiteUrl()}/#website`;
}

function slugService(name: string, index: number): string {
  const base = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${getSiteUrl()}/#service-${base || `${index}`}`;
}

function buildServiceStructuredNodes(): Record<string, unknown>[] {
  return services.map((s, i) => ({
    "@type": "Service",
    "@id": slugService(String(s.title), i),
    name: s.title,
    description: s.description,
    provider: { "@id": orgId() },
    areaServed: "MA",
    serviceType: s.title,
  }));
}

/** sameAs : réseaux avec URL externes explicites (env ou défaut fichier social.ts) — pas inventé */
export function sameAsFromProject(): string[] {
  const out: string[] = [];
  for (const l of socialLinks) {
    if (l.href.startsWith("http://") || l.href.startsWith("https://")) {
      out.push(l.href);
    }
  }
  out.push("https://botosquad.com");
  return Array.from(new Set(out));
}

/**
 * Graphe racine — Organization + WebSite (injecté depuis app/layout.tsx)
 */
export function buildRootStructuredData(): Record<string, unknown> {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId(),
        name: SITE_NAME,
        legalName: SITE_NAME,
        alternateName: "BotoSquad",
        taxID: "003896691000005",
        url,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(SITE_LOGO_PATH),
          width: 512,
          height: 512,
        },
        description: defaultSiteDescription,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rabat",
          addressRegion: "Rabat-Salé-Kénitra",
          addressCountry: "MA",
        },
        sameAs: sameAsFromProject(),
        inLanguage: "fr-MA",
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: SOCIAL_INBOX_EMAIL,
            areaServed: "MA",
            availableLanguage: ["French", "Arabic", "en"],
            url: absoluteUrl("/botolink"),
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": webId(),
        url,
        name: SITE_NAME,
        description: defaultSiteDescription,
        inLanguage: "fr-MA",
        publisher: { "@id": orgId() },
      },
    ],
  };
}

/**
 * WebPage + offre Service BoToHub (JSON-LD dédié page d’accueil hub).
 */
export function buildBoToHubWebPageAndServiceJsonLd(): Record<string, unknown> {
  const pageUrl = buildCanonical("/botohub");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: hubPageCopy.metaTitle,
        description: hubPageCopy.metaDescription,
        isPartOf: { "@id": webId() },
        about: { "@id": orgId() },
        inLanguage: "fr-MA",
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#services`,
        name: "Services IA & Automatisation",
        provider: { "@id": orgId() },
        areaServed: {
          "@type": "Country",
          name: "Morocco",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Services IA ${SITE_NAME}`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Développement de Chatbots IA",
                description:
                  "Assistants conversationnels sur le web ou la messagerie : FAQ intelligente, qualification des demandes.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatisation des Processus",
                description:
                  "Enchaînement de tâches répétitives avec contrôle qualité et traçabilité.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Voicebots IA",
                description: "Parcours vocaux pour accueil, routage ou support client au Maroc.",
              },
            },
          ],
        },
      },
    ],
  };
}

/**
 * Breadcrumb + services + portfolio BoToHub (sans WebPage — évite doublon avec buildBoToHubWebPageAndServiceJsonLd).
 */
export function buildBoToHubSupplementStructuredData(): Record<string, unknown> {
  const base = getSiteUrl();
  const pageUrl = buildCanonical("/botohub");

  const creativeNodes = portfolioProjects.map((p) => ({
    "@type": "CreativeWork",
    "@id": `${base}/#${p.slug}`,
    name: p.name,
    description: p.description,
    image: absoluteUrl(p.imagePath),
    creator: { "@id": orgId() },
  }));

  const serviceNodes = buildServiceStructuredNodes();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: buildCanonical("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "BoToHub",
            item: pageUrl,
          },
        ],
      },
      ...serviceNodes,
      ...creativeNodes,
    ],
  };
}

/**
 * Graphe BoToHub complet (WebPage + supplément) — pour usages hors page publique si besoin.
 */
export function buildBoToHubStructuredData(): Record<string, unknown> {
  const pageUrl = buildCanonical("/botohub");
  const supplement = buildBoToHubSupplementStructuredData();
  const extra = supplement["@graph"] as Record<string, unknown>[];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "BoToHub — BoTooLogIA",
        description: defaultSiteDescription,
        inLanguage: "fr-MA",
        isPartOf: { "@id": webId() },
        publisher: { "@id": orgId() },
        about: { "@id": orgId() },
      },
      ...extra,
    ],
  };
}
