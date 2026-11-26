"use client";

import { HeroSearchForm, TERRITORIOS_DEMO } from "@/features/home";
import { Isotype } from "@abasto/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full max-h-screen bg-linear-to-b from-surface via-surface-container-low/50 to-surface flex-1 flex flex-col justify-center items-center lg:px-12">
      <div className="flex flex-col w-full">
        {/* <!-- Decorative Ambient Backdrops --> */}
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-155 h-90 bg-linear-to-tr from-secondary-fixed/30 via-primary-fixed/20 to-surface-container-high/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute top-44 -right-12 w-72 h-72 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none -z-10"></div>
          {/* <!-- Central Hero & Isometric Graphic Block --> */}
          <div className="w-full flex flex-col items-center text-center max-w-3xl px-4">
            {/* <!-- Vector Isometric 3D Storage Box & Floating Medical Elements --> */}
            <div className="relative w-72 h-64 sm:w-80 sm:h-72 flex items-center justify-center mb-space-sm select-none">
              <Isotype size={200} />
            </div>
            {/* <!-- Error Pill Badge --> */}
            <div className="inline-flex items-center gap-space-xs px-3.5 py-1 rounded-full bg-error-container/60 text-error font-label-sm text-label-sm shadow-[0_1px_4px_rgba(147,0,10,0.08)] mb-space-sm">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              <span className="font-bold tracking-wide">ERROR 404 • ENLACE NO DISPONIBLE</span>
            </div>
            {/* <!-- Main Heading & Explanatory Text --> */}
            <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight mb-space-xs">
              No encontramos esta página
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              La dirección ingresada ha cambiado, la receta o fármaco consultado fue reubicado en el
              registro provincial, o la página nunca existió en la red de salud pública.
            </p>
            {/* <!-- Primary Action Buttons --> */}
            <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-lg mb-space-xl">
              <Link
                className="inline-flex items-center gap-space-xs px-6 py-3.5 rounded-xl bg-linear-to-r from-primary to-primary-container text-on-primary font-label-md text-label-md shadow-[0_4px_16px_rgba(0,36,68,0.18)] hover:shadow-[0_8px_24px_rgba(0,36,68,0.25)] hover:-translate-y-0.5 transition-all"
                href="/"
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span>Ir al inicio</span>
              </Link>
              <Link
                className="inline-flex items-center gap-space-xs px-6 py-3.5 rounded-xl bg-surface-container-high text-primary hover:bg-surface-variant font-label-md text-label-md shadow-[0_2px_8px_rgba(14,35,64,0.06)] hover:-translate-y-0.5 transition-all"
                href="/buscar"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  medication
                </span>
                <span>Buscar medicamento</span>
              </Link>
            </div>
            {/* <!-- Integrated Accessible Search Bar Card --> */}
            <HeroSearchForm territorios={TERRITORIOS_DEMO} />
          </div>
          {/* <!-- Institutional Technical Support Note / Incident Footer --> */}
        </div>
      </div>
    </div>
  );
}
