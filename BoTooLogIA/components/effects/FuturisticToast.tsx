"use client";

import { useEffect, useState } from "react";

interface FuturisticToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: () => void;
}

export default function FuturisticToast({
  message,
  type = "info",
  duration = 4000,
  onClose,
}: FuturisticToastProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        setVisible(false);
        setTimeout(onClose, 300);
        clearInterval(interval);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [duration, onClose]);

  const colors = {
    success: { accent: "#00e5a0", icon: "✓", label: "SUCCÈS" },
    error: { accent: "#ff4d6d", icon: "✕", label: "ERREUR" },
    info: { accent: "#00c8ff", icon: "ℹ", label: "INFO" },
    warning: { accent: "#fbbf24", icon: "⚠", label: "ALERTE" },
  };
  const c = colors[type];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border backdrop-blur-xl bg-black/70 shadow-2xl min-w-[300px] max-w-sm transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      style={{ borderColor: `${c.accent}40` }}
    >
      <div
        className="absolute left-0 inset-y-0 w-1 rounded-l-xl"
        style={{ background: c.accent }}
      />
      <div className="px-4 py-3 pl-5 flex items-start gap-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
          style={{
            background: `${c.accent}20`,
            color: c.accent,
            border: `1px solid ${c.accent}40`,
          }}
        >
          {c.icon}
        </div>
        <div className="flex-1">
          <div
            className="text-[10px] font-bold tracking-widest mb-0.5"
            style={{ color: c.accent }}
          >
            {c.label}
          </div>
          <div className="text-white/80 text-sm">{message}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/30 hover:text-white/70 transition-colors text-lg leading-none mt-0.5"
        >
          ×
        </button>
      </div>
      <div className="h-px bg-white/5">
        <div
          className="h-full transition-none"
          style={{ width: `${progress}%`, background: `${c.accent}60` }}
        />
      </div>
    </div>
  );
}
