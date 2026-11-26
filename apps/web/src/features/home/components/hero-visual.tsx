import { Icon, Isotype } from "@abasto/ui";

/**
 * Ilustración isométrica con tres tarjetas flotantes.
 * Es decorativa (los datos son de ejemplo), por eso se oculta a lectores de pantalla.
 */
export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mt-space-xl flex items-center justify-center lg:col-span-5 lg:mt-0"
    >
      <div className="relative flex h-[340px] w-full max-w-[480px] items-center justify-center md:h-[480px]">
        <div className="absolute inset-4 rotate-6 rounded-3xl bg-gradient-to-tr from-[#006a64]/30 via-[#1b3a5c]/50 to-transparent blur-2xl" />

        <Isotype size={810} />

        <div className="absolute -left-4 -top-4 flex max-w-[230px] animate-bounce items-center gap-space-sm rounded-xl bg-white/90 p-space-sm shadow-[0_12px_32px_rgba(14,35,64,0.22)] backdrop-blur-md [animation-duration:4s] sm:left-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
            <span className="h-3 w-3 animate-pulse rounded-full bg-secondary" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-label-sm text-[12px] font-bold text-secondary">
              Disponible · 12 farmacias
            </div>
            <div className="truncate font-body-sm text-[12px] font-semibold text-on-surface">
              Ejemplo: 420 unidades
            </div>
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 flex max-w-[210px] items-center gap-space-sm rounded-xl bg-white/90 p-space-sm shadow-[0_12px_32px_rgba(14,35,64,0.22)] backdrop-blur-md sm:right-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-sm">
            <Icon name="verified" size={18} />
          </div>
          <div className="min-w-0">
            <div className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary">
              Dato verificado
            </div>
            <div className="font-body-sm text-[12px] text-on-surface-variant">
              Actualizado hace 4 min
            </div>
          </div>
        </div>

        <div className="absolute -bottom-6 left-1/4 flex items-center gap-space-sm rounded-xl bg-primary p-space-sm text-white shadow-[0_16px_40px_rgba(0,18,36,0.4)] backdrop-blur-md">
          <Icon name="directions_walk" size={20} className="text-secondary-container" />
          <div>
            <span className="block font-label-sm text-[11px] text-primary-fixed-dim">
              Recorrido sugerido
            </span>
            <span className="font-label-md text-label-md font-bold text-white">
              A 15 min en transporte
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
