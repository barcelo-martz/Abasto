import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { type ChartTone, toneVar } from "./chart-utils";

export interface DonutSegment {
  label: string;
  value: number;
  tone: ChartTone;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  centerValue?: ReactNode;
  centerLabel?: ReactNode;
  size?: number;
  className?: string;
}

/** Donut con métrica central y leyenda en píldoras. */
export function DonutChart({
  segments,
  centerValue,
  centerLabel,
  size = 160,
  className,
}: DonutChartProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 62,
    c = 2 * Math.PI * r,
    gap = 3;
  return (
    <div className={cn("flex flex-col items-center gap-space-md", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 160 160"
          className="h-full w-full -rotate-90"
          role="img"
          aria-label="Distribución"
        >
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke="var(--color-surface-container)"
            strokeWidth="16"
          />
          {segments.map((s, index) => {
            const len = (s.value / total) * c;
            const offset = segments
              .slice(0, index)
              .reduce((sum, segment) => sum + (segment.value / total) * c, 0);
            return (
              <circle
                key={s.label}
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke={toneVar[s.tone]}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${Math.max(len - gap, 0.1)} ${c}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue != null && (
            <span className="tabular font-headline-md text-headline-md text-primary">
              {centerValue}
            </span>
          )}
          {centerLabel != null && (
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {centerLabel}
            </span>
          )}
        </div>
      </div>
      <ul className="flex flex-wrap justify-center gap-1.5">
        {segments.map((s) => (
          <li
            key={s.label}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm text-on-surface"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: toneVar[s.tone] }} />
            {s.label}
            <span className="tabular text-on-surface-variant">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
