import type { Metadata } from "next";
import {
  absoluteUrl,
  defaultSiteDescription,
  SITE_NAME,
} from "@/lib/seo";
import { labPageCopy } from "@/lib/seo/copy";

export const metadata: Metadata = {
  title: labPageCopy.metaTitle,
  description: labPageCopy.metaDescription,
  alternates: { canonical: "/botolab" },
  openGraph: {
    title: labPageCopy.metaTitle,
    description: defaultSiteDescription,
    url: absoluteUrl("/botolab"),
    siteName: SITE_NAME,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: labPageCopy.metaTitle,
    description: defaultSiteDescription,
  },
};

export default function BoToLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
