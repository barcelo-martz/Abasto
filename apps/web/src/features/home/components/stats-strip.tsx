import { KpiCard } from "@abasto/ui";
import type { HomeStat } from "../types";
import { SectionContainer } from "./section-container";

export function StatsStrip({ stats }: { stats: HomeStat[] }) {
  return (
    <section
      aria-label="Abasto en cifras"
      className="relative z-20 w-full bg-surface-container-low py-space-xl"
    >
      <SectionContainer>
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <KpiCard key={s.id} label={s.label} value={s.value} unit={s.unit} icon={s.icon} />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
