import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface StepperStep {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** Icono para el paso activo/pendiente (por defecto el número). */
  icon?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Índice del paso activo (0-based). Anteriores = completados. */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Si se pasa, los pasos completados son clicables. */
  onStepClick?: (index: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  current,
  orientation = "horizontal",
  onStepClick,
  className,
}: StepperProps) {
  const vertical = orientation === "vertical";
  return (
    <ol className={cn("flex", vertical ? "flex-col" : "items-start", className)}>
      {steps.map((s, i) => {
        const state = i < current ? "completed" : i === current ? "active" : "pending";
        const last = i === steps.length - 1;
        const clickable = onStepClick && state === "completed";
        const circle = (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-numeric-data text-numeric-data font-bold transition-colors",
              state === "completed" && "bg-secondary text-on-secondary",
              state === "active" && "bg-primary text-on-primary ring-4 ring-primary-fixed",
              state === "pending" && "bg-surface-container-high text-outline",
            )}
          >
            {state === "completed" ? (
              <Icon name="check" size={18} />
            ) : s.icon ? (
              <Icon name={s.icon} size={18} />
            ) : (
              i + 1
            )}
          </span>
        );
        const text = (
          <span
            className={cn(
              "flex flex-col",
              vertical ? "pb-space-lg" : "mt-2 items-center text-center",
            )}
          >
            <span
              className={cn(
                "font-label-md text-label-md",
                state === "pending" ? "text-on-surface-variant" : "text-primary",
              )}
            >
              {s.title}
            </span>
            {s.description && (
              <span className="font-label-sm text-label-sm font-normal text-on-surface-variant">
                {s.description}
              </span>
            )}
          </span>
        );
        return (
          <li
            key={s.id}
            aria-current={state === "active" ? "step" : undefined}
            className={cn(
              "relative flex",
              vertical ? "gap-space-sm" : "flex-1 flex-col items-center",
            )}
          >
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute rounded-full",
                  state === "completed" ? "bg-secondary" : "bg-surface-container-high",
                  vertical
                    ? "bottom-0 left-[17px] top-9 w-0.5"
                    : "left-[calc(50%+22px)] right-[calc(-50%+22px)] top-[17px] h-0.5",
                )}
              />
            )}
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick(i)}
                className={cn(
                  "flex cursor-pointer",
                  vertical ? "gap-space-sm text-left" : "flex-col items-center",
                )}
              >
                {circle}
                {text}
              </button>
            ) : (
              <>
                {circle}
                {text}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
