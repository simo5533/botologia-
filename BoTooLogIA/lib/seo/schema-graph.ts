import { portfolioProjects } from "@/lib/data/portfolio-projects";
import { services } from "@/lib/data/services";
import { socialLinks, SOCIAL_INBOX_EMAIL } from "@/lib/data/social";
import {
  SITE_LOGO_PATH,
  SITE_NAME,
  absoluteUrl,
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
function sameAsFromProject(): string[] {
  const out: string[] = [];
  for (const l of socialLinks) {
    if (l.href.startsWith("http://") || l.href.startsWith("https://")) {
      out.push(l.href);
    }
  }
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
        url,
        logo: absoluteUrl(SITE_LOGO_PATH),
        description: defaultSiteDescription,
        sameAs: sameAsFromProject(),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: SOCIAL_INBOX_EMAIL,
            areaServed: "MA",
            availableLanguage: ["French", "en"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": webId(),
        url,
        name: SITE_NAME,
        description: defaultSiteDescription,
        publisher: { "@id": orgId() },
      },
    ],
  };
}

/**
 * Graphe BoToHub (page réelle après redirection depuis /)
 */
export function buildBoToHubStructuredData(): Record<string, unknown> {
  const base = getSiteUrl();
  const pageUrl = absoluteUrl("/botohub");

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
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "BoToHub — BoTooLogIA",
        description:
          defaultSiteDescription,
        isPartOf: { "@id": webId() },
        publisher: { "@id": orgId() },
        about: { "@id": orgId() },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: pageUrl,
          },
        ],
      },
      ...serviceNodes,
      ...creativeNodes,
    ],
  };
}
