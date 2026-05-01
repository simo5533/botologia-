/**
 * Données de navigation — liens publics et admin
 */

export const publicNavLinks = [
  { href: "/botohub#banner", label: "BoToHub" },
  { href: "/botolab", label: "BoToLab" },
  { href: "/botoworks", label: "BoToWorks" },
  { href: "/botoadvantage", label: "BoToAdvantage" },
  { href: "/botolink", label: "BoToLink" },
] as const;

export const adminNavLinks = [
  { href: "/botoadmin", label: "Dashboard" },
  { href: "/botoadmin/stats", label: "Statistiques" },
  { href: "/botoadmin/tables", label: "Tables" },
] as const;
