/**
 * Sélection de la voix du bot : homme charismatique et professionnel (réponse en bot).
 * Utilisé par l'Agent IA (Botohub) et le widget chat (ChatComposer).
 */

const MALE_VOICE_HINTS = [
  "male",
  "homme",
  "paul",
  "david",
  "marc",
  "thomas",
  "nicolas",
  "mathieu",
  "hugo",
  "louis",
  "roger",  // Microsoft Roger (FR masculin)
];

/** Hints pour une voix synthétique / robotique (thème futuriste du site). */
const ROBOTIC_VOICE_HINTS = [
  "google",
  "microsoft",
  "online",
  "synthetic",
  "compact",
  "enhanced",
  "desktop",
  "mobile",
];

/**
 * Retourne une voix française masculine de préférence (charismatique / professionnelle).
 * Fallback : première voix française disponible.
 */
export function getPreferredMaleFrenchVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  const french = voices.filter((v) => v.lang.toLowerCase().startsWith("fr"));
  if (french.length === 0) return null;
  const france = french.filter((v) => {
    const l = v.lang.toLowerCase();
    return l === "fr-fr" || l.startsWith("fr-fr");
  });
  const pool = france.length > 0 ? france : french;
  const nameLower = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
  const male = pool.find((v) => MALE_VOICE_HINTS.some((hint) => nameLower(v).includes(hint)));
  return male ?? pool[0] ?? null;
}

/**
 * Retourne une voix française à sonorité robotique/synthétique (thème IA du site).
 * Préfère les voix type Google/Microsoft/online. Sinon fallback sur première voix FR.
 */
export function getPreferredRoboticFrenchVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  const french = voices.filter((v) => v.lang.startsWith("fr"));
  if (french.length === 0) return null;

  const nameLower = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
  const robotic = french.find((v) =>
    ROBOTIC_VOICE_HINTS.some((hint) => nameLower(v).includes(hint))
  );
  return robotic ?? french[0] ?? null;
}

/**
 * Voix française masculine + robotique pour l'Agent IA (son robot masculin, thème du site).
 * Priorité : (1) FR + synthétique + masculin, (2) FR + synthétique, (3) FR + masculin, (4) première FR.
 */
export function getPreferredMaleRoboticFrenchVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  const french = voices.filter((v) => v.lang.startsWith("fr"));
  if (french.length === 0) return null;

  const nameLower = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
  const isRobotic = (v: SpeechSynthesisVoice) =>
    ROBOTIC_VOICE_HINTS.some((h) => nameLower(v).includes(h));
  const isMale = (v: SpeechSynthesisVoice) =>
    MALE_VOICE_HINTS.some((h) => nameLower(v).includes(h));

  const maleRobotic = french.find((v) => isRobotic(v) && isMale(v));
  if (maleRobotic) return maleRobotic;
  const robotic = french.find(isRobotic);
  if (robotic) return robotic;
  const male = french.find(isMale);
  if (male) return male;
  return french[0] ?? null;
}

const orderEnglishVoice = (a: SpeechSynthesisVoice, b: SpeechSynthesisVoice): number => {
  const s = (v: SpeechSynthesisVoice) => {
    const l = v.lang.toLowerCase();
    if (l === "en-gb" || l.startsWith("en-gb")) return 0;
    if (l === "en-us" || l.startsWith("en-us")) return 1;
    if (l.startsWith("en")) return 2;
    return 3;
  };
  return s(a) - s(b);
};

/**
 * Voix anglaise (masculine de préférence) — en-GB / en-US en priorité pour une prononciation cohérente.
 */
export function getPreferredMaleEnglishVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  if (english.length === 0) return null;
  const nameLower = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
  const ordered = [...english].sort(orderEnglishVoice);
  const byMale = (arr: SpeechSynthesisVoice[]) =>
    arr.find((v) => MALE_VOICE_HINTS.some((hint) => nameLower(v).includes(hint)));
  return byMale(ordered) ?? ordered[0] ?? null;
}

const EN_FUNC =
  /\b(the|and|for|with|our|are|this|can|we|to|a|in|is|on|at|or|an|as|be|by|it|so|us|get|out|up|not|from|has|your|any|one|per|link|page|help|how|what|which|when|where|about|work|all|I|am|if|or|so|very|me|my|book|meeting|call|quote|price|budget|client|team|time|hi|hello|good|please|need|want|custom|build|automation|chatbot|business|project|do you|can you|would|could|sales|b2b|company|thanks|yes|no|day|way|perimeter|over|back|new|per)\b/gi;
