"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceOption = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type ServiceCardProps = {
  option: ServiceOption;
  selected: boolean;
  onToggle: () => void;
  index?: number;
};

export function ServiceCard({ option, selected, onToggle, index = 0 }: ServiceCardProps) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={`${option.title} - ${selected ? "sélectionné" : "non sélectionné"}`}
      tabIndex={0}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onToggle}
      className={cn(
        "group relative w-full rounded-xl border p-4 text-left transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-holographic-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1526]",
        selected
          ? "border-holographic-cyan bg-holographic-cyan/10 shadow-[0_0_24px_rgba(0,212,255,0.15)]"
          : "border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0" aria-hidden>
          {option.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("font-heading font-semibold", selected ? "text-holographic-cyan" : "text-white")}>
            {option.title}
          </p>
          <p className="mt-0.5 text-sm text-slate-400">{option.description}</p>
        </div>
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            selected ? "border-holographic-cyan bg-holographic-cyan text-slate-900" : "border-white/30 bg-transparent"
          )}
        >
          {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
        </span>
      </div>
    </motion.button>
  );
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  { id: "agents", icon: "🤖", title: "Agents IA", description: "Automatisation intelligente de processus métier" },
  { id: "contenu", icon: "✍️", title: "Génération de contenu IA", description: "Articles, posts, scripts, emails à grande échelle" },
  { id: "visuel", icon: "🎨", title: "Création visuelle IA", description: "Images, vidéos, visuels publicitaires générés par IA" },
  { id: "analyse", icon: "📊", title: "Analyse & Data IA", description: "Insights, rapports, tableaux de bord automatisés" },
  { id: "chatbots", icon: "💬", title: "Chatbots & Assistants", description: "Bots conversationnels sur mesure pour votre marque" },
  { id: "strategie", icon: "🎯", title: "Stratégie IA", description: "Conseil et accompagnement transformation IA" },
  { id: "social", icon: "📱", title: "Social Media IA", description: "Gestion automatisée des réseaux sociaux" },
  { id: "seo", icon: "🔍", title: "SEO & Référencement IA", description: "Optimisation contenu et positionnement" },
];
