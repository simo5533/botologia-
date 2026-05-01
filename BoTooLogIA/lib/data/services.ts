/**
 * Données des 6 services IA — BoToHub, BoToLab et JSON-LD Service
 */

export const services = [
  {
    id: "1",
    title: "Développement de Chatbots IA",
    description:
      "Assistants conversationnels sur le web ou la messagerie : FAQ intelligente, qualification des demandes et intégration à votre système d’information.",
    icon: "Bot",
  },
  {
    id: "2",
    title: "Automatisation des Processus",
    description:
      "Enchaînement de tâches répétitives (saisie, transferts de données, validations) avec contrôle qualité et traçabilité.",
    icon: "Settings",
  },
  {
    id: "3",
    title: "Analyse Prédictive",
    description:
      "Exploitation de vos données pour anticiper la demande, prioriser les actions ou simplifier les tableaux de bord décisionnels.",
    icon: "BarChart3",
  },
  {
    id: "4",
    title: "CRM & Workflow Automatisé",
    description:
      "Connexion CRM, ERP ou outils métiers : synchronisation des fiches, relances, exports et scénarios métiers sur mesure.",
    icon: "ClipboardList",
  },
  {
    id: "5",
    title: "Sites, applications & contenu IA",
    description:
      "Sites web et applications avec parcours utilisateur clair ; à la demande, usage d’outils d’IA pour texte, image, audio ou vidéo selon votre charte.",
    icon: "Globe",
  },
  {
    id: "6",
    title: "Voicebots IA",
    description:
      "Parcours vocaux pour accueil, routage ou support : conception des scénarios, reconnaissance vocale et branchement vers vos services.",
    icon: "Headphones",
  },
] as const;
