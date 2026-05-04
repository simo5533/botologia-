import type { Metadata } from "next";
import {
  absoluteUrl,
  buildCanonical,
  SITE_NAME,
} from "@/lib/seo";
import { SITE_KEYWORDS_FR, advantagePageCopy } from "@/lib/seo/copy";

export const metadata: Metadata = {
  title: 'Avantages Agence IA Maroc — Expertise & Méthode',
  description: advantagePageCopy.metaDescription,
  keywords: [
    ...SITE_KEYWORDS_FR,
    "méthode projet IA",
    "accompagnement IA entreprise",
    "BoToAdvantage",
  ],
  alternates: { canonical: buildCanonical("/botoadvantage") },
  openGraph: {
    title: advantagePageCopy.openGraphTitle,
    description: advantagePageCopy.openGraphDescription,
    url: absoluteUrl("/botoadvantage"),
    siteName: SITE_NAME,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: advantagePageCopy.openGraphTitle,
    description: advantagePageCopy.openGraphDescription,
  },
};

export default function BoToAdvantageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
