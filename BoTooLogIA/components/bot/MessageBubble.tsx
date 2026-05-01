"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  link?: { href: string; label?: string };
}

export function MessageBubble({ role, content, timestamp, link }: MessageBubbleProps) {
  const isUser = role === "user";
  const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
      role="article"
      aria-label={isUser ? "Votre message" : "Réponse de BotoAssist"}
    >
      <div
        className={cn(
          "max-w-[92%] rounded-2xl px-3.5 py-3 transition-[transform,box-shadow] duration-200 sm:max-w-[88%]",
          isUser
            ? "rounded-br-md bg-cyan-400 text-slate-950 shadow-md shadow-cyan-900/30 ring-1 ring-white/20"
            : "rounded-bl-md border border-slate-500/50 bg-slate-800 text-slate-50 shadow-md shadow-black/40 ring-1 ring-slate-700/80"
        )}
      >
        <p className="whitespace-pre-wrap break-words text-[15px] font-normal leading-relaxed tracking-normal antialiased [text-rendering:optimizeLegibility]">
          {content}
        </p>
        {link && (
          <p className="mt-2">
            <Link
              href={link.href}
              className="text-sm font-semibold text-cyan-300 underline decoration-cyan-500/60 underline-offset-2 hover:text-cyan-200 hover:decoration-cyan-400"
            >
              {link.label ?? "En savoir plus"}
            </Link>
          </p>
        )}
        {timeStr && (
          <p className={cn("mt-2 text-[11px] tabular-nums", isUser ? "text-slate-700" : "text-slate-400")}>
            {timeStr}
          </p>
        )}
      </div>
    </div>
  );
}
