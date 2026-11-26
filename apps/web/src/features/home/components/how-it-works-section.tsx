import { cn, Icon } from "@abasto/ui";
import type { HomeStep } from "../types";
import { SectionContainer } from "./section-container";
import { SectionHeading } from "./section-heading";

const HOVER: Record<HomeStep["hover"], string> = {
  primary: "group-hover:bg-primary group-hover:text-on-primary",
  secondary: "group-hover:bg-secondary group-hover:text-on-secondary",
  container: "group-hover:bg-primary-container group-hover:text-on-primary",
};

export function HowItWorksSection({ steps }: { steps: HomeStep[] }) {
  return (
    <section aria-labelledby="como-funciona" className="w-full bg-surface py-space-3xl">
      <SectionContainer>
        <SectionHeading
          id="como-funciona"
          align="center"
          large
          eyebrow="Rápido y transparente"
          title="¿Cómo encontrar tu medicamento?"
          description="Pensado para ahorrar viajes inútiles: sabes dónde hay antes de salir de casa."
          className="mb-space-2xl"
        />
        <ol className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg shadow-card-sm transition-all hover:shadow-card"
            >
              <div
                aria-hidden="true"
                className={cn(
                  "mb-space-md flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high font-headline-md text-headline-md text-primary transition-colors",
                  HOVER[s.hover],
                )}
              >
                {i + 1}
              </div>
              <div>
                <h3 className="mb-space-xs font-headline-sm text-headline-sm font-bold text-primary">
                  {s.title}
                </h3>
                <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                  {s.description}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-space-xs pt-space-lg font-label-sm text-label-sm font-semibold text-secondary">
                <Icon name={s.footnoteIcon} size={18} />
                <span>{s.footnote}</span>
              </div>
            </li>
          ))}
        </ol>
      </SectionContainer>
    </section>
  );
}
