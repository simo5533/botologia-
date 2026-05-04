import { JsonLd } from "@/components/seo/JsonLd";
import { buildCanonical, SITE_NAME } from "@/lib/seo";
import { hubPageCopy } from "@/lib/seo/copy";

/**
 * JSON-LD BoToHub — WebPage + Service (Organization / WebSite via app/layout + buildRootStructuredData).
 */
export function JsonLdBotoHub() {
  const orgId = `${buildCanonical("/")}/#organization`;
  const webId = `${buildCanonical("/")}/#website`;
  const pageUrl = buildCanonical("/botohub");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: hubPageCopy.metaTitle,
        description: hubPageCopy.metaDescription,
        isPartOf: { "@id": webId },
        about: { "@id": orgId },
        inLanguage: "fr-MA",
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#services`,
        name: "Services IA & Automatisation",
        provider: { "@id": orgId },
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

  return <JsonLd data={schema} />;
}
