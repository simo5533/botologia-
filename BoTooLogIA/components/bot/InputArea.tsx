"use client";

import { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  /** Raccourci pour soumettre (ex: Ctrl+Enter) */
  submitLabel?: string;
}

export function InputArea({
  value,
  onChange,
  onSend,
  placeholder = "Écrivez votre message…",
  disabled,
  submitLabel = "Envoyer",
}: InputAreaProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const t = value.trim();
    if (!t || disabled) return;
    onSend();
    onChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  return (
    <div className="flex items-end gap-2 border-t border-slate-700/80 bg-slate-950 p-3">
      <textarea
        id="bot-chat-message"
        name="message"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          "min-h-[44px] max-h-[120px] flex-1 resize-none rounded-xl border border-slate-600 bg-slate-900 px-3 py-2.5 text-[15px] leading-relaxed text-slate-50 shadow-inner shadow-black/40 placeholder:text-slate-500",
          "transition-shadow duration-200 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        aria-label="Message"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-holographic-cyan to-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30",
          "transition-transform hover:scale-[1.03] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-holographic-cyan focus:ring-offset-2 focus:ring-offset-slate-950",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
        aria-label={submitLabel}
      >
        <Send className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
