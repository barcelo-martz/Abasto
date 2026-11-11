import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { Sparkline } from "../data/sparkline";
import type { ChartTone } from "../data/chart-utils";

export interface KpiCardProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  label: string;
  value: ReactNode;
  unit?: string;
  /** Variación porcentual respecto al periodo anterior. */
  delta?: number;
  deltaLabel?: string;
  /** Si subir es negativo (p. ej. desabastecimientos) invierte los colores del delta. */
  invertDelta?: boolean;
  icon?: string;
  /** Serie para el sparkline. */
  trend?: number[];
  trendTone?: ChartTone;
  ref?: Ref<HTMLElement>;
}

export function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaLabel = "vs. semana anterior",
  invertDelta,
  icon,
  trend,
  trendTone,
  className,
  ref,
  ...props
}: KpiCardProps) {
  const good = delta == null || delta === 0 ? null : invertDelta ? delta < 0 : delta > 0;
  const tone: ChartTone = trendTone ?? (good === false ? "error" : "secondary");
  return (
    <article
      ref={ref}
      className={cn(
        "flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-card",
        className,
      )}
      {...props}
    >
      <header className="flex items-center justify-between gap-space-xs">
        <h3 className="font-label-md text-label-md text-on-surface-variant">{label}</h3>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-container/40 text-secondary">
            <Icon name={icon} size={20} />
          </span>
        )}
      </header>
      <div className="flex items-end justify-between gap-space-sm">
        <div className="flex min-w-0 flex-col">
          <p className="tabular flex items-baseline gap-1 font-headline-lg text-headline-lg text-primary">
            {value}
            {unit && (
              <span className="font-label-md text-label-md text-on-surface-variant">{unit}</span>
            )}
          </p>
          {delta != null && (
            <p className="flex items-center gap-1 font-label-sm text-label-sm">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-bold",
                  good === null && "bg-surface-container text-on-surface-variant",
                  good === true && "bg-avail-container text-on-avail-container",
                  good === false && "bg-out-container text-on-out-container",
                )}
              >
                <Icon name={delta >= 0 ? "trending_up" : "trending_down"} size={14} />
                <span className="tabular">
                  {delta > 0 ? "+" : ""}
                  {delta}%
                </span>
              </span>
              <span className="truncate text-on-surface-variant">{deltaLabel}</span>
            </p>
          )}
        </div>
        {trend && trend.length > 1 && (
          <Sparkline
            data={trend}
            tone={tone}
            width={96}
            height={40}
            className="h-10 w-24 shrink-0"
            aria-label={`Tendencia de ${label}`}
          />
        )}
      </div>
    </article>
  );
}
