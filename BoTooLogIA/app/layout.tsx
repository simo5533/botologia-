import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Manrope } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildCanonical,
  defaultSiteDescription,
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

const canonicalHome = buildCanonical("/botohub");

export const metadata: Metadata = {
  metadataBase: new URL('https://www.botoologia.ai'),
  title: {
    default: 'Agence IA & Automatisation au Maroc | BoTooLogIA',
    template: '%s | BoTooLogIA',
  },
  description:
    'BoTooLogIA conçoit des chatbots IA, automatisations n8n et assistants intelligents pour les entreprises au Maroc. Agence basée à Rabat, du cadrage au déploiement.',
  keywords: [...SITE_KEYWORDS_FR],
  authors: [{ name: SITE_NAME }],
  category: "technology",
  alternates: {
    canonical: canonicalHome,
    languages: { fr: canonicalHome, "x-default": canonicalHome },
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: canonicalHome,
    siteName: SITE_NAME,
    title: "BoTooLogIA | Agence IA & Automatisation au Maroc",
    description: defaultSiteDescription,
    images: [
      {
        url: "/logo-mark.png",
        width: 512,
        height: 512,
        alt: "BoTooLogIA — Agence IA et automatisation au Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoTooLogIA | Agence IA & Automatisation au Maroc",
    description: defaultSiteDescription,
    images: ["/logo-mark.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon-48.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: '8b306ce18f678b8e',
  },
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
