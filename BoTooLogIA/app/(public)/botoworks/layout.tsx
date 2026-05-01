import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { worksPageCopy } from "@/lib/seo/copy";

export const metadata: Metadata = {
  title: worksPageCopy.metaTitle,
  description: worksPageCopy.metaDescription,
  alternates: { canonical: "/botoworks" },
  openGraph: {
    title: worksPageCopy.metaTitle,
    description: worksPageCopy.metaDescription,
    url: absoluteUrl("/botoworks"),
    siteName: SITE_NAME,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: worksPageCopy.metaTitle,
    description: worksPageCopy.metaDescription,
  },
};

export default function BoToWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
