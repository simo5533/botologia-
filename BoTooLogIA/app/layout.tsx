import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Manrope } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  defaultSiteDescription,
  getSiteUrl,
  SITE_NAME,
} from "@/lib/seo";
import { SITE_KEYWORDS_FR } from "@/lib/seo/copy";
import { buildRootStructuredData } from "@/lib/seo/schema-graph";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const canonicalHome = absoluteUrl("/botohub");
const siteOrigin = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "BoTooLogIA — Agence IA au Maroc | Automatisation, assistants IA et solutions web",
    template: "%s | BoTooLogIA",
  },
  description: defaultSiteDescription,
  keywords: [...SITE_KEYWORDS_FR],
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: "/botohub",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: canonicalHome,
    siteName: SITE_NAME,
    title: "BoTooLogIA — Agence IA au Maroc",
    description: defaultSiteDescription,
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoTooLogIA — Agence IA au Maroc",
    description: defaultSiteDescription,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: { index: true, follow: true },
};

/** Mise à l’échelle correcte sur mobile / tablette / desktop (pas de “viewport fixe” étroit). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${manrope.variable} bg-theme-page`}
      suppressHydrationWarning
    >
      <body className="min-h-screen w-full min-w-0 font-sans bg-theme-page overflow-x-hidden">
        <JsonLd data={buildRootStructuredData()} />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
