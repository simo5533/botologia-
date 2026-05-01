"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { speakAgentText } from "@/lib/speech-utils";

export interface UseSpeechOptions {
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (err: string) => void;
}

export function useSpeechRecognition(options: UseSpeechOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const win = typeof window !== "undefined" ? window : null;
    const SpeechRecognitionAPI =
      win?.SpeechRecognition ?? win?.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);

    if (!SpeechRecognitionAPI) return;
    const rec = new SpeechRecognitionAPI();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = options.lang ?? "fr-FR";

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let transcript = "";
      let final = false;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i]![0].transcript;
        if (e.results[i]!.isFinal) final = true;
      }
      if (transcript) options.onResult?.(transcript, final);
    };

    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "not-allowed") options.onError?.("Microphone non autorisé");
      else if (e.error !== "aborted") options.onError?.(e.error);
    };

    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {}
      recognitionRef.current = null;
    };
  // options.lang suffit pour la config du recognizer ; options entier évité pour ne pas recréer à chaque render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {}
  }, [isListening]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    setIsListening(false);
  }, []);

  return { isListening, isSupported, start, stop };
}

export function useSpeechSynthesis(options: { lang?: string; rate?: number; volume?: number } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && !!window.speechSynthesis);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      speakAgentText(window.speechSynthesis, text, {
        rate: options.rate ?? 0.92,
        volume: options.volume ?? 1,
        pitch: 0.98,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [options.rate, options.volume]
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  return { speak, stop, pause, resume, isSpeaking, isPaused, isSupported };
}
