/**
 * Briefings holo BoToLab : sections avec titres SEO (tendances 2026) + paragraphes.
 * Mots-clés ciblés : recherche générative, E-E-A-T, contenu utile, signaux d’expérience,
 * sémantique / entités, performance & Core Web Vitals, accessibilité, conformité.
 */

export type BotolabServiceSection = {
  title: string;
  paragraphs: string[];
};

export const BOTOLAB_SERVICE_SECTIONS: Record<string, BotolabServiceSection[]> = {
  "1": [
    {
      title: "Chatbot IA & SEO 2026 : intention, réponses, visibilité",
      paragraphs: [
        "En 2026, le référencement ne se joue plus seulement sur des pages figées : la recherche générative, les aperçus assistés par l’IA et la recherche conversationnelle poussent les marques à structurer leurs réponses par intention (informationnelle, transactionnelle, support). Un chatbot IA bien cadré devient un prolongement de votre stratégie de contenu : il aligne le vocabulaire produit, les entités nommées et les balises sémantiques (FAQ, how-to) avec ce que les moteurs attendent d’un site « utile, fiable, démontrable » (E-E-A-T). Vous gagnez en cohérence cross-canal et en signaux d’engagement, qui nourrissent l’autorité de domaine plutôt que de disperser l’utilisateur entre PDF obsolètes et tickets sans suite.",
        "Sur le plan opérationnel, l’enjeu est d’orchestrer grands modèles de langage, base de connaissances versionnée, connecteurs CRM et télémétrie : sans ce socle, on obtient de belles démos et peu de résultats en production. Les indicateurs 2026 à suivre vont du taux de résolution au premier contact (FCR) au taux d’abandon, en passant par la courtoisie perçue et le transfert propre vers un humain lorsque l’enjeu l’exige. Un assistant conversationnel n’est performant que s’il est mesurable, itérable, et gouverné.",
      ],
    },
    {
      title: "Expérience, confiance, conformité (RGPD & IA en entreprise)",
      paragraphs: [
        "Les moteurs valorisent l’explicabilité et la clarté des politiques, la traçabilité des personnalisations, et l’évitement des réponses « invérifiées » sur des sujets sensibles (YMYL). Côté marque, le ton, le style et les règles de conformité sectorielle s’intègrent dès la conception, ce qui limite les risques et renforce la confiance, facteur d’E-E-A-T. La disponibilité 24/7, multilingue et multicanal, n’est utile qu’avec un consentement propre, des journaux exploitables sans fuite, et un schéma de données d’entraînement gouverné.",
        "Bref : le chatbot n’est plus un widget gadget ; c’est l’interface vivante d’une promesse SEO moderne, qui transforme l’intention d’un internaute en parcours maîtrisé. BoTooLogIA vous accompagne vers ce standard 2026 : de la feuille de route cas d’usage à la preuve d’impact (gain de temps, CSAT, volume dévié, qualité de résolution), pour bâtir un canal d’acquisition & de rétention durable.",
      ],
    },
  ],

  "2": [
    {
      title: "Automatisation IA : productivité et signaux d’excellence 2026",
      paragraphs: [
        "L’automatisation intelligente s’inscrit dans la continuité des objectifs 2025–2026 : moins d’opacité, plus de piste d’audit, des métriques avant/après, et des interfaces qui réduisent la friction. Les moteurs et les outils d’analyse s’appuient de plus en plus sur des signaux d’exploitation saine (temps de cycle, taux d’échec, reprise, traçabilité) pour distinguer les dispositifs sérieux des gadgets. L’intelligence artificielle va au-delà du RPA : interprétation de documents, détection d’anomalies, file d’attente priorisée, et orchestration contextuelle lorsque de simples règles ne suffisent plus.",
        "L’enjeu n’est pas de « remplacer les humains » sans critères, mais d’éliminer le faible degré d’apport, de remonter l’expertise là où la décision l’exige, et d’enregistrer la preuve de ce qui a été fait, pour alimenter reporting et amélioration continue — aligné sur les exigences de gouvernance (RGPD, secteurs réglementés, IA Act dans l’UE). C’est l’excellence opérationnelle devenue explicable, mesurable, défendable.",
      ],
    },
    {
      title: "Gouvernance, données fiables, performance mesurable",
      paragraphs: [
        "Sans données propres, garde-fous d’audit et rituels d’arbitrage, l’automatisation accélère la médiocrité. Avec un cadre, elle devient un multiplicateur de productivité : absorber des pics, intégrer de nouveaux canaux, réduire le stress des équipes, et améliorer l’expérience client — ce qui, indirectement, nourrit l’E-E-A-T de votre offre (preuves, délais, qualité de réponse) et stabilise le SEO de marque (réputation, NPS, avis, retours de terrain).",
        "Chaque anomalie détectée enrichit le référentiel, chaque ajustement affine le modèle, et l’entreprise gagne en résilience. BoTooLogIA pose les jalons 2026 : cartographie de flux, priorisation, indicateurs, et industrialisation, pour que la pression de la productivité se traduise en structure durable, justifiable, et conforme à vos obligations.",
      ],
    },
  ],

  "3": [
    {
      title: "Data & prédiction : de la requête business au signal actionnable (SEO data 2026)",
      paragraphs: [
        "L’analyse prédictive transforme la data en scénarios : anticiper plutôt que commenter. En 2026, les feuilles de route data doivent lier gouvernance, qualité, explicabilité et impact métier. Les moteurs et les outils d’intelligence s’enrichissent d’entités, de cohérence sémantique, et d’histoire de contenus — côté marketing comme supply chain, maintenance, risque ou fraude. Un modèle performant n’a de valeur qu’en production : intégré aux rituels, accepté par les métiers, suivi (dérive, biais, robustesse) avec reprise d’arbitrage humain.",
        "Côté acquisition et rétention, la prévision permet de personnaliser l’offre, de dimensionner le stock, d’anticiper la panne, de segmenter des audiences à fort potentiel, et d’enrichir les contenus piliers (insights vérifiables) utiles en recherche générative. Les mots-clés seuls ne suffisent plus : la priorité, c’est l’expertise démontrée et la clarté des preuves.",
      ],
    },
    {
      title: "Confiance, conformité, itérations sereines",
      paragraphs: [
        "Les exigences (biais, audit, explicabilité) se gèrent par design : cahier des jeux, tests de solidité, monitoring en service, transparence des limites. C’est l’importance d’une culture de la preuve : vitesse sans imprudence, signaux lus en contexte, et arbitrage explicite lorsque l’humain reste l’ultime garant — exactement la posture 2026 attendue en SEO d’entreprise, où la fiabilité du message prime sur le volume de pages brutes produites par l’IA.",
        "Avec BoTooLogIA, vous avancez vers des décisions « intention + données + risque » documentées, pour orienter l’effort vers l’impact maximal et limiter les surprises coûteuses, tout en capitalisant sur la donnée de première partie intéressante pour l’E-E-A-T (preuves, retours, études, benchmarks internes soigneusement partagés).",
      ],
    },
  ],

  "4": [
    {
      title: "CRM & workflows : intégrité de la relation client (SEO de marque 2026)",
      paragraphs: [
        "Un CRM reflet du réel et des workflows fiables sont des piliers de la marque 2026 : moins d’incohérence, plus de preuve. Les doubles saisies, relances orphelines et devises « qui traînent » dégradent NPS, avis, et cohérence de récit — le trio qui alimente E-E-A-T (expérience vécue) et, indirectement, les signaux de notoriété et de requêtes de marque. L’intelligence artificielle agit ici en orchestrateur : prochaine étape recommandée, champs assistés, scoring, synthèse d’échange, tâches générées, sans perdre l’humain quand l’enjeu l’impose.",
        "Techniquement, intégrations robustes, idempotence, reprise, et gouvernance d’identités sont incontournables. Stratégiquement, c’est l’exécution reproductible de la promesse commerciale : une relation omni-canal crédible, chaque interaction documentée, chaque preuve retraçable — élément clé d’une conformité 2025–2026 (traçabilité, consentement, rôles) et d’un SEO d’image aligné (pages services, help center, contenus piliers) avec la réalité vécue par le client.",
      ],
    },
    {
      title: "Du connecteur scripté au système d’amélioration continue",
      paragraphs: [
        "La promesse 2026 n’est plus « on branche un outil » : on redessine l’enchaînement des moments de vérité, on mesure, on corrige, on publie des preuves (cas, chiffres, process). BoTooLogIA structure cette industrialisation : vente, service, suivi, reporting partagé, et documentation qui nourrit vos contenus d’expert (FAQ, playbooks) utiles en recherche générative, sans décalage entre ce que dit le site et ce que vivent les équipes.",
        "Ainsi, CRM et automatisations deviennent le socle d’une marque recherchée et recommandée : moins d’oublis, des cycles plus courts, une preuve d’excellence qu’on peut citer, chiffrer, et retranscrire en contenus SEO haute valeur.",
      ],
    },
  ],

  "5": [
    {
      title: "Site, app, contenu IA : performance, accessibilité & visibilité 2026",
      paragraphs: [
        "Le SEO 2026 exige un écosystème cohérent : infrastructure rapide, mobile-first, internationalisation, accessibilité (WCAG), signaux d’expérience (CWV) et sémantique propre. L’intelligence générative accélère la production texte, vidéo, image ou audio, mais l’E-E-A-T impose validation humaine, droits, homogénéité, tests utilisateurs, et suivi d’usage — faute de quoi, le volume d’UGC-IA inutile pèse négativement. Le contenu utile, cité, expérimenté, lié à des preuves, domine le bruit généré.",
        "Côté produit, modularité, design system, observabilité et TCO d’exploitation fixent l’enveloppe 2025–2026. Côté acquisition, l’on-site doit dialoguer sans rupture avec le self-service, le help, la prise de contact en ligne : c’est l’E-E-A-T d’exécution, pas de slogan. L’auteur humain, le cadre de revue, et l’alimentation en données de qualité (études, logs anonymisés, cas) nourrissent l’entité de marque, les clusters thématiques, et l’entraînement des assistants clients.",
      ],
    },
    {
      title: "Un parcours unique, une marque d’entité, une story vérifiable",
      paragraphs: [
        "L’enjeu n’est plus « publier 500 pages par mois par IA » ; c’est bâtir une preuve d’expertise — rapports, recherches, démos, comparatifs — qu’on peut citer, relier, et rechercher, y compris dans un univers de réponses génératives où la citation d’entités de confiance fera la différence. BoTooLogIA aligne objectif business (conversion, LTV, self-service) avec architecture technique, API, pipeline de contenu enrichi, signée et contrôlée, pour un SEO durable et un risque d’image maîtrisé.",
        "Ainsi, site + app + contenus IA forment un récit continu : l’utilisateur n’a jamais à douter s’il est « encore chez vous » entre blog, outil, et support — c’est l’E-E-A-T incarné, l’atout majeur 2026 face à la guerre d’attention et aux aperçus automatisés.",
      ],
    },
  ],

  "6": [
    {
      title: "Voice & recherche 2026 : zéro friction, entité, inclusion",
      paragraphs: [
        "La voix s’inscrit dans la vague « recherche zéro clic » + besoins d’inclusion (accessibilité) et d’omni-canal. Les voicebots, lorsqu’ils sont bâtis proprement, s’appuient sur de la compréhension du langage parlé, du débruitage, et des transferts contextuels vers l’agent humain — cohérents avec le récit SEO d’entité (nom de marque, offres, politiques) et la qualité d’échantillon audio pour la modération. En 2026, les moteurs et assistants valorisent la cohérence d’intention entre FAQ web, fiches produit, contenus piliers et scripts vocaux : même terminologie, mêmes entités, mêmes limites annoncées.",
        "Côté entreprise, c’est l’opportunité d’un premier contact 24/7, multilingue, gouverné, utile, avec mesures d’abandon, de résolution, de durée, de courtoisie perçue, et d’up-sell quand c’est raisonnable — le tout intégré à votre CRM, comme pour le chat, pour alimenter signaux, avis, et rétention. Les contraintes (consentement, rétention, biais) se traitent en architecture, pas en improvisation.",
      ],
    },
    {
      title: "Continuité de service, E-E-A-T de « ce qui s’est réellement passé »",
      paragraphs: [
        "D’un point de vue humain, c’est moins d’usure sur les consignes répétées, et plus d’espace pour l’expertise. D’un point de vue SEO de marque, c’est moins d’écart entre promesse en ligne (pages d’aide) et expérience réelle au standard vocal — gage de confiance 2025–2026, où l’E-E-A-T repose en grande partie sur avis, retours et cohérence d’histoire. Un voicebot « sérieux » reprend la même sémantique, les mêmes règles, les mêmes troncatures qu’un assistant écrit, pour une seule entité d’offre, sur tous les canaux.",
        "BoTooLogIA vous guide pour investir tôt, avec méthode : cadrage, design conversationnel, tests terrain, gouvernance, et itérations guidées par les chiffres — afin d’ancrer le vocal dans un univers SEO global (FAQ, sitemap, fiches) et bâtir une authentique continuité de service, là où l’attente a toujours pesé le plus lourd : au bout du fil.",
      ],
    },
  ],
};

export function getBotolabServiceSections(
  id: string
): BotolabServiceSection[] {
  return BOTOLAB_SERVICE_SECTIONS[id] ?? [];
}

/** @deprecated Utiliser getBotolabServiceSections + sections structurées */
export function getBotolabServiceLongForm(id: string): string {
  const s = getBotolabServiceSections(id);
  if (s.length === 0) return "";
  return s
    .map((sec) => [sec.title, ...sec.paragraphs].join("\n\n"))
    .join("\n\n");
}
