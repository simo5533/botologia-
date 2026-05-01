/**
 * Textes éditoriaux & SEO — structure type vitrine produit : accroche courte, paragraphe de contexte, lexique stable.
 * Une seule source pour métadonnées critiques et fils rouges de page (cohérence avec JSON-LD via defaultSiteDescription).
 */

/** Description organisation / Open Graph par défaut (sans chiffres inventés) */
export const ORGANIZATION_META_DESCRIPTION =
  "BoTooLogIA est une agence IA au Maroc qui conçoit et déploie des automatisations, des assistants conversationnels, des intégrations données et des sites ou applications avec briques d’intelligence artificielle — du cadrage projet à la mise en production.";

/** Mots-clés réutilisables (navigation sémantique du site) */
export const SITE_KEYWORDS_FR = [
  "agence IA Maroc",
  "automatisation entreprise",
  "chatbot entreprise",
  "assistant conversationnel",
  "intelligence artificielle",
  "développement web IA",
  "workflow automatisé",
  "BoTooLogIA",
] as const;

export const hubPageCopy = {
  metaTitle: "BoToHub — Plateforme BoTooLogIA | Automatisation & IA au Maroc",
  metaDescription:
    "BoToHub présente l’offre BoTooLogIA : services d’IA, automatisations, chatbots et solutions web pour entreprises et institutions au Maroc. Accès BoToLab, BoToLink et ressources.",
  whyEyebrow: "Plateforme principale",
  whyLead:
    "Nous partons de vos processus réels : cadrage du besoin, conception d’automatisations ou d’assistants IA, intégration à vos outils, puis mise en ligne et ajustements avec vos équipes.",
  agentEyebrow: "Assistant conversationnel",
  agentSubtitle:
    "Orientation vers les pages services, la prise de contact (BoToLink) et les informations utiles sur BoTooLogIA.",
  servicesEyebrow: "Offre",
  servicesTitle: "Services en intelligence artificielle",
  servicesLead:
    "Chatbots et voicebots, automatisation des tâches répétitives, analyse et valorisation de données, workflows CRM, ainsi que sites et applications enrichis par l’IA (contenu, médias) — sur mesure selon votre secteur.",
  valuesEyebrow: "Culture projet",
  valuesTitle: "Nos valeurs",
  valuesLead:
    "Innovation appliquée, exigence sur la qualité des livrables et solutions pensées pour durer dans votre organisation.",
  whyPillars: [
    {
      title: "Expertise IA",
      description:
        "Conception d’assistants conversationnels, flux automatisés et intégrations techniques alignés sur vos outils existants.",
    },
    {
      title: "Objectifs cadrés",
      description:
        "Périmètre, livrables et priorités définis avec vos équipes avant développement — pour un projet maîtrisable et traçable.",
    },
    {
      title: "Mise en ligne & itérations",
      description:
        "Déploiement progressif et ajustements après retour d’usage : la solution évolue avec votre organisation.",
    },
  ] as const,
  valueVision:
    "Anticiper les usages de l’IA et de l’automatisation pour des choix techniques alignés sur votre métier.",
  valuePremium:
    "Rigueur de conception, code maintenable et communication claire à chaque étape du projet.",
  valueImpact:
    "Des objectifs fixés avec vous et des indicateurs suivis lorsque le contexte le permet — sans promesse chiffrée générique.",
} as const;

export const labPageCopy = {
  metaTitle: "BoToLab — Laboratoire services IA & prototypes | BoTooLogIA",
  metaDescription:
    "BoToLab : détail des services IA BoTooLogIA, prototypage, intégrations et préparation au déploiement. Même expertise que sur BoToHub, présentée comme laboratoire de solutions.",
  heroDescription:
    "Prototype, intégration et préparation au déploiement : nous détaillons chaque brique — chatbots, automatisations, données, sites et applications avec IA — avant industrialisation.",
  sectionEyebrow: "Catalogue",
  sectionTitle: "Services en intelligence artificielle",
  sectionLead:
    "Explorez les mêmes offres que sur BoToHub avec fiches détaillées et dialogues « holo » : chaque carte ouvre une vue approfondie du service.",
} as const;

export const linkPageCopy = {
  metaTitle: "BoToLink — Contact & demande de projet | BoTooLogIA",
  metaDescription:
    "Contactez BoTooLogIA via BoToLink : demande d’échange, devis ou description de projet (IA, automatisation, web). Nous revenons vers vous selon les informations fournies.",
} as const;

/** Paragraphe d’accueil hero (sans promesse chiffrée) */
export const defaultHeroLead =
  "Automatisation, assistants IA et solutions web au Maroc — du cadrage de votre besoin à la mise en production et au suivi technique.";

export const worksPageCopy = {
  metaTitle: "BoToWorks — Réalisations & cas d’usage IA | BoTooLogIA",
  metaDescription:
    "BoToWorks illustre des typologies de projets IA et d’automatisation portés par BoTooLogIA. Pour un cas détaillé ou une démonstration, la suite du parcours se fait via BoToLink.",
} as const;

export const advantagePageCopy = {
  metaTitle: "BoToAdvantage — Méthode & accompagnement projet IA | BoTooLogIA",
  metaDescription:
    "Comment BoTooLogIA pilote vos projets d’IA et d’automatisation : cadrage, feuille de route, développement par jalons et mise en production — sans promesses chiffrées marketing.",
  openGraphTitle: "BoToAdvantage — Méthode BoTooLogIA",
  openGraphDescription:
    "Démarche structurée, transparente sur le périmètre et les livrables, pour passer du besoin métier aux solutions IA et automatisation.",
} as const;
