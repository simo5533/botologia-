"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { num: 1, label: "Votre profil" },
  { num: 2, label: "Service IA" },
  { num: 3, label: "Délais" },
  { num: 4, label: "Votre projet" },
  { num: 5, label: "RDV & envoi" },
] as const;

type StepIndicatorProps = {
  currentStep: number;
  className?: string;
};

export function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={5}
      aria-label={`Étape ${currentStep} sur 5`}
    >
      <div className="flex items-center">
        {STEPS.map(({ num, label }, i) => {
          const isCompleted = currentStep > num;
          const isCurrent = currentStep === num;
          return (
            <div key={num} className="flex flex-1 items-center">
              {i > 0 && (
                <div className="h-0.5 flex-1 min-w-[8px] overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-holographic-cyan"
                    initial={false}
                    animate={{ width: currentStep > num ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
              <div className="flex flex-col items-center px-1">
                <motion.div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                    isCompleted && "border-holographic-cyan bg-holographic-cyan text-slate-900",
                    isCurrent && "border-holographic-cyan bg-transparent text-holographic-cyan",
                    !isCompleted && !isCurrent && "border-white/20 bg-white/5 text-slate-500"
                  )}
                  animate={{
                    scale: isCurrent ? 1.05 : 1,
                    boxShadow: isCurrent ? "0 0 20px rgba(0, 212, 255, 0.3)" : "none",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? <Check className="h-5 w-5" aria-hidden /> : num}
                </motion.div>
                <span
                  className={cn(
                    "mt-1.5 hidden text-xs font-medium sm:block",
                    isCurrent ? "text-holographic-cyan" : isCompleted ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-holographic-cyan"
          initial={false}
          animate={{ width: `${(currentStep / 5) * 100}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
