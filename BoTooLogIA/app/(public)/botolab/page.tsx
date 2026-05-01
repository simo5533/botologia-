"use client";

import { useState, useCallback } from "react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import HeroBanner from "@/components/ui/HeroBanner";
import { Bot, Settings, BarChart3, ClipboardList, Globe, Headphones } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "@/lib/data/services";
import { getBotolabServiceSections } from "@/lib/data/botolabServiceLongForm";
import ServiceCard from "@/components/ui/ServiceCard";
import { HoloServiceDetailDialog } from "@/components/botolab/HoloServiceDetailDialog";
import { labPageCopy } from "@/lib/seo/copy";

const BANNER_VIDEO_SRC = "/videos/banner-botolab.mp4";

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Settings,
  BarChart3,
  ClipboardList,
  Globe,
  Headphones,
};

/**
 * BoToLab — Même bannière que BoToHub (vidéo plein écran + CTA), puis grille de services
 */
export default function BoToLabPage() {
  const [holoId, setHoloId] = useState<string | null>(null);
  const openHolo = useCallback((id: string) => {
    setHoloId(id);
  }, []);
  const onHoloOpenChange = useCallback((next: boolean) => {
    if (!next) setHoloId(null);
  }, []);

  const holoTitle =
    holoId == null
      ? ""
      : (services.find((s) => s.id === holoId)?.title ?? "");
  const holoSections = holoId == null ? [] : getBotolabServiceSections(holoId);

  return (
    <main>
      <HeroBanner
        videoSrc={BANNER_VIDEO_SRC}
        eyebrow="Laboratoire IA"
        title="BoToLab"
        pillText="Services & prototypes intelligents"
        description={labPageCopy.heroDescription}
        secondaryHref="#services"
        secondaryLabel="Découvrir nos services"
      />
      <SectionWrapper
        id="services"
        className="bg-[#0f172a]"
        eyebrow={labPageCopy.sectionEyebrow}
        title={labPageCopy.sectionTitle}
        titleGradient
        subtitle={labPageCopy.sectionLead}
        headingLevel={2}
        framed
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Bot;
            return (
              <ServiceCard
                key={item.id}
                index={i}
                icon={<Icon className="h-6 w-6" aria-hidden />}
                title={item.title}
                description={item.description}
                href="/botolink"
                linkText="Entrer dans le futur →"
                delay={i * 80}
                onOpenDetail={() => openHolo(item.id)}
              />
            );
          })}
        </div>
      </SectionWrapper>

      <HoloServiceDetailDialog
        open={holoId != null}
        onOpenChange={onHoloOpenChange}
        serviceId={holoId ?? ""}
        title={holoTitle}
        sections={holoSections}
      />
    </main>
  );
}
