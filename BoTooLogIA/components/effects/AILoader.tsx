"use client";

interface AILoaderProps {
  text?: string;
  compact?: boolean;
}

export default function AILoader({ text = "Traitement IA...", compact = false }: AILoaderProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5 items-center">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
        <span className="text-xs text-white/30 ml-2 font-mono">{text}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" />
        <div
          className="absolute inset-1 rounded-full border border-cyan-400/40 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute inset-3 rounded-full border border-purple-400/40 animate-spin"
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-1 text-cyan-400/70 text-sm font-mono">
        <span>{text}</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="animate-bounce inline-block"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            .
          </span>
        ))}
      </div>
      <div className="w-40 h-px bg-white/10 rounded overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded animate-loading-bar" />
      </div>
    </div>
  );
}
