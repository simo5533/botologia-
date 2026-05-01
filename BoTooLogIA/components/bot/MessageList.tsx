"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { StoredMessage } from "@/lib/bot/storage";

export interface MessageListProps {
  messages: StoredMessage[];
  isTyping?: boolean;
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef(0);

  /** Ne descend pas automatiquement quand le bot répond : scroll seulement après envoi utilisateur. */
  useEffect(() => {
    const grew = messages.length > prevLenRef.current;
    prevLenRef.current = messages.length;

    if (!grew || messages.length === 0) return;

    const last = messages[messages.length - 1];
    if (last.role !== "user") return;

    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      tabIndex={0}
      className={[
        "relative min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-contain bg-slate-950 px-3 pb-4 pt-3 text-slate-50",
        "[background-image:radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(34,211,238,0.06),transparent_55%)]",
        /* Défilement à la molette : scrollbar discrète à droite, pas besoin de la « prendre » */
        "pr-1 [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:rgba(71,85,105,0.35)_transparent]",
        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600/35 hover:[&::-webkit-scrollbar-thumb]:bg-slate-500/55",
        "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500/25",
      ].join(" ")}
      aria-live="polite"
      aria-label="Historique — utilisez la molette pour faire défiler"
    >
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          role={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
          link={msg.link}
        />
      ))}
      {isTyping && (
        <div className="flex justify-start" role="status" aria-live="polite">
          <div className="rounded-2xl rounded-bl-md border border-slate-600/70 bg-slate-800 px-4 py-3 shadow-md shadow-black/30">
            <span className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-holographic-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-holographic-cyan/90 shadow-[0_0_6px_rgba(34,211,238,0.6)]" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-holographic-cyan/75" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
