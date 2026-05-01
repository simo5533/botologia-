"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BUDGET_RANGES = [
  { id: "<2000", label: "< 2 000€", min: 0, max: 2000 },
  { id: "2000-5000", label: "2 000 – 5 000€", min: 2000, max: 5000 },
  { id: "5000-15000", label: "5 000 – 15 000€", min: 5000, max: 15000 },
  { id: "15000-50000", label: "15 000 – 50 000€", min: 15000, max: 50000 },
  { id: ">50000", label: "> 50 000€", min: 50000, max: 1000000 },
] as const;

type BudgetSliderProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function BudgetSlider({ value, onChange, className }: BudgetSliderProps) {
  const index = BUDGET_RANGES.findIndex((r) => r.id === value);
  const currentIndex = index >= 0 ? index : 0;
  const current = BUDGET_RANGES[currentIndex];

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">Budget estimé</span>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-heading font-bold text-holographic-cyan"
        >
          {current?.label ?? value}
        </motion.span>
      </div>
      <div className="relative flex gap-1">
        {BUDGET_RANGES.map((range, i) => {
          const isSelected = value === range.id;
          const isPast = i < currentIndex;
          return (
            <button
              key={range.id}
              type="button"
              aria-pressed={isSelected}
              aria-label={range.label}
              onClick={() => onChange(range.id)}
              className={cn(
                "h-3 flex-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-holographic-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1526]",
                isSelected && "bg-holographic-cyan shadow-[0_0_12px_rgba(0,212,255,0.5)]",
                isPast && !isSelected && "bg-holographic-cyan/60",
                !isSelected && !isPast && "bg-white/15 hover:bg-white/25"
              )}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>Budget minimal</span>
        <span>Budget élevé</span>
      </div>
    </div>
  );
}
