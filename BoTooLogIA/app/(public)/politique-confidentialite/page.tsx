import type { Metadata } from "next";
import Link from "next/link";
import { buildCanonical, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — Données & Cookies',
  description: `Politique de confidentialité et traitement des données personnelles — ${SITE_NAME}.`,
  alternates: { canonical: buildCanonical("/politique-confidentialite") },
  robots: { index: true, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-28 text-slate-300 md:pt-32">
      <h1 className="font-heading text-3xl font-bold text-white">Politique de confidentialité</h1>
      <p className="mt-4 text-sm leading-relaxed">
        La présente page décrit comment {SITE_NAME} peut traiter les données personnelles
        collectées via les formulaires de contact, les outils d&apos;analytics (si activés) et
        l&apos;utilisation du site. Pour toute question, utilisez la page{" "}
        <Link href="/botolink" className="text-cyan-400 underline hover:text-cyan-300">
          BoToLink
        </Link>
        .
      </p>
      <h2 className="mt-10 font-heading text-xl font-semibold text-white">Données collectées</h2>
      <p className="mt-3 text-sm leading-relaxed">
        Données d&apos;identification et de contact transmises volontairement (nom, e-mail,
        message, entreprise), journaux techniques (adresse IP, user-agent) dans la limite nécessaire
        à la sécurité et au bon fonctionnement du service.
      </p>
      <h2 className="mt-10 font-heading text-xl font-semibold text-white">Finalités</h2>
      <p className="mt-3 text-sm leading-relaxed">
        Répondre aux demandes, améliorer le site, assurer la conformité légale et la prévention des
        abus. Les bases légales applicables dépendent du contexte (exécution de mesures
        précontractuelles, intérêt légitime, consentement lorsque requis).
      </p>
      <h2 className="mt-10 font-heading text-xl font-semibold text-white">Durée de conservation</h2>
      <p className="mt-3 text-sm leading-relaxed">
        Les données de contact sont conservées le temps nécessaire au traitement de la demande et
        au suivi commercial raisonnable, sauf obligation légale contraire.
      </p>
      <h2 className="mt-10 font-heading text-xl font-semibold text-white">Vos droits</h2>
      <p className="mt-3 text-sm leading-relaxed">
        Conformément à la réglementation applicable, vous pouvez exercer vos droits d&apos;accès,
        de rectification, d&apos;effacement, de limitation, d&apos;opposition et de portabilité
        lorsque ces droits sont ouverts, en nous contactant via BoToLink.
      </p>
      <p className="mt-12 text-xs text-slate-500">
        Document d&apos;information — à adapter avec votre conseil juridique selon vos traitements
        réels (hébergeur, sous-traitants, cookies, CRM).
      </p>
    </div>
  );
}
