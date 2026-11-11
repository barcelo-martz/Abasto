"use client";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import type { Availability } from "../badge/availability-pill";
import { Checkbox } from "../forms/selection";
import { StockBar, statusFromCoverage } from "./stock-bar";

const SIDE: Record<Availability, string> = {
  available: "bg-secondary",
  low: "bg-on-tertiary-container",
  out: "bg-outline-variant",
  unknown: "bg-outline-variant",
};

export interface InventorySwipeAction {
  label: string;
  icon: string;
  tone?: "primary" | "danger";
  onSelect: () => void;
}

export interface InventoryCardProps {
  name: string;
  /** Código (CU-84291). */
  code?: string;
  /** Etiqueta de régimen/categoría ("Tarjetón Vital", "Crónicos"). */
  tag?: string;
  /** "Cápsulas x 24 unids. • Lab. MedSol". */
  description?: string;
  icon?: string;
  value: number;
  max: number;
  unit?: string;
  status?: Availability;
  /** Etiqueta de validación institucional (CECMED). */
  badge?: ReactNode;
  /** Ubicación del conteo rápido ("Estante B-04"). */
  shelf?: string;
  /** Muestra el stepper de conteo rápido ± (onValueChange requerido). */
  quickCount?: boolean;
  onValueChange?: (value: number) => void;
  /** Modo selección por lotes. */
  selectable?: boolean;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Acciones reveladas al deslizar hacia la izquierda. */
  swipeActions?: InventorySwipeAction[];
  /** Acción directa si está agotado ("Pedir a Droguería"). */
  outAction?: { label: string; onClick: () => void };
  /** Texto de antigüedad ("3 min"). */
  age?: string;
  className?: string;
}

const ACTION_W = 80;

export function InventoryCard({
  name,
  code,
  tag,
  description,
  icon = "medication",
  value,
  max,
  unit = "u.",
  status,
  badge,
  shelf,
  quickCount,
  onValueChange,
  selectable,
  selected,
  onSelectedChange,
  swipeActions,
  outAction,
  age,
  className,
}: InventoryCardProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const st = status ?? statusFromCoverage(pct);
  const [dx, setDx] = useState(0);
  const start = useRef<{ x: number; base: number } | null>(null);
  const open = swipeActions?.length ? -swipeActions.length * ACTION_W : 0;

  const body = (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl p-space-md shadow-card transition-all",
        selected ? "bg-surface-container-high/40" : "bg-surface-container-lowest",
        st === "out" && "opacity-95",
        swipeActions?.length && "z-10 select-none touch-pan-y transition-transform duration-200",
        className,
      )}
      style={swipeActions?.length ? { transform: `translateX(${dx}px)` } : undefined}
      onPointerDown={
        swipeActions?.length
          ? (e) => {
              start.current = { x: e.clientX, base: dx };
            }
          : undefined
      }
      onPointerMove={
        swipeActions?.length
          ? (e) => {
              if (!start.current) return;
              setDx(Math.max(open, Math.min(0, start.current.base + e.clientX - start.current.x)));
            }
          : undefined
      }
      onPointerUp={
        swipeActions?.length
          ? () => {
              start.current = null;
              setDx((d) => (d < open / 2 ? open : 0));
            }
          : undefined
      }
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1.5", SIDE[st])} />
      <div className="flex items-start gap-space-sm pl-1">
        {selectable && (
          <div className="pt-1">
            <Checkbox
              checked={!!selected}
              onCheckedChange={(c) => onSelectedChange?.(c === true)}
              aria-label={`Seleccionar ${name}`}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-space-xs">
            <div className="flex min-w-0 items-center gap-space-xs">
              {!selectable && (
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    st === "available"
                      ? "bg-secondary-container/40 text-secondary"
                      : st === "low"
                        ? "bg-tertiary-fixed text-tertiary"
                        : "bg-surface-container text-outline",
                  )}
                >
                  <Icon name={icon} size={22} />
                </div>
              )}
              <div className="flex min-w-0 flex-col">
                <div className="flex flex-wrap items-center gap-1.5">
                  {tag && (
                    <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-[11px] font-semibold text-on-secondary-container">
                      {tag}
                    </span>
                  )}
                  {st === "out" && (
                    <span className="rounded-full bg-error-container px-2 py-0.5 font-label-sm text-[11px] font-bold text-on-error-container">
                      Agotado
                    </span>
                  )}
                  {code && <span className="font-mono text-[11px] text-outline">{code}</span>}
                </div>
                <h3 className="mt-0.5 truncate font-headline-sm text-headline-sm text-on-surface">
                  {name}
                </h3>
              </div>
            </div>
            {age && <span className="shrink-0 font-label-sm text-[11px] text-outline">{age}</span>}
          </div>
          {(description || badge) && (
            <div className="mt-space-xs flex flex-wrap items-center justify-between gap-space-xs">
              {description && (
                <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                  {description}
                </p>
              )}
              {badge && (
                <div className="flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 font-label-sm text-[11px] text-on-surface-variant">
                  {badge}
                </div>
              )}
            </div>
          )}
          <StockBar className="mt-3" value={value} max={max} unit={unit} status={st} />
        </div>
      </div>

      {quickCount && (
        <div className="mt-3 flex items-center justify-between gap-space-sm rounded-xl bg-surface-container-low px-space-sm py-2">
          <div className="flex flex-col">
            <span className="font-label-sm text-[11px] font-semibold uppercase tracking-wider text-outline">
              Conteo rápido
            </span>
            {shelf && (
              <span className="font-body-sm text-body-sm font-medium text-on-surface">{shelf}</span>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-surface-container-lowest p-1 shadow-card-sm">
            <button
              type="button"
              aria-label={`Disminuir unidad de ${name}`}
              onClick={() => onValueChange?.(Math.max(0, value - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-container text-primary active:bg-surface-container-high"
            >
              <Icon name="remove" />
            </button>
            <span
              className="tabular min-w-12 px-2 text-center font-mono font-headline-sm text-headline-sm text-primary"
              aria-live="polite"
            >
              {value}
            </span>
            <button
              type="button"
              aria-label={`Aumentar unidad de ${name}`}
              onClick={() => onValueChange?.(value + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-on-secondary active:brightness-95"
            >
              <Icon name="add" />
            </button>
          </div>
        </div>
      )}

      {st === "out" && outAction && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={outAction.onClick}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-secondary-container px-4 font-label-sm text-label-sm font-semibold text-on-secondary-container active:scale-95"
          >
            <Icon name="add_shopping_cart" size={18} />
            {outAction.label}
          </button>
        </div>
      )}
    </article>
  );

  if (!swipeActions?.length) return body;
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-error-container shadow-card">
      <div className="absolute inset-y-0 right-0 z-0 flex items-stretch">
        {swipeActions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => {
              a.onSelect();
              setDx(0);
            }}
            className={cn(
              "flex w-20 flex-col items-center justify-center gap-1 px-1 active:opacity-90",
              a.tone === "danger"
                ? "bg-error text-on-error"
                : "bg-primary-container text-on-primary",
            )}
          >
            <Icon name={a.icon} size={22} />
            <span className="text-center font-label-sm text-[10px] font-semibold leading-tight">
              {a.label}
            </span>
          </button>
        ))}
      </div>
      {body}
    </div>
  );
}
