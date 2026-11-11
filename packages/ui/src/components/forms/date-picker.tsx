"use client";
import { Popover } from "radix-ui";
import { useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { useFieldContext } from "./field";
import type { FieldState } from "./input";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const pad = (n: number) => String(n).padStart(2, "0");

/** "24 Octubre 2025" */
export const formatDateLong = (d: Date) =>
  `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
/** "24/10/2025" */
export const formatDateShort = (d: Date) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

/* ------------------------------ Calendario ------------------------------ */
interface CalendarProps {
  /** Mes visible (cualquier día del mes). */
  month: Date;
  onMonthChange: (d: Date) => void;
  min?: Date;
  max?: Date;
  /** Fechas seleccionadas: una (single) o inicio/fin (range). */
  start?: Date | null;
  end?: Date | null;
  /** Fecha bajo el cursor mientras se elige el fin del rango. */
  hover?: Date | null;
  onPick: (d: Date) => void;
  onHover?: (d: Date | null) => void;
}

function Calendar({
  month,
  onMonthChange,
  min,
  max,
  start,
  end,
  hover,
  onPick,
  onHover,
}: CalendarProps) {
  const today = startOfDay(new Date());
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const first = new Date(year, monthIndex, 1);
  // Lunes primero: getDay() 0=domingo -> 6
  const offset = (first.getDay() + 6) % 7;
  const cells = useMemo(
    () => Array.from({ length: 42 }, (_, i) => addDays(first, i - offset)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [year, monthIndex],
  );
  const lo = min ? startOfDay(min) : undefined;
  const hi = max ? startOfDay(max) : undefined;
  const isDisabled = (d: Date) => (!!lo && d < lo) || (!!hi && d > hi);

  // Rango efectivo (con vista previa mientras falta el fin)
  let rs = start ?? null;
  let re = end ?? hover ?? null;
  if (rs && re && re < rs) [rs, re] = [re, rs];

  const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
  const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  const prevOff = !!lo && new Date(month.getFullYear(), month.getMonth(), 0) < lo;
  const nextOff = !!hi && new Date(month.getFullYear(), month.getMonth() + 1, 1) > hi;

  return (
    <div className="w-[17.5rem] p-space-sm">
      <div className="mb-2 flex items-center justify-between px-1">
        <span aria-live="polite" className="font-label-md text-label-md font-bold text-primary">
          {MESES[month.getMonth()]} {month.getFullYear()}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Mes anterior"
            disabled={prevOff}
            onClick={() => onMonthChange(prevMonth)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Icon name="chevron_left" size={18} />
          </button>
          <button
            type="button"
            aria-label="Mes siguiente"
            disabled={nextOff}
            onClick={() => onMonthChange(nextMonth)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Icon name="chevron_right" size={18} />
          </button>
        </div>
      </div>
      <div className="mb-1 grid grid-cols-7 text-center font-label-sm text-label-sm text-outline">
        {DIAS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div
        className="grid grid-cols-7 gap-y-1 text-center font-numeric-data text-label-sm"
        onMouseLeave={() => onHover?.(null)}
      >
        {cells.map((d) => {
          const outside = d.getMonth() !== month.getMonth();
          const dis = isDisabled(d);
          const isStart = sameDay(d, start);
          const isEnd = sameDay(d, end);
          const edge = isStart || isEnd;
          const inRange = !!rs && !!re && d > rs && d < re;
          const isRangeStart = !!rs && !!re && sameDay(d, rs) && !sameDay(rs, re);
          const isRangeEnd = !!rs && !!re && sameDay(d, re) && !sameDay(rs, re);
          return (
            <span
              key={d.getTime()}
              className={cn(
                "flex h-9 items-center justify-center",
                inRange && "bg-secondary-container/50",
                isRangeStart && "rounded-l-full bg-secondary-container/50",
                isRangeEnd && "rounded-r-full bg-secondary-container/50",
              )}
            >
              <button
                type="button"
                disabled={dis}
                aria-pressed={edge || undefined}
                aria-current={sameDay(d, today) ? "date" : undefined}
                aria-label={formatDateLong(d)}
                onClick={() => onPick(d)}
                onMouseEnter={() => onHover?.(d)}
                className={cn(
                  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors",
                  outside ? "text-outline/50" : "text-on-surface",
                  !edge && !dis && "hover:bg-surface-container-high",
                  sameDay(d, today) && !edge && "ring-1 ring-secondary",
                  edge && "bg-secondary font-bold text-on-secondary shadow-card-sm",
                  dis && "cursor-not-allowed text-outline/40 line-through",
                )}
              >
                {d.getDate()}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ DatePicker ------------------------------ */
export interface DatePickerProps {
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  min?: Date;
  max?: Date;
  placeholder?: string;
  state?: FieldState;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export function DatePicker({
  value = null,
  onChange,
  min,
  max,
  placeholder = "Seleccionar fecha",
  state,
  disabled,
  id,
  className,
}: DatePickerProps) {
  const f = useFieldContext();
  const st: FieldState = state ?? (f?.invalid ? "error" : "default");
  const dis = disabled ?? f?.disabled;
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(value ?? startOfDay(new Date()));

  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        if (o) setMonth(value ?? startOfDay(new Date()));
        setOpen(o);
      }}
    >
      <Popover.Trigger asChild disabled={dis}>
        <button
          id={id ?? f?.id}
          type="button"
          aria-describedby={f?.describedBy}
          aria-invalid={st === "error" || undefined}
          className={cn(
            "flex h-12 w-full cursor-pointer items-center justify-between rounded-xl bg-surface-container-lowest px-space-md text-left font-body-md text-body-md shadow-card-sm transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary",
            st === "error" && "ring-2 ring-error",
            st === "success" && "ring-1 ring-avail-dot",
            "disabled:pointer-events-none disabled:bg-surface-container-low disabled:opacity-60 disabled:shadow-none",
            className,
          )}
        >
          <span className={cn(value ? "font-medium text-primary" : "text-outline")}>
            {value ? formatDateLong(value) : placeholder}
          </span>
          <Icon name="calendar_today" size={20} className="text-secondary" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 rounded-xl bg-surface-container-lowest shadow-overlay animate-fade-in focus:outline-none"
        >
          <Calendar
            month={month}
            onMonthChange={setMonth}
            min={min}
            max={max}
            start={value}
            onPick={(d) => {
              onChange?.(d);
              setOpen(false);
            }}
          />
          <div className="flex items-center justify-between px-space-sm pb-space-sm">
            <button
              type="button"
              onClick={() => {
                const t = startOfDay(new Date());
                if ((min && t < startOfDay(min)) || (max && t > startOfDay(max))) return;
                onChange?.(t);
                setOpen(false);
              }}
              className="cursor-pointer font-label-sm text-label-sm text-secondary hover:underline"
            >
              Hoy
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange?.(null);
                  setOpen(false);
                }}
                className="cursor-pointer font-label-sm text-label-sm text-on-surface-variant hover:text-error"
              >
                Limpiar
              </button>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* ---------------------------- DateRangePicker ---------------------------- */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (r: DateRange) => void;
  min?: Date;
  max?: Date;
  startLabel?: string;
  endLabel?: string;
  /** Muestra los atajos "Hoy", "Últimos 7 días", "Mes actual", "Trimestre". */
  presets?: boolean;
  /** Muestra el resumen "N jornadas" bajo el selector. */
  showSummary?: boolean;
  /** Texto del resumen; recibe el número de jornadas. */
  summaryText?: (days: number) => string;
  state?: FieldState;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const EMPTY: DateRange = { start: null, end: null };

function presetRanges(): { key: string; label: string; range: DateRange }[] {
  const t = startOfDay(new Date());
  const q = Math.floor(t.getMonth() / 3);
  return [
    { key: "hoy", label: "Hoy", range: { start: t, end: t } },
    { key: "7d", label: "Últimos 7 días", range: { start: addDays(t, -6), end: t } },
    {
      key: "mes",
      label: "Mes actual",
      range: {
        start: new Date(t.getFullYear(), t.getMonth(), 1),
        end: new Date(t.getFullYear(), t.getMonth() + 1, 0),
      },
    },
    {
      key: "trim",
      label: `Trimestre Q${q + 1}`,
      range: {
        start: new Date(t.getFullYear(), q * 3, 1),
        end: new Date(t.getFullYear(), q * 3 + 3, 0),
      },
    },
  ];
}

const daysBetween = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000) + 1;

export function DateRangePicker({
  value = EMPTY,
  onChange,
  min,
  max,
  startLabel = "Inicio",
  endLabel = "Cierre",
  presets = true,
  showSummary = true,
  summaryText = (n) =>
    `Generará informe consolidado de ${n} ${n === 1 ? "jornada operativa" : "jornadas operativas"}.`,
  state,
  disabled,
  id,
  className,
}: DateRangePickerProps) {
  const f = useFieldContext();
  const st: FieldState = state ?? (f?.invalid ? "error" : "default");
  const dis = disabled ?? f?.disabled;
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(value.start ?? startOfDay(new Date()));
  const [hover, setHover] = useState<Date | null>(null);
  // Primer clic fija el inicio; segundo clic fija el fin.
  const picking = !!value.start && !value.end;

  const pick = (d: Date) => {
    if (!picking) {
      onChange?.({ start: d, end: null });
      return;
    }
    const s = value.start!;
    onChange?.(d < s ? { start: d, end: s } : { start: s, end: d });
    setHover(null);
    setOpen(false);
  };

  const days = value.start && value.end ? daysBetween(value.start, value.end) : 0;
  const activePreset = presetRanges().find(
    (p) => sameDay(p.range.start, value.start) && sameDay(p.range.end, value.end),
  )?.key;

  return (
    <div className={cn("flex flex-col gap-space-sm", className)}>
      <Popover.Root
        open={open}
        onOpenChange={(o) => {
          if (o) setMonth(value.start ?? startOfDay(new Date()));
          // Si se cierra con un rango a medias, se descarta el inicio huérfano.
          if (!o && picking) onChange?.(EMPTY);
          setOpen(o);
        }}
      >
        <Popover.Trigger asChild disabled={dis}>
          <button
            id={id ?? f?.id}
            type="button"
            aria-describedby={f?.describedBy}
            aria-invalid={st === "error" || undefined}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-xl bg-surface-container-lowest p-2 text-left shadow-card-sm transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary",
              st === "error" && "ring-2 ring-error",
              st === "success" && "ring-1 ring-avail-dot",
              "disabled:pointer-events-none disabled:bg-surface-container-low disabled:opacity-60 disabled:shadow-none",
            )}
          >
            <span className="flex-1 px-2">
              <span className="block font-label-sm text-label-sm text-outline">{startLabel}</span>
              <span
                className={cn(
                  "font-numeric-data text-body-md font-semibold",
                  value.start ? "text-primary" : "text-outline",
                )}
              >
                {value.start ? formatDateShort(value.start) : "dd/mm/aaaa"}
              </span>
            </span>
            <Icon name="arrow_forward" size={18} className="text-outline" />
            <span className="flex-1 px-2">
              <span className="block font-label-sm text-label-sm text-outline">{endLabel}</span>
              <span
                className={cn(
                  "font-numeric-data text-body-md font-semibold",
                  value.end ? "text-primary" : "text-outline",
                )}
              >
                {value.end ? formatDateShort(value.end) : "dd/mm/aaaa"}
              </span>
            </span>
            <span className="rounded-lg bg-surface-container p-2 text-primary">
              <Icon name="date_range" size={20} />
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="z-50 rounded-xl bg-surface-container-lowest shadow-overlay animate-fade-in focus:outline-none"
          >
            <Calendar
              month={month}
              onMonthChange={setMonth}
              min={min}
              max={max}
              start={value.start}
              end={value.end}
              hover={picking ? hover : null}
              onHover={setHover}
              onPick={pick}
            />
            <p className="px-space-md pb-space-sm font-label-sm text-label-sm text-on-surface-variant">
              {picking ? "Selecciona la fecha de cierre." : "Selecciona la fecha de inicio."}
            </p>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {presets && (
        <div className="flex flex-wrap gap-1.5">
          {presetRanges().map((p) => {
            const active = activePreset === p.key;
            return (
              <button
                key={p.key}
                type="button"
                disabled={dis}
                aria-pressed={active}
                onClick={() => onChange?.(p.range)}
                className={cn(
                  "cursor-pointer rounded-lg px-2.5 py-1 font-label-sm text-label-sm shadow-card-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  active
                    ? "bg-secondary text-on-secondary"
                    : "bg-surface-container-lowest text-primary hover:bg-surface-container",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {showSummary && days > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-3">
          <Icon name="insights" size={20} className="text-secondary" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {summaryText(days)}
          </span>
        </div>
      )}
    </div>
  );
}
