import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export type TimelineStatus = "completed" | "active" | "pending";

export interface TimelineItem {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Fecha / hora ("14 Feb · 10:45"). */
  date?: ReactNode;
  status: TimelineStatus;
  icon?: string;
}

const node: Record<TimelineStatus, string> = {
  completed: "bg-secondary text-on-secondary",
  active: "bg-primary text-on-primary ring-4 ring-primary-fixed",
  pending: "bg-surface-container-high text-outline",
};

/** Línea de tiempo vertical de trazabilidad. */
export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn("relative flex flex-col", className)}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <li
            key={it.id ?? i}
            aria-current={it.status === "active" ? "step" : undefined}
            className="relative flex gap-space-md pb-space-lg last:pb-0"
          >
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[15px] top-8 bottom-0 w-0.5",
                  it.status === "completed" ? "bg-secondary" : "bg-surface-container-highest",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                node[it.status],
              )}
            >
              <Icon
                name={
                  it.icon ??
                  (it.status === "completed"
                    ? "check"
                    : it.status === "active"
                      ? "sync"
                      : "radio_button_unchecked")
                }
                size={18}
                className={it.status === "active" ? "animate-pulse" : undefined}
              />
            </span>
            <div className="flex min-w-0 flex-1 flex-col pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-space-sm">
                <p
                  className={cn(
                    "font-headline-sm text-headline-sm",
                    it.status === "pending" ? "text-on-surface-variant" : "text-primary",
                  )}
                >
                  {it.title}
                </p>
                {it.date && (
                  <span className="tabular font-label-sm text-label-sm text-outline">
                    {it.date}
                  </span>
                )}
              </div>
              {it.description && (
                <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                  {it.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
