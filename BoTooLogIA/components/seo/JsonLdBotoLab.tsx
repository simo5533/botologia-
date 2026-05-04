import { JsonLd } from "@/components/seo/JsonLd";
import { buildCanonical } from "@/lib/seo";
import { labPageCopy } from "@/lib/seo/copy";

/**
 * JSON-LD BoToLab — WebPage liée au site (#website) et à l’organisation (#organization).
 */
export function JsonLdBotoLab() {
  const base = buildCanonical("/");
  const pageUrl = buildCanonical("/botolab");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: labPageCopy.metaTitle,
        description: labPageCopy.metaDescription,
        inLanguage: "fr-MA",
        isPartOf: { "@id": `${base}/#website` },
        publisher: { "@id": `${base}/#organization` },
        about: { "@id": `${base}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: base,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "BoToLab",
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return <JsonLd data={schema} />;
}
