/**
 * Base de connaissances BotoAssist — guide du site (pas de grille tarifaire ici).
 * Réponses instantanées sans appel API.
 */

export interface KnowledgeEntry {
  patterns: string[];
  reply: string;
  category: string;
}

// ════════════════════════════════════════════
// BASE BOTOASSIST — TON ORIENTATION / GUIDE
// ════════════════════════════════════════════
export const knowledgeBase: KnowledgeEntry[] = [
  {
    category: "salutation",
    patterns: [
      "bonjour",
      "bonsoir",
      "salut",
      "hello",
      "hi",
      "hey",
      "coucou",
      "bsr",
      "bjr",
      "slt",
      "good morning",
      "bonne journée",
    ],
    reply:
      "Bonjour ! Je suis **BotoAssist**, le guide de BoToLogIA.\n\n" +
      "Je peux vous expliquer les pages du site, ce que nous faisons, et vous indiquer où aller (BoToHub, BoToLab, BoToLink, etc.).\n\n" +
      "Les montants et devis se traitent **avec l’équipe** : rendez-vous sur la page **/botolink** quand vous voulez un échange personnalisé — pas ici.\n\n" +
      "Qu’est-ce que vous cherchez en premier sur le site ?",
  },
  {
    category: "services",
    patterns: [
      "services",
      "service",
      "proposez",
      "offre",
      "offrez",
      "faites",
      "spécialité",
      "solutions",
      "solution",
      "produits",
      "catalogue",
      "quoi",
      "que faites vous",
      "vous faites quoi",
    ],
    reply:
      "Voici ce que vous pouvez explorer côté BoToLogIA (à détail sur **/botolab** et le hub) :\n\n" +
      "• **Chatbot IA** — dialogue clients, support, qualification\n" +
      "• **Agent IA** — enchaîner des tâches et processus de bout en bout\n" +
      "• **Contenu & visibilité** — génération de contenu, social, SEO\n" +
      "• **Analyse** — aider à lire des signaux business\n" +
      "• **Conseil & feuille de route** — prioriser un projet sur mesure\n\n" +
      "Ce ne sont **pas** des fiches commerciales ici : pour un ressenti « projet concret », la suite logique est **/botolink** (prise de contact).\n\n" +
      "Quel sujet vous intéresse le plus pour commencer ?",
  },
  {
    category: "chatbot",
    patterns: [
      "chatbot",
      "chat bot",
      "bot",
      "assistant virtuel",
      "assistant ia",
      "robot",
      "automatiser réponses",
      "réponses automatiques",
      "support automatique",
    ],
    reply:
      "Un **chatbot sur mesure** sert surtout à assurer le **premier niveau** d’échange (FAQ, prise d’info, orientations) et à soulager l’équipe sur les questions répétitives.\n\n" +
      "Le rendu et les enchaînements se **cadrent** avec l’agence (ton, canaux, outils) — c’est sur **/botolab** qu’on présente l’offre, et sur **/botolink** qu’on planifie un appel.\n\n" +
      "Vous avez plutôt un site vitrine, un e-commerce, ou un outil interne en tête ?",
  },
  {
    category: "prix",
    patterns: [
      "prix",
      "tarif",
      "coût",
      "coute",
      "combien",
      "budget",
      "cher",
      "euro",
      "€",
      "invest",
      "combien ça coûte",
      "tarification",
      "devis",
      "gratuit",
      "free",
      "forfait",
    ],
    reply:
      "Je n’affiche **pas** de grilles tarifaires ici : ce chat est un **guide**.\n\n" +
      "Pour toute **question de chiffrage** ou d’accompagnement concret, l’équipe vous reçoit sur la page **/botolink** (formulaire et créneaux).\n\n" +
      "En attendant, dites-moi surtout **ce que vous voulez améliorer** (support, prise de rendez-vous, automatisation, etc.) et je vous pointe la bonne section du site.",
  },
  {
    category: "devis",
    patterns: [
      "devis",
      "demande",
      "proposition",
      "quote",
      "estimer",
      "estimation",
      "projet",
      "besoin",
      "personnalisé",
      "sur mesure",
      "comment obtenir",
    ],
    reply:
      "Pour un **accompagnement** ou une **estimation** adaptée, le chemin prévu sur le site est **/botolink** :\n\n" +
      "• formulaire de prise de contact\n" +
      "• possibilité de réserver un **échange** (durée indiquée sur place)\n\n" +
      "D’ici là, je peux vous aider à **cibler** le bon pôle (lab, works, link). C’est plutôt **bâtir un chatbot**, **automatiser un flux**, ou **un audit / stratégie** ?",
  },
  {
    category: "delai",
    patterns: [
      "délai",
      "delai",
      "temps",
      "semaine",
      "mois",
      "rapide",
      "urgent",
      "vite",
      "quand",
      "livraison",
      "durée",
      "durée du projet",
      "combien de temps",
    ],
    reply:
      "Les **délais** dépendent de ce que vous lancez (périmètre, intégrations, validation). Ici, je ne donne **pas** de chiffre contractuel : c’est l’**équipe** qui vous les confirmera sur **/botolink** après cadrage.\n\n" +
      "Côté site, l’esprit c’est : **phases** (cadrage, conception, itérations) — le détail est dans les fiches **/botolab** et dans l’échange humain.\n\n" +
      "Vous avez une **échéance** métier (lancement, saison, migration) en tête ?",
  },
  {
    category: "roi",
    patterns: [
      "roi",
      "retour sur investissement",
      "résultat",
      "résultats",
      "efficace",
      "efficacité",
      "économie",
      "économiser",
      "gain",
      "bénéfice",
      "avantage",
      "performance",
      "amélioration",
      "impact",
    ],
    reply:
      "Côté **bénéfices**, l’idée en général est de **gagner du temps**, **mieux orienter** les demandes, ou **réduire** le charge manuel — les cas varient par secteur.\n\n" +
      "Le site met en avant des **pistes** (BoToHub, BoToLab, réalisations sur **/botoworks**). Pour un **cadrage** chiffré, c’est **/botolink**.\n\n" +
      "Votre priorité, c’est plutôt **le service client**, **les ventes**, ou **l’opérationnel interne** ?",
  },
  {
    category: "rendez-vous",
    patterns: [
      "rendez-vous",
      "rdv",
      "réserver",
      "réservation",
      "agenda",
      "créneau",
      "disponible",
      "appel",
      "appel découverte",
      "rencontrer",
      "parler",
      "contact",
      "contactez",
      "rencontrons",
      "génération de rendez-vous",
      "booking",
    ],
    reply:
      "Pour **prendre contact** ou **réserver un moment** avec l’équipe, l’**entrée prévue** est la page **/botolink** (formulaire + créneaux selon ce qui est affiché).\n\n" +
      "Ici, je ne fais qu’**orienter** : vous avez besoin d’un **échange** avant de lire toutes les fiches, ou vous préférez d’abord feuilleter **/botolab** ?",
  },
  {
    category: "agent-ia",
    patterns: [
      "agent ia",
      "agent",
      "autonome",
      "automatisation",
      "automatiser",
      "workflow",
      "processus",
      "tâche",
      "répétitif",
      "rpa",
      "automate",
      "pipeline",
    ],
    reply:
      "Un **agent IA** enchaîne souvent des **actions** (lecture, décision, envoi, mise à jour) plutôt qu’une seule boîte de dialogue.\n\n" +
      "Suivant l’**outil** et le **flux**, la mise en forme est du sur-mesure — décrite sur **/botolab** et ajustée en **/botolink**.\n\n" +
      "Quel type de tâche souhaitez-vous enchaîner en premier (e-mails, CRM, dossiers, autre) ?",
  },
  {
    category: "contenu",
    patterns: [
      "contenu",
      "content",
      "article",
      "blog",
      "post",
      "rédaction",
      "texte",
      "copywriting",
      "email",
      "newsletter",
      "fiche produit",
      "description",
    ],
    reply:
      "Le volet **contenu** (articles, visuels textuels, rythme) est présenté dans l’accompagnement type **/botolab** : objectif, ton, canaux — sans catalogue de prix ici.\n\n" +
      "Si vous avez un **ton de marque** et des **cibles** (SEO, social, e-mail), notez-les pour l’**équipe** sur **/botolink**.\n\n" +
      "Vous ciblez plutôt **le site**, **les réseaux**, ou **l’e-mail** ?",
  },
  {
    category: "social-media",
    patterns: [
      "social",
      "réseaux sociaux",
      "instagram",
      "linkedin",
      "facebook",
      "twitter",
      "tiktok",
      "community",
      "community manager",
      "publication",
      "posts",
      "stories",
      "reels",
    ],
    reply:
      "Côté **social**, l’idée est souvent d’**aligner** rythme, style et ressources — le détail se voit en **/botolab** et avec l’équipe quand vous êtes prêt sur **/botolink**.\n\n" +
      "Quels canaux vous **utilisez** déjà aujourd’hui ?",
  },
  {
    category: "seo",
    patterns: [
      "seo",
      "référencement",
      "google",
      "search",
      "moteur de recherche",
      "classement",
      "position",
      "organique",
      "trafic",
      "visibilité",
    ],
    reply:
      "Le volet **SEO** est traité en **/botolab** (contenu, structure, suivi) — ici, je m’en tiens à l’**orientation**.\n\n" +
      "Pour un plan adapté, **/botolink**.\n\n" +
      "Avez-vous un **site** existant et un objectif (local, e-commerce, marque) ?",
  },
  {
    category: "realisations",
    patterns: [
      "réalisation",
      "réalisations",
      "portfolio",
      "exemple",
      "exemples",
      "référence",
      "client",
      "clients",
      "projet réalisé",
      "case study",
      "voir",
      "montrez",
      "travaux",
      "work",
    ],
    reply:
      "Les **exemples** de travaux et la **dynamique** des projets sont sur **/botoworks** (BoToWorks).\n\n" +
      "C’est l’endroit indiqué pour le **côté inspiration** — pas de grille tarifaire.\n\n" +
      "Vous avez un **secteur** en tête pour filtrer ce que vous cherchez ?",
  },
  {
    category: "contact",
    patterns: [
      "contact",
      "email",
      "mail",
      "téléphone",
      "phone",
      "whatsapp",
      "écrire",
      "joindre",
      "atteindre",
      "coordonnées",
      "adresse",
      "localisation",
    ],
    reply:
      "• **Prise de contact & rendez-vous** : page **/botolink** (BoToLink)\n" +
      "• **Explorer le site** : **/botohub** (BoToHub) pour l’essentiel des offres côté vitrine\n\n" +
      "L’e-mail d’**accueil public** (icône enveloppe du site) : voir le bandeau / pied de page — je ne mémorise pas d’adresse ici en temps réel.\n\n" +
      "Vous voulez **un formulaire** ou d’**abord** parcourir le hub ?",
  },
  {
    category: "about",
    patterns: [
      "qui",
      "vous êtes",
      "botoologia",
      "entreprise",
      "équipe",
      "fondateur",
      "histoire",
      "about",
      "présentation",
      "présenter",
      "expliquez",
    ],
    reply:
      "**BoToLogIA** : agence orientée **IA appliquée** aux entreprises, avec des volets **stratégie** et **réalisation** (voir **/botohub**).\n\n" +
      "Moi, **BotoAssist**, j’aide seulement à **naviguer** le site et à comprendre **où cliquer** — pas de pitch commercial ici.\n\n" +
      "Souhaitez-vous d’**abord** l’**offre** (hub), les **fiches** (lab), ou la **prise de contact** (link) ?",
  },
  {
    category: "objection-prix",
    patterns: [
      "trop cher",
      "pas les moyens",
      "budget limité",
      "coûte trop",
      "pas le budget",
      "expensive",
      "abordable",
      "moins cher",
      "réduire",
    ],
    reply:
      "Je comprends. **Les montants** ne se négocient pas dans ce tchat : c’est le rôle de l’**équipe** sur **/botolink** de proposer un **périmètre** clair et cohérent.\n\n" +
      "Ici, je peux vous aider à **choisir la bonne entrée** (quoi lire, quoi prioriser) avant cet échange.\n\n" +
      "C’est plutôt **le support** ou **l’automatisation** qui vous tient le plus à cœur ?",
  },
  {
    category: "objection-temps",
    patterns: [
      "pas le temps",
      "trop occupé",
      "débordé",
      "pas disponible",
      "compliqué",
      "complexe",
      "difficile",
      "technique",
      "on sait pas",
    ],
    reply:
      "Côté **implication** client, l’idée en général est de **découper** (cadrage, validations, mises en ligne) plutôt que de tout en une fois — le calendrier exact se valide en **/botolink**.\n\n" +
      "On peut d’**abord** cibler **une brique** (chatbot, agent, contenu) pour avancer sereinement.\n\n" +
      "Avez-vous un **horizon** (trimestre, lancement) en tête ?",
  },
  {
    category: "merci",
    patterns: [
      "merci",
      "super",
      "parfait",
      "génial",
      "top",
      "excellent",
      "nickel",
      "impeccable",
      "bravo",
      "bien",
      "ok",
      "okay",
      "d'accord",
      "compris",
    ],
    reply:
      "Avec plaisir !\n\n" +
      "Si vous voulez aller plus loin : **/botolink** (contact) · **/botoworks** (réalisations) · **/botolab** (détail des volets).\n\n" +
      "Autre point à clarifier ?",
  },
  {
    category: "concurrence",
    patterns: [
      "concurrent",
      "concurrents",
      "comparaison",
      "mieux que",
      "différence",
      "autre agence",
      "pourquoi vous",
      "avantage",
      "unique",
    ],
    reply:
      "Côté **positionnement**, l’objectif de BoToLogIA est l’**IA sur mesure** et l’**accompagnement** (voir **/botohub**), pas un comparatif ici en live.\n\n" +
      "Les **travaux** visibles : **/botoworks**.\n\n" +
      "Votre critère, c’est plutôt **délai**, **périmètre**, ou **type de produit** ?",
  },
  {
    category: "au-revoir",
    patterns: [
      "au revoir",
      "bye",
      "à bientôt",
      "ciao",
      "bonne journée",
      "bonne soirée",
      "goodbye",
      "à plus",
      "à tout à l'heure",
    ],
    reply:
      "Au revoir !\n\n" +
      "Pensez à **/botolink** quand vous voudrez un **échange** avec l’équipe.\n\n" +
      "BotoAssist / BoToLogIA",
  },
];

