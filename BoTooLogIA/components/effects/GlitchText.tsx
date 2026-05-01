"use client";

import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export default function GlitchText({
  text,
  className = "",
  intensity = "low",
}: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const intervals = { low: 6000, medium: 3000, high: 1500 };
    const durations = { low: 150, medium: 300, high: 500 };

    const trigger = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), durations[intensity]);
    };

    const interval = setInterval(trigger, intervals[intensity]);
    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <span
      className={`relative inline-block ${className}`}
      data-text={text}
      style={
        glitching
          ? { animation: "glitch 0.15s steps(2) infinite" }
          : undefined
      }
    >
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-cyan-400 opacity-80"
            style={{
              clipPath: "inset(30% 0 40% 0)",
              transform: "translate(-3px)",
            }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-purple-400 opacity-80"
            style={{
              clipPath: "inset(60% 0 10% 0)",
              transform: "translate(3px)",
            }}
          >
            {text}
          </span>
        </>
      )}
      {text}
    </span>
  );
}
