"use client";

import { TabletServiceCard } from "@/components/cards/TabletServiceCard";
import type { services as servicesType } from "@/lib/data/services";

type ServiceItem = (typeof servicesType)[number];

export function ServiceTabletsSection({ services }: { services: readonly ServiceItem[] }) {
  const mid = Math.ceil(services.length / 2);
  const row1 = services.slice(0, mid);
  const row2 = services.slice(mid);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: "thin" }}>
        {row1.map((s) => (
          <TabletServiceCard
            key={s.id}
            title={s.title}
            description={s.description}
            icon={s.icon}
          />
        ))}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: "thin" }}>
        {row2.map((s) => (
          <TabletServiceCard
            key={s.id}
            title={s.title}
            description={s.description}
            icon={s.icon}
          />
        ))}
      </div>
    </div>
  );
}
