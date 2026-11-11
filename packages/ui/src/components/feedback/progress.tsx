import { cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ProgressTone = "auto" | "primary" | "clinical" | "warning" | "danger";

const fill = cva("h-full rounded-full transition-all duration-500 ease-out", {
  variants: {
    tone: {
      primary: "bg-primary-container",
      clinical: "bg-secondary",
      warning: "bg-low-dot",
      danger: "bg-error",
    },
  },
});

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100. Ignorado si `indeterminate`. */
  value?: number;
  indeterminate?: boolean;
  /** "auto": ≤ low → peligro, ≤ mid → advertencia, resto → clínico. */
  tone?: ProgressTone;
  thresholds?: { low: number; mid: number };
  size?: "sm" | "md" | "lg";
  label?: ReactNode;
  showValue?: boolean;
}

const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" } as const;

export function ProgressBar({
  value = 0,
  indeterminate,
  tone = "auto",
  thresholds = { low: 25, mid: 60 },
  size = "md",
  label,
  showValue,
  className,
  ...props
}: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  const resolved: Exclude<ProgressTone, "auto"> =
    tone !== "auto"
      ? tone
      : v <= thresholds.low
        ? "danger"
        : v <= thresholds.mid
          ? "warning"
          : "clinical";
  return (
    <div className={cn("flex w-full flex-col gap-1", className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span>{label}</span>
          {showValue && !indeterminate && (
            <span className="tabular font-numeric-data text-numeric-data text-primary">
              {Math.round(v)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(v)}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-surface-container",
          heights[size],
        )}
      >
        {indeterminate ? (
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-1/3 animate-indeterminate",
              fill({ tone: resolved === "danger" ? "danger" : "clinical" }),
            )}
          />
        ) : (
          <div className={fill({ tone: resolved })} style={{ width: `${v}%` }} />
        )}
      </div>
    </div>
  );
}

export interface SegmentedProgressProps extends HTMLAttributes<HTMLDivElement> {
  total: number;
  done: number;
  label?: ReactNode;
}

/** Seguimiento de dosis / pasos por segmentos. */
export function SegmentedProgress({
  total,
  done,
  label,
  className,
  ...props
}: SegmentedProgressProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
        <span>{label}</span>
        <span className="tabular font-numeric-data text-numeric-data text-primary">
          {done} / {total}
        </span>
      </div>
      <div
        className="flex gap-1"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors",
              i < done ? "bg-secondary" : "bg-surface-container-high",
            )}
          />
        ))}
      </div>
    </div>
  );
}
