"use client";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export type ShiftValue = "manana" | "tarde" | "noche" | "24h";

export interface ShiftOption {
  value: ShiftValue;
  label: string;
  /** Rango horario mostrado bajo la etiqueta. */
  hours: string;
  icon: string;
}

export const SHIFT_OPTIONS: ShiftOption[] = [
  { value: "manana", label: "Mañana", hours: "08:00 - 16:00", icon: "wb_sunny" },
  { value: "tarde", label: "Tarde", hours: "16:00 - 00:00", icon: "wb_twilight" },
  { value: "noche", label: "Noche", hours: "00:00 - 08:00", icon: "dark_mode" },
  { value: "24h", label: "Guardia 24h", hours: "Todo el día", icon: "schedule" },
];

export interface ShiftPickerProps {
  value: ShiftValue | null;
  onChange: (v: ShiftValue) => void;
  /** "segmented": botones en fila; "list": filas con punto indicador (prototipo). */
  variant?: "segmented" | "list";
  /** Turnos a mostrar (por defecto los cuatro). */
  shifts?: ShiftValue[];
  disabled?: boolean;
  /** Nota al pie (p. ej. huso horario). */
  footnote?: string;
  "aria-label"?: string;
  className?: string;
}

export function ShiftPicker({
  value,
  onChange,
  variant = "segmented",
  shifts,
  disabled,
  footnote,
  "aria-label": ariaLabel = "Turno de guardia",
  className,
}: ShiftPickerProps) {
  const options = shifts ? SHIFT_OPTIONS.filter((o) => shifts.includes(o.value)) : SHIFT_OPTIONS;

  const move = (i: number, dir: 1 | -1) => {
    const next = options[(i + dir + options.length) % options.length];
    if (!next) return;
    onChange(next.value);
    const el = document.getElementById(`shift-${next.value}`);
    el?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(i, 1);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(i, -1);
    }
  };

  return (
    <div className={cn("flex flex-col gap-space-xs", className)}>
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn(
          variant === "segmented"
            ? "grid grid-cols-2 gap-1 rounded-xl bg-surface-container-low p-1 sm:grid-cols-4"
            : "flex flex-col gap-1.5",
        )}
      >
        {options.map((o, i) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              id={`shift-${o.value}`}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              tabIndex={active || (value === null && i === 0) ? 0 : -1}
              onClick={() => onChange(o.value)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50",
                variant === "segmented"
                  ? cn(
                      "flex flex-col items-center gap-0.5 rounded-lg px-space-sm py-2 text-center",
                      active
                        ? "bg-secondary text-on-secondary shadow-card-sm"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                    )
                  : cn(
                      "flex items-center justify-between rounded-lg bg-surface-container-lowest p-2 text-left shadow-card-sm",
                      active
                        ? "text-primary"
                        : "text-on-surface-variant hover:bg-surface-container-low",
                    ),
              )}
            >
              {variant === "segmented" ? (
                <>
                  <Icon name={o.icon} size={18} />
                  <span className="font-label-md text-label-md">{o.label}</span>
                  <span
                    className={cn(
                      "font-numeric-data text-[11px]",
                      active ? "text-on-secondary/80" : "text-outline",
                    )}
                  >
                    {o.hours}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-label-sm text-label-sm">
                    {o.label}{" "}
                    <span className="font-numeric-data font-normal text-outline">({o.hours})</span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "h-2 w-2 rounded-full",
                      active ? "bg-secondary" : "bg-outline-variant",
                    )}
                  />
                </>
              )}
            </button>
          );
        })}
      </div>
      {footnote && (
        <div className="flex items-center gap-1.5 px-1 font-label-sm text-label-sm text-on-surface-variant">
          <Icon name="schedule" size={16} className="text-secondary" />
          <span>{footnote}</span>
        </div>
      )}
    </div>
  );
}
