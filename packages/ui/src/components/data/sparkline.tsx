import { useId } from "react";
import { type ChartTone, toneVar } from "./chart-utils";

export interface SparklineProps {
  data: number[];
  tone?: ChartTone;
  width?: number;
  height?: number;
  /** Rellena el área bajo la línea. */
  area?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Sparkline({
  data,
  tone = "secondary",
  width = 120,
  height = 36,
  area = true,
  className,
  ...rest
}: SparklineProps) {
  const id = useId();
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const pts = data.map(
    (v, i) =>
      [
        pad + (i / (data.length - 1)) * (width - pad * 2),
        height - pad - ((v - min) / span) * (height - pad * 2),
      ] as const,
  );
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1]!;
  const color = toneVar[tone];
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={rest["aria-label"] ?? "Tendencia"}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && (
        <path d={`${line} L${last[0]},${height} L${pts[0]![0]},${height} Z`} fill={`url(#${id})`} />
      )}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}
