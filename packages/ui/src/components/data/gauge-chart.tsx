import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface GaugeChartProps {
  /** 0–100 */
  value: number;
  label?: ReactNode;
  /** Umbrales: por debajo de `low` → rojo; por debajo de `mid` → ámbar; resto teal. */
  thresholds?: { low: number; mid: number };
  className?: string;
}

/** Indicador semicircular de probabilidad 0–100 %. */
export function GaugeChart({
  value,
  label = "Probabilidad",
  thresholds = { low: 30, mid: 60 },
  className,
}: GaugeChartProps) {
  const v = Math.min(100, Math.max(0, value));
  const r = 80,
    cx = 100,
    cy = 100;
  const arc = Math.PI * r;
  const color =
    v < thresholds.low
      ? "var(--color-error)"
      : v < thresholds.mid
        ? "var(--color-warning)"
        : "var(--color-secondary)";
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const a = Math.PI * (1 - v / 100);
  const nx = cx + (r - 22) * Math.cos(a),
    ny = cy - (r - 22) * Math.sin(a);
  return (
    <div className={cn("relative mx-auto w-full max-w-[240px]", className)}>
      <svg
        viewBox="0 0 200 116"
        className="w-full"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        aria-label={typeof label === "string" ? label : "Probabilidad"}
      >
        <path
          d={d}
          fill="none"
          stroke="var(--color-surface-container-high)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${(v / 100) * arc} ${arc}`}
          className="transition-all duration-700"
        />
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="6" fill="var(--color-primary)" />
      </svg>
      <div className="-mt-1 text-center">
        <p className="tabular font-headline-lg text-headline-lg text-primary">{Math.round(v)}%</p>
        <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
      </div>
    </div>
  );
}
