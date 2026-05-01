"use client";

import Link from "next/link";
import {
  Bot,
  Settings,
  BarChart3,
  ClipboardList,
  Globe,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import { services } from "@/lib/data/services";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Settings,
  BarChart3,
  ClipboardList,
  Globe,
  Headphones,
};

/** Palette harmonisée BoToHub : fond sombre, accent cyan #00d4ff */
const cardBase =
  "relative flex flex-col rounded-2xl border border-[#00d4ff]/20 bg-[#0A0A0A]/95 p-6 text-left transition-all duration-300";
const cardHover =
  "hover:border-[#00d4ff]/40 hover:shadow-[0_0_24px_rgba(0,212,255,0.08)]";

export function BoToHubServicesSection() {
  return (
    <section
      id="services"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]"
      aria-labelledby="services-title"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 md:mb-16 text-center">
          <h2
            id="services-title"
            className="font-heading text-3xl font-bold tracking-tight text-white md:text-4xl"
          >
            Nos Services en Intelligence Artificielle
          </h2>
          <p className="mt-3 max-w-3xl mx-auto text-slate-400 text-base leading-relaxed">
            Découvrez nos solutions adaptées à vos besoins pour automatiser,
            optimiser et propulser votre entreprise grâce à nos robots créés par
            des experts IA.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Bot;
            return (
              <article
                key={item.id}
                className={cn(cardBase, cardHover)}
              >
                <span
                  className="mb-3 text-xs font-mono font-semibold tracking-wider text-[#00d4ff]/70"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#00d4ff]/15 text-[#00d4ff]"
                  aria-hidden
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
                <Link
                  href="/botolink"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00d4ff] transition-colors hover:text-[#00d4ff]/90"
                >
                  Entrer dans le futur
                  <span aria-hidden>→</span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