const FR_FUNC =
  /\b(le|la|les|un|une|des|et|ou|nous|vous|pour|avec|dans|sur|que|qui|ce|cette|aussi|bien|chez|votre|notre|être|merci|bonjour|bonsoir|combien|prix|tarif|avez|êtes|sont|tout|plus|c'est|d'une|d'un|fait|également)\b/gi;

/** Dernière question utilisateur : plutôt en anglais ? (heuristique, sans appel API) */
export function isLikelyEnglishUserForBoto(text: string): boolean {
  const t = text.trim();
  if (t.length < 2) return false;
  if (/[àâäéèêëïîôùûüÿçœ]/i.test(t)) return false;
  const en = (t.match(EN_FUNC) || []).length;
  const fr = (t.match(FR_FUNC) || []).length;
  if (en >= fr + 2) return true;
  if (fr > en) return false;
  return /^(hi|hello|hey|good morning|good afternoon|good evening|can you|could you|i |we |how much|what is|do you|please|thanks)\b/i.test(t);
}

const EN_LEAD =
  /^(I'|I |We'|We |The |A |It |This |That |If |In |To |For |With |Is |Are |You |On |As |By |An |Of |At |No |When |What |How |Why |Can |Could |Would |There |Our |My |So |Not |All |After |Let |Please |Thank |Here |Good |First |Yes |No )/i;

/** Réponse BOTO (affichage) : langue pour prononciation TTS (anglais US/GB vs français France). */
export function detectBotoAnswerLanguageForSpeech(text: string): "en" | "fr" {
  if (/[àâäéèêëïîôùûüÿçœ]/i.test(text)) return "fr";
  const t = text.trim();
  const head = t.slice(0, 400);
  const en = (head.toLowerCase().match(EN_FUNC) || []).length;
  const fr = (head.toLowerCase().match(FR_FUNC) || []).length;
  if (en >= fr + 2) return "en";
  if (fr > en) return "fr";
  if (EN_LEAD.test(t) && fr < 2) return "en";
  return "fr";
}

/**
 * BCP 47 à passer à `SpeechSynthesisUtterance` : aligné sur la **voix** quand dispo, sinon repli sûr.
 */
export function bcp47ForBotoPronunciation(
  mode: "en" | "fr",
  voice: SpeechSynthesisVoice | null
): string {
  if (voice?.lang) {
    const l = voice.lang.trim();
    if (l) return l;
  }
  return mode === "en" ? "en-GB" : "fr-FR";
}

/**
 * Prépare le texte pour la synthèse vocale du navigateur.
 * - Conserve `.,;:!?` pour le rythme (sauf variante `lang`).
 * - `lang` : ajuste les tournures (Boto link, et / and, etc.)
 */
export function prepareTextForAgentSpeech(raw: string, lang: "en" | "fr" = "fr"): string {
  let t = raw;
  t = t.replace(/```[\s\S]*?```/g, " ");
  t = t.replace(/`[^`]+`/g, " ");
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/\*([^*]+)\*/g, "$1");
  t = t.replace(/__([^_]+)__/g, "$1");
  t = t.replace(/#{1,6}\s?/g, "");
  t = t.replace(/https?:\/\/[^\s]+/gi, lang === "en" ? " the website mentioned " : " le site indiqué ");
  if (lang === "en") {
    t = t.replace(/\b\/botolink\b/gi, " the Boto link page ");
    t = t.replace(/\b\/botolab\b/gi, " Boto lab ");
    t = t.replace(/\b\/botoworks\b/gi, " Boto works ");
    t = t.replace(/\b\/(botohub|login|register)\b/gi, " the site ");
  } else {
    t = t.replace(/\b\/botolink\b/gi, " la page Boto link ");
    t = t.replace(/\b\/botolab\b/gi, " Boto lab ");
    t = t.replace(/\b\/botoworks\b/gi, " Boto works ");
    t = t.replace(/\b\/(botohub|login|register)\b/gi, " le site ");
  }
  t = t.replace(/…|\.{2,}/g, ".");
  t = t.replace(/[«»""„"']/g, " ");
  t = t.replace(/[—–]/g, ", ");
  t = t.replace(/[()[\]{}]/g, " ");
  if (lang === "en") {
    t = t.replace(/&/g, " and ");
    t = t.replace(/[%]/g, " percent ");
  } else {
    t = t.replace(/&/g, " et ");
    t = t.replace(/[%]/g, " pour cent ");
  }
  t = t.replace(/€/g, " euros ");
  t = t.replace(/[$]/g, " dollars ");
  t = t.replace(/@\w+/g, " ");
  t = t.replace(
    /[^0-9A-Za-z\u00C0-\u02FF\u1E00-\u1F00'’\s.,;:!?-]/g,
    " "
  );
  t = t.replace(/\s*([.,;:!?])\s*/g, "$1 ");
  t = t.replace(/\s{2,}/g, " ");
  return t.trim();
}

export interface SpeakAgentTextCallbacks {
  rate?: number;
  volume?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Synthèse vocale partagée (Agent pleine page + widget) : FR/EN, texte lisible pour TTS,
 * attente `voiceschanged` (Chrome/Android souvent liste vide au premier coup).
 */
export function speakAgentText(
  synth: SpeechSynthesis,
  rawText: string,
  callbacks: SpeakAgentTextCallbacks = {}
): void {
  if (typeof window === "undefined") return;

  synth.cancel();
  const outLang = detectBotoAnswerLanguageForSpeech(rawText);
  const toSay = prepareTextForAgentSpeech(rawText, outLang);
  if (!toSay.trim()) {
    callbacks.onEnd?.();
    return;
  }

  const run = () => {
    try {
      const u = new SpeechSynthesisUtterance(toSay);
      const voice =
        outLang === "en"
          ? getPreferredMaleEnglishVoice(synth)
          : getPreferredMaleFrenchVoice(synth) ?? getPreferredMaleRoboticFrenchVoice(synth);
      if (voice) {
        u.voice = voice;
        u.lang = bcp47ForBotoPronunciation(outLang, voice);
      } else {
        u.lang = outLang === "en" ? "en-GB" : "fr-FR";
      }
      u.rate = callbacks.rate ?? 0.92;
      u.volume = callbacks.volume ?? 1;
      u.pitch = callbacks.pitch ?? 0.98;
      u.onstart = callbacks.onStart ?? null;
      u.onend = callbacks.onEnd ?? null;
      u.onerror = () => {
        (callbacks.onError ?? callbacks.onEnd)?.();
      };
      synth.speak(u);
    } catch {
      callbacks.onError?.();
      callbacks.onEnd?.();
    }
  };

  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    synth.removeEventListener("voiceschanged", settle);
    run();
  };

  if (synth.getVoices().length > 0) settle();
  else {
    synth.addEventListener("voiceschanged", settle);
    window.setTimeout(settle, 800);
  }
}
