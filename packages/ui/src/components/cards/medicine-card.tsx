import { cva } from "class-variance-authority";
import type { ElementType, HTMLAttributes, ReactNode, Ref } from "react";
/* eslint-disable @next/next/no-img-element */
import { cn } from "../../lib/cn";
import { AvailabilityPill } from "../badge/availability-pill";
import { CategoryTag } from "../badge/chips";
import { TrustBadge, type TrustLevel } from "../badge/trust-badge";
import { Icon } from "../icon";
import { AppLink } from "../navigation/link";

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
        unknown: "bg-surface-container-lowest",
      },
    },
    defaultVariants: { variant: "available" },
  },
);

const rail = {
  available: "bg-secondary",
  low: "bg-low-dot",
  out: "bg-out-dot",
  unknown: "bg-outline",
} as const;
const iconTone = {
  available: "bg-secondary-container/40 text-secondary",
  low: "bg-low-container text-on-low-container",
  out: "bg-out-container text-on-out-container",
  unknown: "bg-surface-container text-on-surface-variant",
} as const;
const CTA = {
  available: "Ver farmacias",
  low: "Ver alternativas",
  out: "Avisarme cuando llegue",
  unknown: "Solicitar información",
} as const;

const initials = (n: string) =>
  n
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export interface MedicineCardProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  variant: "available" | "low" | "out" | "unknown";
  name: string;
  presentation: string;
  trust?: TrustLevel;
  /** Variante compacta de catálogo (código, categoría, detalles y precio). */
  code?: ReactNode;
  controlled?: ReactNode;
  details?: { label: ReactNode; value: ReactNode }[];
  price?: ReactNode;
  availabilityLabel?: ReactNode;
  pharmacies?: PharmacyAvatar[];
  /** Total de farmacias con existencia (si es mayor que las avatares mostradas). */
  pharmacyCount?: number;
  maxAvatars?: number;
  ctaLabel?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  linkComponent?: ElementType;
  ref?: Ref<HTMLElement>;
}

export function MedicineCard({
  variant,
  name,
  presentation,
  trust,
  code,
  controlled,
  details,
  price,
  availabilityLabel,
  pharmacies = [],
  pharmacyCount,
  maxAvatars = 4,
  ctaLabel,
  onCtaClick,
  ctaHref,
  linkComponent,
  className,
  ref,
  ...props
}: MedicineCardProps) {
  const total = pharmacyCount ?? pharmacies.length;
  const shown = pharmacies.slice(0, maxAvatars);
  const extra = total - shown.length;
  const catalog = code != null || controlled != null || details != null || price != null;
  return (
    <article ref={ref} className={cn(card({ variant }), className)} {...props}>
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1.5", rail[variant])} />
      {catalog ? (
        <>
          <div className="flex items-center justify-between gap-space-xs">
            <AvailabilityPill status={variant} size="s" label={availabilityLabel} />
            {code && (
              <span className="tabular font-label-sm text-label-sm font-medium text-outline">
                {code}
              </span>
            )}
          </div>
          {controlled && (
            <CategoryTag icon="badge" tone="controlled" className="w-fit">
              {controlled}
            </CategoryTag>
          )}
          <div className="pl-1">
            {trust && (
              <div className="mb-space-xs">
                <TrustBadge level={trust} />
              </div>
            )}
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary">{name}</h3>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{presentation}</p>
          </div>
          {details && (
            <dl className="mt-space-md space-y-1 pt-space-sm font-label-sm text-label-sm text-on-surface-variant">
              {details.map((detail) => (
                <div key={String(detail.label)} className="flex justify-between gap-space-xs">
                  <dt>{detail.label}:</dt>
                  <dd className="text-right font-bold text-on-surface">{detail.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-auto flex items-center justify-between gap-space-sm pt-space-lg">
            {price ? (
              <span className="tabular font-label-md text-label-md font-bold text-primary">
                {price}
              </span>
            ) : (
              <span />
            )}
            {ctaHref ? (
              <AppLink
                href={ctaHref}
                linkComponent={linkComponent}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-surface-container px-space-sm font-label-sm text-label-sm font-semibold text-primary transition-colors hover:bg-surface-container-high"
              >
                <span>{ctaLabel ?? CTA[variant]}</span>
                <span className="sr-only"> {name}</span>
              </AppLink>
            ) : (
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex h-8 cursor-pointer items-center rounded-lg bg-surface-container px-space-sm font-label-sm text-label-sm font-semibold text-primary transition-colors hover:bg-surface-container-high"
              >
                <span>{ctaLabel ?? CTA[variant]}</span>
                <span className="sr-only"> {name}</span>
              </button>
            )}
          </div>
        </>
      ) : (
        <>
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
                <h3 className="truncate font-headline-sm text-headline-sm text-on-surface">
                  {name}
                </h3>
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
          <div className="mt-auto flex items-center justify-between gap-space-sm pl-1">
            {total > 0 ? (
              <div className="flex items-center gap-space-xs">
                <div
                  className="flex -space-x-2"
                  role="img"
                  aria-label={`${total} farmacias con existencia`}
                >
                  {shown.map((pharmacy) => (
                    <span
                      key={pharmacy.name}
                      title={pharmacy.name}
                      className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-container font-label-sm text-[11px] font-bold text-on-primary ring-2 ring-surface-container-lowest"
                    >
                      {pharmacy.src ? (
                        <img src={pharmacy.src} alt="" className="h-full w-full object-cover" />
                      ) : (
                        initials(pharmacy.name)
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
            {ctaHref ? (
              <AppLink
                href={ctaHref}
                linkComponent={linkComponent}
                className={cn(
                  "inline-flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-space-md font-label-md text-label-md transition-all active:scale-[0.98]",
                  variant === "out"
                    ? "bg-surface-container text-primary hover:bg-surface-container-high"
                    : "bg-gradient-clinical text-on-secondary shadow-card-sm hover:-translate-y-0.5 hover:shadow-card",
                )}
              >
                {ctaLabel ?? CTA[variant]}
                <Icon
                  name={variant === "out" ? "notifications_active" : "arrow_forward"}
                  size={18}
                />
              </AppLink>
            ) : (
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
                <Icon
                  name={variant === "out" ? "notifications_active" : "arrow_forward"}
                  size={18}
                />
              </button>
            )}
          </div>
        </>
      )}
    </article>
  );
}
