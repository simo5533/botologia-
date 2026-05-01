/**
 * Prise de rendez-vous (créneaux) — Cal.com, Calendly, etc.
 * Priorité : NEXT_PUBLIC_BOOKING_URL ; sinon mailto avec sujet RDV.
 */

const RDV_SUBJECT = "Rendez-vous 30 min — BoTooLogIA";

export function getBookingUrl(): string | undefined {
  const u = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  return u || undefined;
}

/** true si le lien créneau ouvre un outil externe (nouvel onglet) */
export function isExternalCreneauLink(): boolean {
  const u = getBookingUrl();
  return !!u && /^https?:\/\//i.test(u);
}

/** URL pour « Choisir un créneau » / « Réserver un créneau » */
export function resolveCreneauHref(): string {
  const booking = getBookingUrl();
  if (booking) return booking;
  const email =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "contact@botoologia.com";
  return `mailto:${email}?subject=${encodeURIComponent(RDV_SUBJECT)}`;
}