// ════════════════════════════════════════════
// MOTEUR DE RECHERCHE DE RÉPONSE
// ════════════════════════════════════════════

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findBestMatch(
  input: string,
  entries: KnowledgeEntry[] = knowledgeBase
): KnowledgeEntry | null {
  const normalized = normalize(input);
  const words = normalized.split(" ");

  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    let score = 0;

    for (const pattern of entry.patterns) {
      const normalizedPattern = normalize(pattern);
      if (!normalizedPattern || normalizedPattern.length < 2) continue;

      if (normalized.includes(normalizedPattern)) {
        score += normalizedPattern.split(" ").length * 3;
      }

      const patternWords = normalizedPattern.split(" ").filter((w) => w.length > 1);
      for (const pw of patternWords) {
        if (pw.length > 2 && words.includes(pw)) {
          score += 1;
        }
      }

      for (const word of words) {
        if (word.length > 3 && normalizedPattern.includes(word)) {
          score += 0.5;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestScore >= 1 ? bestMatch : null;
}

const DEFAULTS = [
  "Je suis **BotoAssist** — dites-moi ce que vous cherchez : **/botohub** (vue d’ensemble), **/botolab** (détail des volets), **/botoworks** (réalisations), **/botolink** (prise de contact). Quelle page voulez-vous cadrer en premier ?",
  "Bonne question. Pour l’**orientation**, on peut cibler une **section** du site. Souhaitez-vous d’**abord** comprendre l’**offre**, un **exemple** de travaux, ou **contacter** l’équipe ?",
  "Pour aller plus loin qu’un rappel général : **/botolink** pour l’**équipe humaine** — ici, je ne fais qu’**indiquer** les bons onglets. Un mot sur votre **contexte** (secteur, outil) ?",
];

/** Réponse instantanée (texte seul). Compatible API : retourne aussi { text, link } pour lien optionnel. */
export function getReply(input: string): string;
export function getReply(input: string, withLink: true): { text: string; link?: { href: string; label?: string } };
export function getReply(
  input: string,
  withLink?: boolean
): string | { text: string; link?: { href: string; label?: string } } {
  const match = findBestMatch(input);

  if (match) {
    const text = match.reply;
    if (withLink) {
      const link =
        match.category === "devis" || match.category === "rendez-vous" || match.category === "contact" || match.category === "prix"
          ? { href: "/botolink", label: "BoToLink" }
          : match.category === "realisations"
            ? { href: "/botoworks", label: "BoToWorks" }
            : match.category === "about" || match.category === "services"
              ? { href: "/botohub", label: "BoToHub" }
              : match.category === "chatbot" || match.category === "agent-ia" || match.category === "contenu" || match.category === "seo" || match.category === "social-media" || match.category === "delai" || match.category === "roi"
                ? { href: "/botolab", label: "BoToLab" }
                : undefined;
      return { text, link };
    }
    return text;
  }

  const text = DEFAULTS[Math.floor(Math.random() * DEFAULTS.length)];
  if (withLink) return { text, link: { href: "/botolink", label: "BoToLink" } };
  return text;
}
