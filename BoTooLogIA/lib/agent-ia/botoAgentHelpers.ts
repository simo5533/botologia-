/**
 * Normalisation des tours de conversation pour les LLM (p.ex. Anthropic exige
 * un premier message "user" — l’accueil assistant côté UI est retiré, le rôle
 * de BOTO reste dans le system prompt).
 */
export function normalizeLlmMessages(
  messages: { role: string; content: string }[]
): { role: "user" | "assistant"; content: string }[] {
  const m = messages.filter(
    (x) => x && typeof x.content === "string" && x.content.trim().length > 0
  );
  let start = 0;
  while (start < m.length && m[start].role === "assistant") {
    start++;
  }
  const rest = m.slice(start);
  if (rest.length === 0) {
    return [{ role: "user", content: "Bonjour" }];
  }
  return rest
    .filter((x) => x.role === "user" || x.role === "assistant")
    .map((x) => ({ role: x.role as "user" | "assistant", content: x.content }));
}

const PRICE_INTENT_RE =
  /(prix|tarif|tarifs|coût|coûte|coûtent|budget|devis|combien|€|eur\b|euro|euros|factur|tjm|grille\s*tarif|forfait|abonnement|how\s*much|price|pricing|quote|quotation|cost|fee|fees|billing|subscription|\$\s*\d|usd\b)/i;

export function isPriceOrTariffIntent(text: string): boolean {
  return PRICE_INTENT_RE.test(text);
}

/**
 * Rappel court, injecté en fin de system prompt (dernier mot = plus respecté
 * par le modèle) lorsque l’utilisateur parle d’argent / tarif.
 */
export const PRICE_LOCK_SUFFIX = `

[CONSIGNE OBLIGATOIRE — CE TOUR — POSTURE COMMERCIAL SENIOR]
Le dernier message de l’utilisateur porte sur le tarif, le prix, le budget, le devis ou le coût.
- Tu restes ferme et professionnel : **zéro** chiffre (euros, dollars, forfaits, abonnements, heures x prix, fourchettes, « à partir de »).
- Tu n’invente aucun exemple tarifaire « pour aider ».
- Tu expliques en **une ou deux phrases** que chaque projet est cadré avec un **humain** et que le **seul** canal pour un chiffrage fiable est la page **/botolink** (prise de contact, créneau, proposition).
- Termine par **une** question de qualification (secteur, enjeu #1, délai) si pertinent.`;

export const PRICE_LOCK_SUFFIX_EN = `

[MANDATORY — THIS TURN — SENIOR COMMERCIAL TONE]
The user's last message is about price, budget, quote, "how much", or cost.
- Zero dollar/euro amounts, no ranges, no day rates, no invented "ballparks" to be helpful.
- In one or two sentences: scoping is always with a human; the only place for a reliable quote is the **/botolink** page (contact and booking).
- End with one qualification question (sector, main pain, timing) if relevant.`;

const EURO_IN_TEXT =
  /(\d[\d\s\u00A0,]*)(?:[.,]\d+)?\s*(?:€|euros?|eur\b)(?!\s*(?:%|pour cent|jours?|semain|mois|h\b))/gi;

function hasEuroAmount(text: string): boolean {
  return /(\d[\d\s\u00A0,]*)(?:[.,]\d+)?\s*(?:€|euros?|eur\b)/i.test(text);
}

/**
 * Filet de sécurité : si le modèle insère quand même des montants en €
 * (surtout quand l’utilisateur a parlé de prix), on les remplace.
 */
export function stripEuroAmountsInReply(
  text: string,
  userMentionedPrice: boolean
): string {
  if (!userMentionedPrice && !hasEuroAmount(text)) {
    return text;
  }
  let t = text.replace(EURO_IN_TEXT, "— (chiffrage sur /botolink) —");
  t = t.replace(/\s*—\s*—/g, " —").replace(/(\s*—\s*){2,}/g, " — ");
  if (userMentionedPrice && !/botolink/i.test(t)) {
    t = `${t.trim()}\n\nPour un devis, rendez-vous sur /botolink avec l’équipe.`;
  }
  return t;
}