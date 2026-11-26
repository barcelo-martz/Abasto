import { RUTAS } from "@/config/routes";
import { buttonVariants, cn, Icon } from "@abasto/ui";
import Link from "next/link";
import { SectionContainer } from "./section-container";

export function CtaBand() {
  return (
    <section aria-labelledby="cta-cuenta" className="w-full bg-surface py-space-2xl">
      <SectionContainer>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-[#142C4C] to-secondary p-space-xl text-white shadow-overlay md:p-space-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-secondary-container/20 blur-3xl"
          />
          <div className="relative z-10 max-w-2xl">
            <div className="mb-space-md inline-flex items-center gap-space-xs rounded-full bg-white/10 px-space-sm py-1 font-label-sm text-label-sm text-secondary-container backdrop-blur-sm">
              <Icon name="notifications_active" size={16} />
              <span>Avisos dentro de Abasto</span>
            </div>
            <h2
              id="cta-cuenta"
              className="font-headline-lg text-headline-lg font-extrabold leading-tight text-white md:font-headline-xl md:text-headline-xl"
            >
              Crea tu cuenta y te avisamos cuando el medicamento llegue
            </h2>
            <p className="mt-space-sm font-body-lg text-body-lg leading-relaxed text-surface-variant">
              Sigue los productos que necesitas, guarda tus listas y recibe una notificación cuando
              vuelvan a estar disponibles.
            </p>
            <div className="mt-space-xl flex flex-wrap items-center gap-space-md">
              <Link
                href={RUTAS.registro}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "bg-white text-primary hover:bg-surface-bright",
                )}
              >
                <Icon name="person_add" size={20} className="text-secondary" />
                <span>Crear cuenta gratuita</span>
              </Link>
              <Link
                href={RUTAS.etiquetas}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "bg-white/10 text-white backdrop-blur-md hover:bg-white/15 hover:text-white",
                )}
              >
                Cómo funcionan las etiquetas
              </Link>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
