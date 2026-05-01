import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { respondApiCatch } from "@/lib/db-error-handler";
import { apiValidationFailed422 } from "@/lib/api/response";
import { agentIaPostSchema } from "@/lib/validators/agent-ia";
import { readMutationJson } from "@/lib/validators/parse-body";
import {
  isPriceOrTariffIntent,
  normalizeLlmMessages,
  PRICE_LOCK_SUFFIX,
  PRICE_LOCK_SUFFIX_EN,
  stripEuroAmountsInReply,
} from "@/lib/agent-ia/botoAgentHelpers";
import { isLikelyEnglishUserForBoto } from "@/lib/speech-utils";

export const dynamic = "force-dynamic";

// ═══════════════════════════════════════════════════════════
// UTILITAIRES TEMPORELS
// ═══════════════════════════════════════════════════════════

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Bonjour";
  if (hour >= 12 && hour < 18) return "Bon après-midi";
  if (hour >= 18 && hour < 22) return "Bonsoir";
  return "Bonsoir";
}

function getTimeContext(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return "tôt_matin";
  if (hour >= 9 && hour < 12) return "matin";
  if (hour >= 12 && hour < 14) return "midi";
  if (hour >= 14 && hour < 18) return "apres_midi";
  if (hour >= 18 && hour < 22) return "soir";
  return "nuit";
}

function getTimeMessage(): string {
  const ctx = getTimeContext();
  const messages: Record<string, string> = {
    tôt_matin:
      "Vous êtes matinal(e) ! Les entrepreneurs qui agissent tôt avancent plus vite.",
    matin:
      "Belle journée pour transformer votre entreprise avec l'IA.",
    midi:
      "Profitez de cette pause pour découvrir comment l'IA peut booster votre activité.",
    apres_midi:
      "Après-midi productif ! C'est le bon moment pour explorer nos solutions.",
    soir:
      "En dehors des heures de bureau, notre IA reste disponible pour vous.",
    nuit:
      "Même la nuit, BoTooLogIA travaille pour vous. Notre équipe vous répondra dès demain.",
  };
  return messages[ctx] || "";
}

// ═══════════════════════════════════════════════════════════
// SYSTEM PROMPT — BOTOASSIST (GUIDE DU SITE)
// ═══════════════════════════════════════════════════════════

function buildSystemPrompt(): string {
  const greeting = getGreeting();
  const timeMsg = getTimeMessage();
  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 9 && currentHour < 18;

  return `Tu es **BotoAssist**, le guide conversationnel du site BoTooLogIA : tu orientes les visiteurs (parcours, pages, « où cliquer »), comme une FAQ intelligente et une carte du site. Tu n'es **pas** un vendeur téléphonique : pas de forcing, pas d'urgence artificielle.

## Mission
- Expliquer ce que recouvrent les grandes zones du site et renvoyer vers les bonnes URLs : **/botohub** (vue d’ensemble), **/botolab** (offres et expertises), **/botoworks** (réalisations), **/botolink** (contact humain, rendez-vous, suite du projet).
- Aider à comprendre en quoi consistent chatbots sur mesure, agents IA et automatisation **sans** brochure tarifaire dans ce fil.

## Ton
- Clair, professionnel, utile. Une phrase d’accueil peut être chaleureuse, mais tu restes sobre et orienté navigation.
- **Voix / lecture** : beaucoup d’utilisateurs écoutent les réponses. Écris de façon **orale** (phrases courtes), ponctuation normale. Pour les pages du site, dis « la page Boto link » plutôt qu’une URL avec slashs.

## LANGUE — FRANÇAIS OU ANGLAIS
- Détecte la langue du dernier message utilisateur. S’il écrit en anglais : réponds entièrement en anglais, ton pro et accessible (guide site).
- S’il écrit en français : réponds en français, vouvoiement.
- En conversation anglaise : « the Boto link page », /botolab, /botoworks — mêmes chemins.
- Salutation contextuelle (réponses en français uniquement) : "${greeting}" — contexte horaire : "${timeMsg}" — heures ouvrées équipe : ${isBusinessHours ? "OUI" : "NON — réponse sous 24h"}

## POLITIQUE PRIX — AUCUN MONTANT DANS CE CHAT
- Interdit : euros, $, forfaits chiffrés, fourchettes, TJM, remises, exemples numériques de prix.
- Si on demande prix / devis / budget : en **deux phrases max**, explique que le chiffrage est individuel et se fait avec un humain après cadrage ; renvoie vers **/botolink**. Aucun chiffre, même fictif.

## RÉPONDRE À TOUT
- Tu réponds toujours. Hors périmètre : une phrase polie, puis lien avec ce que fait BoTooLogIA ou quelle page ouvrir.
- Question purement technique sans lien : réponse courte honnête, puis suggestion **/botolink** ou **/botolab** selon le cas.

## ORIENTATION — RAPPELS
- Visiter les **réalisations** → **/botoworks**. Voir le **détail des offres** → **/botolab**. **Contact ou suite de projet** → **/botolink**.

## FORMAT
- Environ 3 à 6 phrases. Termine souvent par **une question** pour préciser l’orientation **ou** une suggestion de page pertinente.
- Pas de listes à puces sauf si l’utilisateur demande une liste ; sinon phrases fluides.
- Emojis : 0 ou 1 max.

## INTERDITS
- Aucune statistique client inventée (pourcentages, volumes « typiques » bidons).
- Pas de scripts type AIDA / SPIN / objection handling « commercial ».
- Jamais mélanger français et anglais dans la même réponse.
- Jamais plus de 6 phrases sauf demande explicite de détail.
`;
}

