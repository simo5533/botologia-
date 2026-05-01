"use client";

import { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import AILoader from "@/components/effects/AILoader";
import { isLikelyEnglishUserForBoto, speakAgentText } from "@/lib/speech-utils";
import { SOCIAL_INBOX_EMAIL, SOCIAL_INBOX_MAILTO } from "@/lib/data/social";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// Type minimal pour la reconnaissance vocale (navigateur); évite conflit avec les types DOM.
type SpeechRecognitionInstance = {
  start: () => void;
  stop: () => void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function getSpeechRecognitionAPI(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function getWelcomeMessage(): string {
  const hour = new Date().getHours();
  let greeting = "Bonjour";
  let context = "";

  if (hour >= 18 && hour < 22) {
    greeting = "Bonsoir";
    context =
      "Même en dehors des heures de bureau, " +
      "je suis là pour vous conseiller. ";
  } else if (hour >= 22 || hour < 5) {
    greeting = "Bonsoir";
    context =
      "Notre équipe vous répondra dès demain matin. ";
  } else if (hour >= 5 && hour < 9) {
    greeting = "Bonjour";
    context = "Vous êtes matinal(e) ! ";
  }

  return (
    `${greeting} ${context}`.replace(/\s+/g, " ").trim() +
    " Je suis BotoAssist, le guide de BoTooLogIA sur cette page. " +
    "Je vous oriente vers BoToHub, BoToLab, BoToWorks, BoToLink : à quoi sert chaque section, et où cliquer pour aller plus loin. " +
    "Pas de grille tarifaire ici : pour un échange avec l’équipe, la page Boto link (/botolink) est la bonne étape. " +
    "Que souhaitez-vous explorer en premier sur le site ? " +
    "You can also write in English — I’ll answer in the same language."
  );
}

export default function AgentIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const prevMsgLenRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  /** Pas d’auto-scroll sur la réponse du bot — seulement après un message utilisateur (comme le widget). */
  useEffect(() => {
    const grew = messages.length > prevMsgLenRef.current;
    prevMsgLenRef.current = messages.length;
    if (!grew || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === "user") {
      requestAnimationFrame(() =>
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      );
    }
  }, [messages]);

  // Créer la reconnaissance au premier clic (Chrome exige un geste utilisateur pour démarrer le micro)
  function ensureRecognition(): SpeechRecognitionInstance | null {
    const API = getSpeechRecognitionAPI();
    if (!API) return null;
    if (recognitionRef.current) return recognitionRef.current;

    const recognition = new API() as SpeechRecognitionInstance;
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript).trim());
      setIsListening(false);
      setMicError(null);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setMicError("Micro inaccessible. Vérifiez les permissions ou utilisez Chrome/Edge.");
    };

    recognitionRef.current = recognition as SpeechRecognitionInstance;
    return recognitionRef.current;
  }

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    speakAgentText(window.speechSynthesis, text, {
      rate: 0.92,
      volume: 1,
      pitch: 0.98,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    setMicError(null);
    const recognition = ensureRecognition();
    if (!recognition) {
      setMicError("Reconnaissance vocale non supportée. Utilisez Chrome ou Edge.");
      return;
    }
    const lastUserText = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    recognition.lang = isLikelyEnglishUserForBoto(lastUserText) || isLikelyEnglishUserForBoto(input)
      ? "en-GB"
      : "fr-FR";
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setMicError("Impossible de démarrer le micro. Autorisez l'accès au micro.");
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/agent-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.slice(-12).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        success?: boolean;
        degraded?: boolean;
        details?: unknown;
      };

      if (!response.ok) {
        const errText =
          typeof data.error === "string"
            ? data.error
            : response.status === 422
              ? "Message invalide. Réessayez avec un texte plus court."
              : "Le service IA est momentanément indisponible.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `${errText} Pour un échange humain, vous pouvez aussi passer par /botolink.`,
            timestamp: new Date(),
          },
        ]);
        return;
      }

      const raw =
        typeof data.message === "string" && data.message.trim().length > 0
          ? data.message.trim()
          : "";

      const assistantMessage: Message = {
        role: "assistant",
        content:
          raw ||
          "Je n'ai pas reçu de réponse du modèle. Vérifiez que OPENAI_API_KEY est bien défini dans l'environnement du serveur (.env), puis redémarrez le serveur de développement.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speak(assistantMessage.content);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Une erreur s'est produite. Veuillez réessayer.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Génération de rendez-vous automatique",
    "Booster mon activité avec l'IA sur mesure",
    "Comment automatiser mon support client ?",
    "Calculer mon ROI avec l'IA",
    "Je veux un devis personnalisé",
    "Réserver un appel gratuit",
  ];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-[#060d1f] to-[#0a1628] shadow-2xl shadow-cyan-500/10">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-cyan-500/20 bg-black/30">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl">
            🤖
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#060d1f]" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">BotoAssist — guide BoTooLogIA</h3>
          <p className="text-xs text-green-400">En ligne • Conseil & mise en route</p>
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <a
            href={SOCIAL_INBOX_MAILTO}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-cyan-400/90 hover:bg-cyan-500/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            title={`Écrire à ${SOCIAL_INBOX_EMAIL}`}
            aria-label={`Contacter BoTooLogIA par e-mail — ${SOCIAL_INBOX_EMAIL}`}
          >
            <Mail className="h-5 w-5 pointer-events-none" strokeWidth={1.75} aria-hidden />
          </a>
          {isSpeaking && (
            <div className="flex gap-0.5 items-end h-5">
              {[1, 2, 3, 4, 3].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan-400 rounded-full animate-pulse"
                  style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => window.speechSynthesis.cancel()}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            ✕ Son
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-cyan-400 to-blue-600"
                  : "bg-gradient-to-br from-purple-500 to-pink-500"
              }`}
            >
              {msg.role === "assistant" ? "🤖" : "👤"}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-white/5 border border-cyan-500/20 text-white/90 rounded-tl-sm"
                  : "bg-cyan-500/20 border border-cyan-500/30 text-white rounded-tr-sm"
              }`}
            >
              {msg.content}
              <div
                className={`text-[10px] mt-1 opacity-40 ${
                  msg.role === "user" ? "text-right" : ""
                }`}
                suppressHydrationWarning
              >
                {mounted
                  ? msg.timestamp.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm flex-shrink-0">
              🤖
            </div>
            <div className="bg-white/5 border border-cyan-500/20 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center min-h-[60px]">
              <AILoader text="Réflexion" compact />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUESTIONS RAPIDES */}
      <div className="px-4 pb-3 flex flex-wrap gap-2">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => sendMessage(q)}
            className="text-xs px-3 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 hover:border-cyan-400/60 hover:scale-105"
          >
            {q}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 items-end bg-white/5 border border-cyan-500/20 rounded-2xl p-2 focus-within:border-cyan-400/50 transition-colors">
          <textarea
            id="agent-ia-message"
            name="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Votre objectif ou votre question — on avance ensemble…"
            rows={1}
            aria-label="Message à l'agent IA"
            className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-white/30 px-2 py-1.5 max-h-32 min-h-[40px]"
          />

          <button
            type="button"
            onClick={toggleListening}
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              isListening
                ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/40"
                : "bg-white/10 hover:bg-white/20"
            }`}
            title={isListening ? "Arrêter" : "Parler"}
          >
            {isListening ? "⏹" : "🎙️"}
          </button>

          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-cyan-500/30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">
          Entrée pour envoyer • 🎙️ pour parler • Maj+Entrée pour nouvelle ligne
        </p>
        {micError && (
          <p className="text-center text-xs text-amber-400 mt-1" role="alert">
            {micError}
          </p>
        )}
      </div>
    </div>
  );
}
