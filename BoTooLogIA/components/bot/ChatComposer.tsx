"use client";

import { useRef, useEffect } from "react";
import { Mic, Send, Square, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "./useSpeech";
import { useSpeechSynthesis } from "./useSpeech";

export interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  submitLabel?: string;
  lang?: string;
  onTranscript?: (text: string) => void;
  lastBotReply?: string | null;
  ttsEnabled?: boolean;
  voiceRate?: number;
  voiceVolume?: number;
}

export function ChatComposer({
  value,
  onChange,
  onSend,
  placeholder = "Écrivez votre message…",
  disabled,
  submitLabel = "Envoyer",
  lang = "fr-FR",
  onTranscript,
  lastBotReply,
  ttsEnabled = true,
  voiceRate = 0.92,
  voiceVolume = 1,
}: ChatComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, isSupported: sttSupported, start: startMic, stop: stopMic } = useSpeechRecognition({
    lang,
    onResult(transcript, isFinal) {
      if (isFinal && transcript.trim()) onTranscript?.(transcript.trim());
    },
  });

  const { speak, stop: stopTts, isSpeaking, isPaused, isSupported: ttsSupported } = useSpeechSynthesis({
    lang,
    rate: voiceRate,
    volume: voiceVolume,
  });

  const handleMicClick = () => {
    if (isListening) stopMic();
    else startMic();
  };

  const handlePlayReply = () => {
    if (lastBotReply && ttsEnabled) speak(lastBotReply);
  };

  const handleStopTts = () => stopTts();
  const showTts = ttsEnabled && ttsSupported && lastBotReply;

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
    <div className="shrink-0 border-t border-slate-700/80 bg-slate-950 px-2 pb-3 pt-2">
      <div className="flex min-h-[48px] items-end gap-1.5 sm:gap-2">
        {/* Micro + lecture — même barre que la saisie */}
        <div className="flex shrink-0 items-center gap-1 pb-0.5" role="group" aria-label="Contrôles vocaux">
          {sttSupported && (
            <button
              type="button"
              onClick={handleMicClick}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
                isListening
                  ? "animate-pulse border-red-400 bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                  : "border-slate-600 bg-slate-800 text-slate-100 hover:border-cyan-500/50 hover:bg-slate-700"
              )}
              aria-label={isListening ? "Arrêter l'écoute" : "Parler au micro"}
              title={isListening ? "Arrêter" : "Parler"}
            >
              <Mic className="h-4 w-4" aria-hidden />
            </button>
          )}
          {showTts && (
            <>
              {!isSpeaking && !isPaused ? (
                <button
                  type="button"
                  onClick={handlePlayReply}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/45 bg-slate-800 text-cyan-300 transition-colors hover:border-cyan-400 hover:bg-slate-700 hover:text-cyan-200"
                  aria-label="Écouter la dernière réponse"
                  title="Écouter la réponse"
                >
                  <Volume2 className="h-4 w-4" aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopTts}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  aria-label="Arrêter la lecture"
                  title="Stop"
                >
                  <Square className="h-4 w-4" aria-hidden />
                </button>
              )}
            </>
          )}
        </div>

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
            "min-h-[44px] max-h-[120px] min-w-0 flex-1 resize-none rounded-xl border border-slate-600 bg-slate-900 px-3 py-2.5 text-[15px] leading-relaxed text-slate-50 shadow-inner shadow-black/40 placeholder:text-slate-500",
            "transition-shadow duration-200 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
          aria-label="Message"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-holographic-cyan to-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/25",
            "transition-transform hover:scale-[1.03] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
          aria-label={submitLabel}
        >
          <Send className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
