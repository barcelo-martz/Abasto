import { cn } from "../../lib/cn";
import { type ChartTone, niceMax, toneVar } from "./chart-utils";

export interface BarDatum {
  label: string;
  value: number;
  tone?: ChartTone;
}

export interface BarChartProps {
  data: BarDatum[];
  /** Máximo del eje (por defecto, redondeado desde los datos). */
  max?: number;
  unit?: string;
  height?: number;
  className?: string;
}

/** Barras verticales redondeadas con etiqueta de valor. */
export function BarChart({ data, max, unit = "", height = 200, className }: BarChartProps) {
  const top = max ?? niceMax(Math.max(...data.map((d) => d.value), 1));
  const W = 320,
    B = 28,
    T = 22;
  const slot = W / data.length;
  const bw = Math.min(36, slot * 0.58);
  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className={cn("w-full", className)}
      role="img"
      aria-label="Gráfico de barras"
    >
      <line
        x1="0"
        x2={W}
        y1={height - B}
        y2={height - B}
        stroke="var(--color-outline-variant)"
        strokeOpacity="0.6"
      />
      {data.map((d, i) => {
        const h = Math.max(4, (d.value / top) * (height - B - T));
        const cx = slot * i + slot / 2;
        const tone = d.tone ?? "secondary";
        return (
          <g key={d.label}>
            <rect
              x={cx - bw / 2}
              y={height - B - h}
              width={bw}
              height={h}
              rx={Math.min(10, bw / 2)}
              fill={toneVar[tone]}
            />
            <text
              x={cx}
              y={height - B - h - 6}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--color-primary)"
              className="tabular"
            >
              {d.value}
              {unit}
            </text>
            <text
              x={cx}
              y={height - 9}
              textAnchor="middle"
              fontSize="10.5"
              fill="var(--color-on-surface-variant)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
