import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";
import type { Availability } from "../badge/availability-pill";

export interface StockThresholds {
  /** Por debajo de este porcentaje de cobertura el estado es "agotado/crítico" (por defecto 15). */
  critical: number;
  /** Por debajo de este porcentaje el estado es "stock bajo" (por defecto 40). */
  low: number;
}

export const DEFAULT_THRESHOLDS: StockThresholds = { critical: 15, low: 40 };

/** Deriva el estado de disponibilidad a partir del % de cobertura. */
export function statusFromCoverage(
  pct: number,
  t: StockThresholds = DEFAULT_THRESHOLDS,
): Availability {
  if (pct <= 0) return "out";
  if (pct < t.critical) return "out";
  if (pct < t.low) return "low";
  return "available";
}

export const FILL: Record<Availability, string> = {
  available: "bg-secondary",
  low: "bg-low-dot",
  out: "bg-out-dot",
  unknown: "bg-outline",
};

export const DOT: Record<Availability, string> = {
  available: "bg-avail-dot",
  low: "bg-low-dot",
  out: "bg-out-dot",
  unknown: "bg-outline",
};

const STATE_LABEL: Record<Availability, string> = {
  available: "Disponible",
  low: "Stock bajo",
  out: "Crítico",
  unknown: "Sin datos",
};

export interface StockBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Existencia actual. */
  value: number;
  /** Capacidad / existencia objetivo (100% de cobertura). */
  max: number;
  unit?: string;
  /** Etiqueta personalizada; por defecto "Disponible • 84% de cobertura". */
  label?: ReactNode;
  /** Oculta la fila de etiqueta y cantidad (solo barra). */
  bare?: boolean;
  thresholds?: StockThresholds;
  /** Fuerza el estado en lugar de derivarlo de los umbrales. */
  status?: Availability;
  size?: "s" | "m";
  ref?: Ref<HTMLDivElement>;
}

export function StockBar({
  value,
  max,
  unit = "u.",
  label,
  bare,
  thresholds = DEFAULT_THRESHOLDS,
  status,
  size = "m",
  className,
  ref,
  ...props
}: StockBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
  const st = status ?? statusFromCoverage(pct, thresholds);
  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
      {!bare && (
        <div className="flex items-center justify-between gap-space-xs font-label-sm text-label-sm">
          <span className="flex min-w-0 items-center gap-1.5 font-medium text-on-surface-variant">
            <span aria-hidden className={cn("h-2 w-2 shrink-0 rounded-full", DOT[st])} />
            <span className="truncate">{label ?? `${STATE_LABEL[st]} • ${pct}% de cobertura`}</span>
          </span>
          <span className="tabular shrink-0 font-numeric-data text-numeric-data font-bold text-primary">
            {value} / {max} {unit}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={`Cobertura de stock ${pct}%`}
        className={cn(
          "w-full overflow-hidden rounded-full bg-surface-container",
          size === "s" ? "h-1" : "h-2",
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300", FILL[st])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
