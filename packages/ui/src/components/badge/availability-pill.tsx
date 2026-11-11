import { cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type Availability = "available" | "low" | "out" | "unknown";

const DEFAULT_LABEL: Record<Availability, string> = {
  available: "Disponible",
  low: "Stock bajo",
  out: "Agotado",
  unknown: "Sin información",
};

const pill = cva("inline-flex items-center rounded-full font-semibold", {
  variants: {
    status: {
      available: "bg-avail-container text-on-avail-container",
      low: "bg-low-container text-on-low-container",
      out: "bg-out-container text-on-out-container",
      unknown: "bg-surface-container text-on-surface-variant",
    },
    /** l 32px · m 26px · s 20px (hoja de badges v3.4). */
    size: {
      l: "h-8 gap-2 px-3 text-[14px]",
      m: "h-[26px] gap-1.5 px-3 text-[12px]",
      s: "h-5 gap-1.5 px-2.5 text-[11px]",
    },
  },
  defaultVariants: { status: "available", size: "m" },
});

const dot = cva("rounded-full", {
  variants: {
    status: {
      available: "bg-avail-dot",
      low: "bg-low-dot",
      out: "bg-out-dot",
      unknown: "bg-outline",
    },
    size: { l: "h-2.5 w-2.5", m: "h-2 w-2", s: "h-1.5 w-1.5" },
  },
});

export interface AvailabilityPillProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  status: Availability;
  size?: "l" | "m" | "s";
  /** Texto personalizado (por defecto: Disponible / Stock bajo / Agotado / Sin información). */
  label?: ReactNode;
  /** Cantidad adyacente ("140 u."). */
  count?: ReactNode;
  /** Pulso animado en el punto (solo disponible / bajo). */
  pulse?: boolean;
}

export function AvailabilityPill({
  status,
  size = "m",
  label,
  count,
  pulse,
  className,
  ...props
}: AvailabilityPillProps) {
  const animate = pulse && (status === "available" || status === "low");
  return (
    <span
      className={cn(pill({ status, size }), count != null && "justify-between", className)}
      {...props}
    >
      <span className="inline-flex items-center gap-[inherit]">
        <span className="relative inline-flex">
          {animate && (
            <span
              aria-hidden
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                dot({ status, size }),
              )}
            />
          )}
          <span aria-hidden className={cn("relative inline-flex", dot({ status, size }))} />
        </span>
        <span>{label ?? DEFAULT_LABEL[status]}</span>
      </span>
      {count != null && (
        <span className="tabular font-numeric-data text-numeric-data opacity-80">{count}</span>
      )}
    </span>
  );
}
