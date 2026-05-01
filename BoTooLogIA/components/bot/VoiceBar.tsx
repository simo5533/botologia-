"use client";

import { Mic, Square, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "./useSpeech";
import { useSpeechSynthesis } from "./useSpeech";

export interface VoiceBarProps {
  /** Langue STT */
  lang?: string;
  /** Callback quand une transcription finale est prête */
  onTranscript?: (text: string) => void;
  /** Dernière réponse du bot (pour TTS) */
  lastBotReply?: string | null;
  /** Préférence TTS activée */
  ttsEnabled?: boolean;
  /** Préférences TTS */
  voiceRate?: number;
  voiceVolume?: number;
}

export function VoiceBar({
  lang = "fr-FR",
  onTranscript,
  lastBotReply,
  ttsEnabled = true,
  voiceRate = 0.92,
  voiceVolume = 1,
}: VoiceBarProps) {
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

  return (
    <div
      className="flex items-center gap-2 border-t border-slate-700/80 bg-slate-950 px-3 py-2"
      role="group"
      aria-label="Contrôles vocaux"
    >
      {sttSupported && (
        <button
          type="button"
          onClick={handleMicClick}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
            isListening
              ? "animate-pulse border-red-400 bg-red-600 text-white shadow-[0_0_14px_rgba(239,68,68,0.45)]"
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
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-slate-800 text-cyan-300 transition-all hover:border-cyan-400 hover:bg-slate-700 hover:text-cyan-200"
              aria-label="Écouter la dernière réponse"
              title="Écouter la réponse"
            >
              <Volume2 className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopTts}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
              aria-label="Arrêter la lecture"
              title="Stop"
            >
              <Square className="h-4 w-4" aria-hidden />
            </button>
          )}
        </>
      )}
    </div>
  );
}