// ═══════════════════════════════════════════════════════════
// FALLBACK GUIDE (sans API) — même esprit que BotoAssist
// ═══════════════════════════════════════════════════════════

function getEnglishCommercialFallback(message: string): string {
  const msg = message.toLowerCase().trim();

  if (/^(hi|hello|hey|good\s*morning|good\s*afternoon|good\s*evening)/.test(msg)) {
    return `Hi — I'm BotoAssist, your guide on the BoToLogIA site. I can point you to /botohub, /botolab (what we offer), /botoworks (examples), and /botolink (contact the team). Which area do you want to explore first?`;
  }
  if (/(price|pricing|how\s*much|quote|cost|budget|fee|\$|€|euro)/.test(msg)) {
    return `I don't share amounts here — pricing is scoped with a human after understanding your needs. The next step is the Boto link page (/botolink). Meanwhile, /botolab explains what we do in plain language. What are you trying to improve: customer support, internal workflows, or something else?`;
  }
  if (/(book|meeting|call|calendar|contact|schedule|reach|get in touch)/.test(msg)) {
    return `For contact and booking, open the Boto link page (/botolink). If you want a quick tour first, tell me whether you'd rather see offers (/botolab) or case highlights (/botoworks).`;
  }
  if (/(chatbot|support|customer|assistant|help\s*desk)/.test(msg)) {
    return `Tailored chatbots are covered on /botolab, with examples on /botoworks — trained on your context rather than a generic widget. Would you like pointers to examples first, or the services overview?`;
  }
  if (/(automate|automation|workflow|process|save\s*time|productiv)/.test(msg)) {
    return `Automation and autonomous agents are described on /botolab. Tell me whether you're closer to customer-facing flows or back-office tasks, and I'll suggest which section to open first.`;
  }
  if (/(service|what do you|what can you|offer|solution|what does)/.test(msg)) {
    return `BoToLogIA focuses on bespoke AI: chatbots, agents, content/automation — you'll find the breakdown on /botolab and real-world work on /botoworks. Which one should we open first?`;
  }
  if (/(too expensive|cheaper|discount|negotiate)/.test(msg)) {
    return `Budget isn't discussed with numbers in this chat — /botolink is where the team aligns scope and next steps with you. I can still help you navigate the site: do you want examples (/botoworks) or service detail (/botolab)?`;
  }
  const defaults = [
    `I'm BotoAssist — tell me if you're looking for an overview (/botohub), services (/botolab), portfolio (/botoworks), or contact (/botolink).`,
    `Quick question so I can guide you: do you want to understand what we offer, see examples, or talk to someone on the team?`,
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function getCommercialFallback(message: string): string {
  if (isLikelyEnglishUserForBoto(message)) {
    return getEnglishCommercialFallback(message);
  }
  const msg = message.toLowerCase().trim();
  const greeting = getGreeting();
  const timeMsg = getTimeMessage();

  // Salutations
  if (/^(bonjour|salut|hello|bonsoir|coucou|hey|hi|bsr|bjr|slt)/.test(msg)) {
    return `${greeting} ! ${timeMsg} Je suis BotoAssist, le guide de BoTooLogIA. Je peux vous indiquer où aller sur le site : /botohub pour la vue d’ensemble, /botolab pour les offres, /botoworks pour des exemples, /botolink pour joindre l’équipe. Par quelle page voulez-vous commencer ?`;
  }

  // Parcours / activité (sans prix)
  if (/(booster|décoller|sur\s*mesure|activité|business|croissance)/.test(msg) && !/(prix|tarif|€|euro|combien)/.test(msg)) {
    return `Pour vous orienter sans grille tarifaire ici : ouvrez /botolab pour comprendre les expertises, puis /botoworks pour des réalisations concrètes. Si vous voulez un échange humain, /botolink est la bonne étape. Souhaitez-vous d’abord les offres ou des exemples ?`;
  }

  // Rendez-vous / contact
  if (/(rendez.vous|rdv|agenda|calendar|appointment|réservation|créneau|booking)/.test(msg)) {
    return `Pour prendre rendez-vous ou écrire à l’équipe, tout passe par la page /botolink (formulaire et créneaux). Je peux aussi résumer ce que contient /botolab ou /botoworks avant — que préférez-vous ?`;
  }

  // Chatbot
  if (/(chatbot|chat\s*bot|bot|assistant|support\s*client|service\s*client)/.test(msg)) {
    return `Les chatbots sur mesure sont décrits sur /botolab et illustrés sur /botoworks : assistant formé sur vos contenus, transfert vers un humain quand nécessaire. Voulez-vous d’abord voir des exemples ou le détail des prestations ?`;
  }

  // Automatisation
  if (/(automat|workflow|processus|tâche|répétitif|gain\s*de\s*temps|productivit)/.test(msg)) {
    return `L’automatisation et les agents sont présentés sur /botolab. Indiquez si vous pensez surtout au support client, au back-office ou à la veille : je vous dirai quelle section ouvrir en premier.`;
  }

  // Prix / coût / budget
  if (/(prix|coût|tarif|budget|combien|€|euro|cher|invest)/.test(msg)) {
    if (/(chatbot)/.test(msg)) {
      return `Je ne donne pas de montants dans ce chat : le chiffrage dépend du périmètre et se fait avec un humain sur /botolink. Pour comprendre ce qu’est un chatbot chez BoTooLogIA, commencez par /botolab puis /botoworks. Votre besoin va plutôt au support ou à la qualification de leads ?`;
    }
    return `Pas de prix ni de fourchette ici : tout passe par un cadrage avec l’équipe sur /botolink. En attendant, /botolab résume les types de projets et /botoworks montre le type de livrables. Quel objectif visez-vous en priorité ?`;
  }

  // Objection : trop cher / budget
  if (/(trop\s*cher|pas\s*les\s*moyens|budget\s*limité|coûte\s*trop|remise|rabais|moins\s*cher)/.test(msg)) {
    return `Les montants ne se discutent pas dans ce fil : sur /botolink, l’équipe vous aide à prioriser selon votre contexte. Je peux vous guider sur le site : plutôt exemples (/botoworks) ou détail des offres (/botolab) ?`;
  }

  // Pas le temps
  if (/(pas\s*le\s*temps|trop\s*occupé|pas\s*disponible|débordé)/.test(msg)) {
    return `Pas de souci : vous pouvez avancer par vous-même sur /botolab et /botoworks, puis déposer une demande courte sur /botolink quand vous le souhaitez. Quelle section vous ferait gagner du temps en premier à parcourir ?`;
  }

  // Délai / rapidité
  if (/(délai|temps|semaine|mois|rapide|urgent|quand|vite)/.test(msg)) {
    return `Les délais dépendent du périmètre ; ils se précisent avec l’équipe sur /botolink. Pour vous faire une idée du type de livrables, /botoworks reste le plus parlant. Avez-vous une contrainte de date à mentionner lors du contact ?`;
  }

  // Services
  if (/(service|offre|faites|proposez|spécialité|solution)/.test(msg)) {
    return `Le détail des offres est sur /botolab ; des cas et références sur /botoworks ; la prise de contact sur /botolink. Par où souhaitez-vous commencer ?`;
  }

  // ROI / résultats / efficacité
  if (/(roi|retour\s*sur\s*invest|résultat|efficace|économ|performance)/.test(msg)) {
    return `Je n’affiche pas de pourcentages ou promesses chiffrées ici : voyez /botoworks pour du concret, puis /botolink pour un échange sur vos objectifs. Quel résultat observeriez-vous volontiers en premier dans votre organisation ?`;
  }

  // Contact / RDV / appel
  if (/(contact|appel|rdv|rendez|réserver|parler|humain|conseiller|expert|téléphone)/.test(msg)) {
    return `Pour parler à quelqu’un ou réserver un créneau, utilisez /botolink. Si vous voulez vous préparer avant, parcourez /botolab puis /botoworks. Souhaitez-vous un résumé de l’une de ces pages ?`;
  }

  // Secteur spécifique
  if (/(immobilier|retail|e.commerce|santé|juridique|rh|finance|restaur|hôtel|logistique)/.test(msg)) {
    return `Merci pour la précision : les réalisations sectorielles sont illustrées sur /botoworks, et le périmètre des offres sur /botolab. Ensuite /botolink permet d’aligner votre cas avec l’équipe. Voulez-vous partir des exemples ou du catalogue d’expertises ?`;
  }

  // Merci / satisfaction
  if (/(merci|super|parfait|génial|excellent|top|impeccable|nickel)/.test(msg)) {
    return `Avec plaisir ! Si vous explorez encore le site, /botohub donne le fil conducteur ; pour aller plus loin avec un humain, /botolink. Bonne visite !`;
  }

  // Concurrence
  if (/(concurrent|compétiteur|autre\s*agence|comparaison|mieux\s*que|différence)/.test(msg)) {
    return `Je ne compare pas les concurrents nommément ici : BoTooLogIA met l’accent sur du sur-métier, visible sur /botoworks et /botolab. Pour un échange adapté à votre situation, /botolink. Souhaitez-vous voir des exemples avant ?`;
  }

  const defaults = [
    `${greeting} — je suis BotoAssist : dites-moi si vous cherchez une vue d’ensemble (/botohub), les offres (/botolab), des réalisations (/botoworks), ou le contact (/botolink).`,
    `Pour vous guider : préférez-vous comprendre ce que propose BoTooLogIA (/botolab) ou voir des cas (/botoworks) ?`,
    `Une priorité pour votre visite : exemples concrets, détail des prestations, ou écrire à l’équipe (/botolink) ?`,
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

// ═══════════════════════════════════════════════════════════
// ROUTE API PRINCIPALE
// ═══════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const raw = await readMutationJson(req);
    const parsedBody = agentIaPostSchema.safeParse(raw);
    if (!parsedBody.success) {
      return apiValidationFailed422(parsedBody.error.flatten());
    }
    const { messages } = parsedBody.data;

    const lastMessage = messages[messages.length - 1]?.content || "";
    const priceIntent = isPriceOrTariffIntent(lastMessage);
    let systemPrompt = buildSystemPrompt();
    if (priceIntent) {
      systemPrompt += isLikelyEnglishUserForBoto(lastMessage) ? PRICE_LOCK_SUFFIX_EN : PRICE_LOCK_SUFFIX;
    }
    const llmMessages = normalizeLlmMessages(
      messages.slice(-12).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      }))
    );

    const openaiModel =
      process.env.OPENAI_AGENT_MODEL?.trim() || "gpt-4o";

    const finalizeAssistantText = (text: string) =>
      stripEuroAmountsInReply(text.trim(), priceIntent);

    // ── OpenAI (priorité : qualité pour BotoAssist) ──
    if (process.env.OPENAI_API_KEY) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: openaiModel,
            messages: [
              { role: "system", content: systemPrompt },
              ...llmMessages,
            ],
            max_tokens: 420,
            temperature: 0.68,
            presence_penalty: 0.3,
            frequency_penalty: 0.22,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              message: finalizeAssistantText(reply),
              source: "openai",
              model: openaiModel,
            });
          }
        } else {
          const errBody = await res.text();
          logger.error("OpenAI HTTP error", new Error(errBody.slice(0, 500)), {
            route: "POST /api/agent-ia",
            status: res.status,
          });
        }
      } catch (e: unknown) {
        logger.error("OpenAI provider", e, { route: "POST /api/agent-ia" });
      }
    }

    // ── Groq (secours — même schéma OpenAI) ──────────
    if (process.env.GROQ_API_KEY) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              ...llmMessages,
            ],
            max_tokens: 420,
            temperature: 0.72,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              message: finalizeAssistantText(reply),
              source: "groq",
            });
          }
        } else {
          const errBody = await res.text();
          logger.error("Groq HTTP error", new Error(errBody.slice(0, 500)), {
            route: "POST /api/agent-ia",
            status: res.status,
          });
        }
      } catch (e: unknown) {
        logger.error("Groq provider", e, { route: "POST /api/agent-ia" });
      }
    }

    // ── Mistral ───────────────────────────────────────
    if (process.env.MISTRAL_API_KEY) {
      try {
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistral-small-latest",
            messages: [
              { role: "system", content: systemPrompt },
              ...llmMessages,
            ],
            max_tokens: 420,
            temperature: 0.72,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              message: finalizeAssistantText(reply),
              source: "mistral",
            });
          }
        } else {
          const errBody = await res.text();
          logger.error("Mistral HTTP error", new Error(errBody.slice(0, 500)), {
            route: "POST /api/agent-ia",
            status: res.status,
          });
        }
      } catch (e: unknown) {
        logger.error("Mistral provider", e, { route: "POST /api/agent-ia" });
      }
    }

    // ── Fallback commercial intelligent ───────────────
    const fallback = getCommercialFallback(lastMessage);
    return NextResponse.json({
      message: stripEuroAmountsInReply(fallback, priceIntent),
      source: "commercial-fallback",
      degraded: true,
    });
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/agent-ia");
  }
}
