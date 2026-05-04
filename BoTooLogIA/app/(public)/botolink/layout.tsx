import type { Metadata } from "next";
import { absoluteUrl, buildCanonical, SITE_NAME } from "@/lib/seo";
import { linkPageCopy } from "@/lib/seo/copy";

export const metadata: Metadata = {
  title: 'Démarrer un Projet IA au Maroc — Contact',
  description: linkPageCopy.metaDescription,
  alternates: { canonical: buildCanonical("/botolink") },
  openGraph: {
    title: linkPageCopy.metaTitle,
    description: linkPageCopy.metaDescription,
    url: absoluteUrl("/botolink"),
    siteName: SITE_NAME,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: linkPageCopy.metaTitle,
    description: linkPageCopy.metaDescription,
  },
};

export default function BoToLinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
