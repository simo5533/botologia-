/**
 * Liens réseaux sociaux — Header.
 * Réseaux : NEXT_PUBLIC_* optionnels. E-mail icône : botoologia@gmail.com (fixe).
 */

/** Adresse de l’agence (icône enveloppe, contact public). */
export const SOCIAL_INBOX_EMAIL = "botoologia@gmail.com" as const;

/** mailto avec sujet + corps préremplis pour ouvrir un message vers l’agence. */
export const SOCIAL_INBOX_MAILTO =
  `mailto:${SOCIAL_INBOX_EMAIL}` +
  `?subject=${encodeURIComponent("Contact — BoTooLogIA")}` +
  `&body=${encodeURIComponent(
    "Bonjour,\n\nJe vous contacte depuis le site BoTooLogIA.\n\nCordialement,\n"
  )}`;

export interface SocialLink {
  href: string;
  label: string;
  isExternal: boolean;
}

export const socialLinks: SocialLink[] = [
  {
    href:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      "https://www.instagram.com/botoologia/",
    label: "Instagram",
    isExternal: true,
  },
  {
    href:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ??
      "https://www.linkedin.com/in/botoologia-agence-792b563bb/",
    label: "LinkedIn",
    isExternal: true,
  },
  {
    href:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ??
      "https://www.facebook.com/profile.php?id=61582286488337",
    label: "Facebook",
    isExternal: true,
  },
  {
    href: SOCIAL_INBOX_MAILTO,
    label: "Email",
    isExternal: false,
  },
];
