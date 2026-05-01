/**
 * Projets affichés (BoToWorks, données structurées) — descriptions factuelles, pas de KPI inventés.
 */

export type PortfolioProject = {
  slug: string;
  name: string;
  category: string;
  description: string;
  imagePath: string;
  imageAlt: string;
  externalUrl?: string | null;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "creative-botoschool",
    name: "BoToSchool — Portail IA estudiantin",
    category: "Éducation",
    description:
      "Plateforme intelligente dédiée aux établissements scolaires, avec espaces Étudiant, Parent, Professeur et Administration pour centraliser la scolarité, la communication et le suivi pédagogique.",
    imagePath: "/images/projects/botoschool-portail-ia.svg",
    imageAlt: "BoToSchool — Portail IA estudiantin",
    externalUrl: null,
  },
  {
    slug: "creative-methodix",
    name: "Methodix — Correcteur IA",
    category: "Éducation",
    description:
      "Solution de soutien scolaire en ligne avec correcteur d’exercices par intelligence artificielle, pensée pour accompagner les élèves du Maroc.",
    imagePath: "/images/projects/correcteur-ia-methodix.svg",
    imageAlt: "Methodix — Correcteur IA",
    externalUrl: null,
  },
  {
    slug: "creative-botosquad",
    name: "BotoSquad — Automatisation IA",
    category: "Automatisation éditoriale",
    description:
      "Workflow intelligent d’automatisation éditoriale reliant planification, génération IA, publication API et revalidation Vercel.",
    imagePath: "/images/projects/automatisation-ia-botosquad.svg",
    imageAlt: "BotoSquad — Automatisation IA",
    externalUrl: "https://botosquad-main.vercel.app/",
  },
  {
    slug: "creative-inoxya",
    name: "Inoxya — Site e-commerce",
    category: "E-commerce",
    description:
      "Boutique en ligne premium pour bijoux en acier inoxydable 316L avec interface moderne et expérience d’achat optimisée.",
    imagePath: "/images/projects/inoxya-ecommerce.svg",
    imageAlt: "Inoxya — Site e-commerce",
    externalUrl: null,
  },
];
