import { RUTAS } from "@/config/routes";
import { cn, Icon } from "@abasto/ui";
import Link from "next/link";
import type { TrustCriterion } from "../types";
import { SectionContainer } from "./section-container";
import { SectionHeading } from "./section-heading";

const ESTILO: Record<
  TrustCriterion["id"],
  { panel: string; dot: string; title: string; foot: string }
> = {
  verified: {
    panel: "bg-avail-container/60",
    dot: "bg-avail-dot",
    title: "text-on-secondary-fixed-variant",
    foot: "text-secondary",
  },
  estimated: {
    panel: "bg-low-container/70",
    dot: "bg-low-dot",
    title: "text-on-tertiary-fixed-variant",
    foot: "text-on-low-container",
  },
  stale: {
    panel: "bg-surface-container",
    dot: "bg-outline",
    title: "text-on-surface",
    foot: "text-on-surface-variant",
  },
};

export function AvailabilityExplainerSection({ criteria }: { criteria: TrustCriterion[] }) {
  return (
    <section
      aria-labelledby="confianza"
      className="w-full bg-surface-container-high/40 py-space-2xl"
    >
      <SectionContainer>
        <div className="rounded-3xl bg-surface-container-lowest p-space-xl shadow-card-sm">
          <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="confianza"
                eyebrow="Transparencia"
                title="¿Cuánto puedes confiar en cada dato?"
                description="El stock lo declara cada farmacia y envejece entre abastecimientos. Por eso cada resultado trae una etiqueta que explica qué tan fresco es."
              />
              <div className="mt-space-lg flex items-center gap-space-md rounded-xl bg-surface-container-low p-space-sm">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary"
                >
                  <Icon name="health_and_safety" size={22} />
                </div>
                <div>
                  <div className="font-label-md text-label-md font-bold text-primary">
                    Privacidad por diseño
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant">
                    No se guardan datos del paciente en la dispensación.
                  </div>
                </div>
              </div>
              <Link
                href={RUTAS.etiquetas}
                className="mt-space-md inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-secondary hover:text-primary"
              >
                <span>Ver todas las etiquetas</span>
                <Icon name="chevron_right" size={16} />
              </Link>
            </div>

            <ul className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:col-span-7">
              {criteria.map((c, i) => {
                const e = ESTILO[c.id];
                return (
                  <li
                    key={c.id}
                    className={cn("rounded-2xl p-space-lg", e.panel, i === 2 && "sm:col-span-2")}
                  >
                    <div className="mb-space-sm flex items-center gap-space-xs">
                      <span aria-hidden="true" className={cn("h-3 w-3 rounded-full", e.dot)} />
                      <h3 className={cn("font-headline-sm text-headline-sm font-bold", e.title)}>
                        {c.title}
                      </h3>
                    </div>
                    <p className="font-body-sm text-body-sm leading-relaxed text-on-surface">
                      {c.description}
                    </p>
                    <div
                      className={cn(
                        "mt-space-md inline-flex items-center gap-1 font-label-sm text-label-sm font-semibold",
                        e.foot,
                      )}
                    >
                      <Icon name={c.footnoteIcon} size={16} />
                      <span>{c.footnote}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
