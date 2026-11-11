import { cn } from "../../lib/cn";

export interface HeatmapProps {
  rows: string[];
  cols: string[];
  /** values[fila][columna], 0–100. */
  values: number[][];
  lowLabel?: string;
  highLabel?: string;
  className?: string;
}

/** Matriz de afluencia (día × franja horaria). */
export function Heatmap({
  rows,
  cols,
  values,
  lowLabel = "Baja",
  highLabel = "Alta",
  className,
}: HeatmapProps) {
  const shade = (v: number) =>
    `color-mix(in srgb, var(--color-secondary) ${Math.round(8 + (Math.min(100, Math.max(0, v)) / 100) * 92)}%, var(--color-surface-container-low))`;
  return (
    <div className={cn("w-full", className)}>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `2.25rem repeat(${cols.length}, minmax(0, 1fr))` }}
        role="table"
        aria-label="Matriz de afluencia"
      >
        <span />
        {cols.map((c) => (
          <span key={c} className="text-center font-label-sm text-[10px] text-on-surface-variant">
            {c}
          </span>
        ))}
        {rows.map((r, ri) => (
          <div key={r} role="row" className="contents">
            <span className="flex items-center font-label-sm text-[11px] text-on-surface-variant">
              {r}
            </span>
            {cols.map((c, ci) => {
              const v = values[ri]?.[ci] ?? 0;
              return (
                <span
                  key={c}
                  role="cell"
                  title={`${r} ${c}: ${v}%`}
                  className="aspect-[4/3] rounded-md transition-transform hover:scale-110"
                  style={{ background: shade(v) }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-space-sm flex items-center justify-end gap-2 font-label-sm text-[10px] text-on-surface-variant">
        {lowLabel}
        <span
          className="h-2 w-24 rounded-full"
          style={{ background: `linear-gradient(90deg, ${shade(0)}, ${shade(100)})` }}
        />
        {highLabel}
      </div>
    </div>
  );
}
