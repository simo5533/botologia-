"use client";

import { Compass } from "lucide-react";
import { QUICK_REPLIES } from "./constants";
import { cn } from "@/lib/utils";

export interface QuickRepliesProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function QuickReplies({ onSelect, disabled, className }: QuickRepliesProps) {
  return (
    <div
      className={cn(
        "min-h-[4.25rem] shrink-0 bg-slate-900/95 px-2 py-2.5",
        className
      )}
      role="group"
      aria-label="Suggestions du guide — faites défiler horizontalement avec la molette"
    >
      <div className="mb-2 flex items-center gap-1.5 px-1">
        <Compass className="h-3.5 w-3.5 shrink-0 text-cyan-400/90" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Guide rapide
        </span>
      </div>
      <div
        className={cn(
          "flex max-w-full gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 pt-0.5",
          "[scrollbar-width:thin] [scrollbar-color:rgba(71,85,105,0.5)_transparent]",
          "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600/40 [&::-webkit-scrollbar-track]:bg-transparent"
        )}
      >
        {QUICK_REPLIES.map((label) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(label)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-lg border border-slate-600/90 bg-slate-800 px-2.5 py-1.5 text-left text-[13px] font-medium leading-snug text-slate-100 shadow-sm",
              "transition-colors duration-150 hover:border-cyan-400/60 hover:bg-slate-700 hover:text-white",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              disabled && "pointer-events-none opacity-45"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
