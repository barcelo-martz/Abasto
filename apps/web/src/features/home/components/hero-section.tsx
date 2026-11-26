"use client";
import { RUTAS } from "@/config/routes";
import { buttonVariants, cn, Icon } from "@abasto/ui";
import Link from "next/link";
import type { TerritorioOpcion } from "../types";
import { HeroSearchForm } from "./hero-search-form";
import { HeroVisual } from "./hero-visual";
import { SectionContainer } from "./section-container";

export interface HeroSectionProps {
  territorios: TerritorioOpcion[];
  busquedasFrecuentes: readonly string[];
}

const glass =
  "bg-white/10 text-white backdrop-blur-md shadow-card-sm transition-all hover:bg-white/15";

export function HeroSection({ territorios, busquedasFrecuentes }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative w-full overflow-hidden bg-linear-to-b from-[#0E2340] via-[#142C4C] to-[#183354] pb-20 pt-space-3xl md:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-150 w-150 rounded-full bg-[#1e3a8a]/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 h-137.5 w-137.5 rounded-full bg-[#006a64]/25 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 h-112.5 w-112.5 rounded-full bg-primary-container/35 blur-[120px]"
      />

      <SectionContainer className="relative z-10">
        {/* <LivePulse
          label="Consulta pública de disponibilidad"
          tone="online"
          className="mb-space-lg bg-white/10 text-secondary-container backdrop-blur-md shadow-card-sm rounded-2xl px-space-sm py-1 font-label-sm text-[11px] font-semibold uppercase tracking-wide"
        /> */}

        <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
          <div className="flex flex-col space-y-space-lg lg:col-span-7">
            <h1
              id="hero-titulo"
              className="font-display-hero-mobile text-display-hero-mobile text-white md:font-display-hero md:text-display-hero"
            >
              Encuentra tu medicamento,{" "}
              <span className="text-secondary-container drop-shadow-[0_4px_24px_rgba(156,238,230,0.3)]">
                sin recorrer la ciudad
              </span>
              .
            </h1>
            <p className="max-w-2xl font-body-lg text-body-lg text-surface-variant/90">
              Consulta qué farmacias tienen un medicamento o insumo, qué tan reciente es el dato y
              cuál es la más cercana. Sin necesidad de registrarte.
            </p>

            <HeroSearchForm territorios={territorios} />

            <div className="flex flex-wrap items-center gap-space-xs pt-space-2xs">
              <span className="flex items-center gap-1 font-label-sm text-label-sm font-medium text-primary-fixed-dim">
                <Icon name="trending_up" size={16} /> Búsquedas frecuentes:
              </span>
              {busquedasFrecuentes.map((b) => (
                <Link
                  key={b}
                  href={`${RUTAS.buscar}?q=${encodeURIComponent(b)}`}
                  className="rounded-full bg-white/10 px-space-sm py-1 font-label-sm text-label-sm text-surface-variant backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  {b}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-space-sm pt-space-xs">
              <Link
                href={RUTAS.receta}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  glass,
                  "text-white hover:text-white",
                )}
              >
                <Icon name="photo_camera" size={20} className="text-secondary-fixed" />
                <span>Subir foto de receta</span>
              </Link>
              <Link
                href={RUTAS.recorrido}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  glass,
                  "bg-white/5 text-white hover:text-white",
                )}
              >
                <Icon name="alt_route" size={20} className="text-secondary-container" />
                <span>Planificar recorrido</span>
              </Link>
            </div>
          </div>

          <HeroVisual />
        </div>
      </SectionContainer>
    </section>
  );
}
