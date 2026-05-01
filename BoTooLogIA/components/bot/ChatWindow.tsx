"use client";

import { useCallback, useState, useEffect } from "react";
import { MessageList } from "./MessageList";
import { ChatComposer } from "./ChatComposer";
import { QuickReplies } from "./QuickReplies";
import { BOT_WELCOME } from "./constants";
import type { StoredMessage } from "@/lib/bot/storage";
import { loadMessages, saveMessages, loadPrefs, type BotPrefs } from "@/lib/bot/storage";

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastBotReply, setLastBotReply] = useState<string | null>(null);
  const [prefs] = useState<BotPrefs>(() => loadPrefs());

  useEffect(() => {
    const loaded = loadMessages();
    if (loaded.length > 0) {
      setMessages(loaded);
      const lastAssistant = [...loaded].reverse().find((m) => m.role === "assistant");
      if (lastAssistant) setLastBotReply(lastAssistant.content);
    } else {
      setMessages([
        {
          id: generateId(),
          role: "assistant",
          content: BOT_WELCOME,
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: StoredMessage = {
        id: generateId(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch("/api/bot/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            sessionId: `s_${Date.now()}`,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let data: { message?: string; reply?: string; data?: { reply?: string; link?: { href: string; label?: string } }; error?: string } = {};
        try {
          data = await res.json();
        } catch {
          data = {
            message:
              "Réponse invalide du serveur. Essayez à nouveau, ou ouvrez la page /botolink pour joindre l’équipe.",
          };
        }

        const reply =
          data.message ??
          data.reply ??
          data.data?.reply ??
          "Je suis BotoAssist : demandez-moi où aller sur le site ou ce que recouvre une page.";
        const link = data.data?.link;

        const assistantMsg: StoredMessage = {
          id: generateId(),
          role: "assistant",
          content: reply,
          timestamp: Date.now(),
          link,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLastBotReply(reply);
      } catch (e: unknown) {
        const isTimeout = e instanceof Error && e.name === "AbortError";
        const content = isTimeout
          ? "Le serveur met trop de temps à répondre. Réessayez, ou passez par /botolink pour contacter l’équipe."
          : "Connexion indisponible. Réessayez plus tard ou utilisez /botolink pour écrire à l’équipe.";
        const errMsg: StoredMessage = {
          id: generateId(),
          role: "assistant",
          content,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
        setLastBotReply(null);
      } finally {
        setIsTyping(false);
      }
    },
    []
  );

  const handleTranscript = useCallback(
    (text: string) => {
      if (text) sendMessage(text);
    },
    [sendMessage]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MessageList messages={messages} isTyping={isTyping} />
      <footer className="flex shrink-0 flex-col border-t border-slate-800/90 bg-slate-950 shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.35)]">
        <QuickReplies onSelect={sendMessage} disabled={isTyping} />
        <ChatComposer
          value={input}
          onChange={setInput}
          onSend={() => sendMessage(input)}
          disabled={isTyping}
          lang={prefs.voiceLang}
          onTranscript={handleTranscript}
          lastBotReply={lastBotReply}
          ttsEnabled={prefs.ttsEnabled}
          voiceRate={prefs.voiceRate}
          voiceVolume={prefs.voiceVolume}
        />
      </footer>
    </div>
  );
}
