import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SiteContentFrameProps = {
  children: ReactNode;
  className?: string;
  /** Cadre plus discret (moins de contraste) */
  variant?: "default" | "subtle";
};

/**
 * Conteneur vitrine (bordure verre, fond flouté) — même langage visuel que les panneaux BoToWorks / cartes premium.
 */
export function SiteContentFrame({
  children,
  className,
  variant = "default",
}: SiteContentFrameProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl",
        variant === "default"
          ? "bg-slate-900/50 ring-1 ring-white/10 shadow-black/25"
          : "bg-slate-900/35 ring-1 ring-white/5 shadow-black/15",
        className
      )}
    >
      {children}
    </div>
  );
}
