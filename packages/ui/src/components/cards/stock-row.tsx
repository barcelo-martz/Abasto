import type { HTMLAttributes, KeyboardEvent, Ref } from "react";
import { cn } from "../../lib/cn";
import { AvailabilityPill } from "../badge/availability-pill";
import { StockBar, statusFromCoverage, type StockThresholds } from "./stock-bar";

export interface StockRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  name: string;
  presentation?: string;
  stock: number;
  max: number;
  unit?: string;
  thresholds?: StockThresholds;
  selected?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/** Fila densa de stock (lista compacta de 56px). */
export function StockRow({
  name,
  presentation,
  stock,
  max,
  unit = "u.",
  thresholds,
  selected,
  onClick,
  className,
  ref,
  ...props
}: StockRowProps) {
  const pct = max > 0 ? Math.round((stock / max) * 100) : 0;
  const st = statusFromCoverage(pct, thresholds);
  const interactive = !!onClick;
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (interactive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.currentTarget.click();
    }
  };
  return (
    <div
      ref={ref}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive && selected != null ? selected : undefined}
      onClick={onClick}
      onKeyDown={onKey}
      className={cn(
        "grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-space-sm gap-y-1 rounded-lg bg-surface-container-lowest px-space-sm py-2 transition-colors",
        "sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto]",
        interactive && "cursor-pointer hover:bg-surface-container-low active:bg-surface-container",
        selected && "bg-secondary-container/30 ring-1 ring-secondary",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-label-md text-label-md text-on-surface">{name}</span>
        {presentation && (
          <span className="truncate font-label-sm text-label-sm text-on-surface-variant">
            {presentation}
          </span>
        )}
      </div>
      <AvailabilityPill status={st} size="s" className="justify-self-end sm:order-4" />
      <StockBar
        bare
        value={stock}
        max={max}
        thresholds={thresholds}
        size="s"
        className="col-span-2 sm:order-2 sm:col-span-1"
      />
      <span className="tabular hidden text-right font-numeric-data text-numeric-data font-bold text-primary sm:order-3 sm:block">
        {stock} {unit}
      </span>
    </div>
  );
}
