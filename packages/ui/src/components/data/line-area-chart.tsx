"use client";
import { useId, useState } from "react";
import { cn } from "../../lib/cn";
import { niceMax } from "./chart-utils";

export interface LinePoint {
  label: string;
  /** Serie real (línea navy con área). */
  actual: number;
  /** Proyección (línea teal punteada). */
  projected?: number;
}

export interface LineAreaChartProps {
  data: LinePoint[];
  actualLabel?: string;
  projectedLabel?: string;
  unit?: string;
  className?: string;
}

const W = 640,
  H = 280,
  L = 44,
  R = 16,
  T = 16,
  B = 32;

export function LineAreaChart({
  data,
  actualLabel = "Dispensación",
  projectedLabel = "Demanda proyectada",
  unit = "",
  className,
}: LineAreaChartProps) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  if (data.length < 2) return null;
  const max = niceMax(Math.max(...data.flatMap((d) => [d.actual, d.projected ?? 0])));
  const x = (i: number) => L + (i / (data.length - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const path = (get: (d: LinePoint) => number | undefined) =>
    data
      .flatMap((d, i) =>
        get(d) == null ? [] : [`${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(get(d)!).toFixed(1)}`],
      )
      .join(" ");
  const actual = path((d) => d.actual);
  const hasProj = data.some((d) => d.projected != null);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const h = hover != null ? data[hover] : null;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={`${actualLabel} frente a ${projectedLabel}`}
          onPointerLeave={() => setHover(null)}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - r.left) / r.width) * W;
            setHover(
              Math.min(
                data.length - 1,
                Math.max(0, Math.round(((px - L) / (W - L - R)) * (data.length - 1))),
              ),
            );
          }}
        >
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.18" />
              <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={L}
                x2={W - R}
                y1={y(max * t)}
                y2={y(max * t)}
                stroke="var(--color-outline-variant)"
                strokeOpacity="0.5"
                strokeDasharray={t === 0 ? undefined : "3 4"}
              />
              <text
                x={L - 8}
                y={y(max * t) + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--color-on-surface-variant)"
              >
                {Math.round(max * t)}
              </text>
            </g>
          ))}
          {data.map((d, i) => (
            <text
              key={d.label}
              x={x(i)}
              y={H - 10}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-on-surface-variant)"
            >
              {d.label}
            </text>
          ))}
          <path
            d={`${actual} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`}
            fill={`url(#${id})`}
          />
          {hasProj && (
            <path
              d={path((d) => d.projected)}
              fill="none"
              stroke="var(--color-secondary)"
              strokeWidth="2"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
          )}
          <path
            d={actual}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((d, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(d.actual)}
              r={hover === i ? 5 : 3}
              fill="var(--color-surface-container-lowest)"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
          ))}
          {hover != null && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={T}
              y2={H - B}
              stroke="var(--color-secondary)"
              strokeOpacity="0.4"
            />
          )}
        </svg>
        {h && hover != null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl bg-inverse-surface px-3 py-2 text-inverse-on-surface shadow-raised"
            style={{ left: `${(x(hover) / W) * 100}%`, top: 0 }}
          >
            <p className="font-label-sm text-label-sm opacity-70">{h.label}</p>
            <p className="tabular font-numeric-data text-numeric-data font-bold">
              {h.actual}
              {unit}
            </p>
            {h.projected != null && (
              <p className="tabular font-label-sm text-label-sm text-secondary-fixed-dim">
                Proy. {h.projected}
                {unit}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="mt-space-xs flex flex-wrap gap-space-md font-label-sm text-label-sm text-on-surface-variant">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded bg-primary" />
          {actualLabel}
        </span>
        {hasProj && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-5 border-t-2 border-dashed border-secondary" />
            {projectedLabel}
          </span>
        )}
      </div>
    </div>
  );
}
