# Bot guide vocal et écrit — BoTooLogIA

Le widget **BotOlogia** est l'assistant conversationnel du site : il guide les visiteurs, répond aux questions à partir d'une base de connaissances locale et propose la reconnaissance vocale (STT) et la synthèse vocale (TTS).

---

## Fonctionnalités

- **Chat texte** : zone de saisie, envoi par Entrée ou bouton, suggestions rapides, indicateur « le bot écrit… ».
- **Reconnaissance vocale (STT)** : bouton micro, Web Speech API, transcription puis envoi automatique du message.
- **Synthèse vocale (TTS)** : lecture de la dernière réponse du bot (bouton haut-parleur, arrêt).
- **Persistance** : conversation et préférences (voix, volume, langue) dans `localStorage`.
- **Base de connaissances** : réponses instantanées (< 100 ms) sans appel externe, avec liens vers BoToHub, BoToLab, BoToWorks, BoToLink.

---

## Intégration

Le widget est déjà intégré dans le layout global via `ClientProviders` : il s'affiche sur toutes les pages (bouton flottant en bas à droite). Aucune action requise pour l'activer.

- **Composant principal** : `components/ChatbotWidget.tsx` (réexport de `components/bot/BotWidget.tsx`).
- **Sous-composants** : `components/bot/` (ChatWindow, MessageList, InputArea, VoiceBar, QuickReplies).
- **Logique** : `lib/bot/knowledgeBase.ts`, `lib/bot/storage.ts`, `components/bot/useSpeech.ts`.

---

## API

- **POST /api/bot/chat**  
  Body : `{ "message": "string" }`  
  Réponse : `{ "success": true, "data": { "reply": "...", "link": { "href": "...", "label": "..." } } }`  
  La réponse est dérivée de la base de connaissances locale (pas d’appel LLM externe par défaut).

---

## Base de connaissances

Fichier : `lib/bot/knowledgeBase.ts`.

- Entrées : mots-clés + réponse + lien optionnel.
- Recherche : normalisation (casse, accents), score de correspondance.
- Thèmes couverts : présentation BoTooLogIA, services, tarifs/devis, chatbots, automatisation, contact, réalisations, RDV, FAQ courante.

Pour étendre : ajouter des objets dans le tableau `KNOWLEDGE` avec `keywords`, `answer` et optionnellement `link`.

---

## Vocal (navigateur)

- **STT** : Web Speech API (`SpeechRecognition`), langue `fr-FR` par défaut (configurable via préférences).
- **TTS** : Web Speech API (`SpeechSynthesis`), lecture de la dernière réponse, bouton stop.

Compatibilité : selon le navigateur (Chrome, Edge, Safari partiel). Si non supporté, les boutons micro / lecture ne s’affichent pas ou sont désactivés.

---

## Persistance

- **Clé messages** : `botoologia_bot_messages` (derniers 100 messages).
- **Clé préférences** : `botoologia_bot_prefs` (langue vocale, débit, volume, TTS activé/désactivé).

Effacement : `localStorage.removeItem("botoologia_bot_messages")` (et `botoologia_bot_prefs` si besoin).

---

## Accessibilité

- Dialog avec `role="dialog"`, `aria-modal`, `aria-label`.
- Fermeture au clavier (Escape).
- Boutons avec labels explicites (micro, fermer, envoyer, écouter, arrêt).
- Zone de conversation avec `aria-live="polite"` pour les nouveaux messages.

---

## Évolutions possibles

- Intégration Claude/OpenAI pour les questions hors base (variable d’environnement + fallback).
- Rate limiting sur `/api/bot/chat`.
- Analytics : envoi d’événements (conversation démarrée, question envoyée, lien cliqué).
- Paramètres avancés : choix de voix TTS, langue STT (FR/AR/EN).
- Export de la conversation (texte/PDF) et bouton « Effacer l’historique » dans l’UI.
