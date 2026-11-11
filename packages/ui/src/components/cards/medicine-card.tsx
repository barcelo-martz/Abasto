import { cva } from "class-variance-authority";
import type { HTMLAttributes, Ref } from "react";
/* eslint-disable @next/next/no-img-element */
import { cn } from "../../lib/cn";
import { AvailabilityPill } from "../badge/availability-pill";
import { TrustBadge, type TrustLevel } from "../badge/trust-badge";
import { Icon } from "../icon";

export interface PharmacyAvatar {
  name: string;
  /** URL opcional; si no hay, se muestran las iniciales. */
  src?: string;
}

const card = cva(
  "relative flex flex-col gap-space-sm overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-card transition-shadow hover:shadow-raised",
  {
    variants: {
      variant: {
        available: "",
        low: "",
        out: "bg-surface-container-lowest",
      },
    },
    defaultVariants: { variant: "available" },
  },
);

const rail = { available: "bg-secondary", low: "bg-low-dot", out: "bg-out-dot" } as const;
const iconTone = {
  available: "bg-secondary-container/40 text-secondary",
  low: "bg-low-container text-on-low-container",
  out: "bg-out-container text-on-out-container",
} as const;
const CTA = {
  available: "Ver farmacias",
  low: "Ver alternativas",
  out: "Avisarme cuando llegue",
} as const;

const initials = (n: string) =>
  n
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export interface MedicineCardProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  variant: "available" | "low" | "out";
  name: string;
  presentation: string;
  trust?: TrustLevel;
  pharmacies?: PharmacyAvatar[];
  /** Total de farmacias con existencia (si es mayor que las avatares mostradas). */
  pharmacyCount?: number;
  maxAvatars?: number;
  ctaLabel?: string;
  onCtaClick?: () => void;
  ref?: Ref<HTMLElement>;
}

export function MedicineCard({
  variant,
  name,
  presentation,
  trust,
  pharmacies = [],
  pharmacyCount,
  maxAvatars = 4,
  ctaLabel,
  onCtaClick,
  className,
  ref,
  ...props
}: MedicineCardProps) {
  const total = pharmacyCount ?? pharmacies.length;
  const shown = pharmacies.slice(0, maxAvatars);
  const extra = total - shown.length;
  return (
    <article ref={ref} className={cn(card({ variant }), className)} {...props}>
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1.5", rail[variant])} />
      <div className="flex items-start justify-between gap-space-xs pl-1">
        <div className="flex min-w-0 items-center gap-space-xs">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              iconTone[variant],
            )}
          >
            <Icon name="medication" size={24} />
          </span>
          <div className="flex min-w-0 flex-col">
            <h3 className="truncate font-headline-sm text-headline-sm text-on-surface">{name}</h3>
            <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
              {presentation}
            </p>
          </div>
        </div>
        <AvailabilityPill status={variant} size="m" pulse={variant !== "out"} />
      </div>
      {trust && (
        <div className="pl-1">
          <TrustBadge level={trust} />
        </div>
      )}
      <div className="flex items-center justify-between gap-space-sm pl-1">
        {total > 0 ? (
          <div className="flex items-center gap-space-xs">
            <div
              className="flex -space-x-2"
              role="img"
              aria-label={`${total} farmacias con existencia`}
            >
              {shown.map((p) => (
                <span
                  key={p.name}
                  title={p.name}
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-container font-label-sm text-[11px] font-bold text-on-primary ring-2 ring-surface-container-lowest"
                >
                  {p.src ? (
                    <img src={p.src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials(p.name)
                  )}
                </span>
              ))}
              {extra > 0 && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high font-label-sm text-[11px] font-bold text-primary ring-2 ring-surface-container-lowest">
                  +{extra}
                </span>
              )}
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {total} {total === 1 ? "farmacia" : "farmacias"}
            </span>
          </div>
        ) : (
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Sin farmacias con existencia
          </span>
        )}
        <button
          type="button"
          onClick={onCtaClick}
          className={cn(
            "inline-flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-space-md font-label-md text-label-md transition-all active:scale-[0.98]",
            variant === "out"
              ? "bg-surface-container text-primary hover:bg-surface-container-high"
              : "bg-gradient-clinical text-on-secondary shadow-card-sm hover:-translate-y-0.5 hover:shadow-card",
          )}
        >
          {ctaLabel ?? CTA[variant]}
          <Icon name={variant === "out" ? "notifications_active" : "arrow_forward"} size={18} />
        </button>
      </div>
    </article>
  );
}
