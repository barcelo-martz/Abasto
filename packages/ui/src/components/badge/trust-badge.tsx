"use client";
import { Tooltip } from "radix-ui";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export type TrustLevel = "verified" | "estimated" | "stale";

const CFG: Record<TrustLevel, { label: string; icon: string; cls: string }> = {
  verified: {
    label: "Verificada",
    icon: "verified",
    cls: "bg-secondary-container text-on-secondary-container",
  },
  estimated: {
    label: "Estimada",
    icon: "analytics",
    cls: "bg-warning-container text-on-warning-container",
  },
  stale: {
    label: "Sin información reciente",
    icon: "history_toggle_off",
    cls: "bg-surface-container text-on-surface-variant",
  },
};

export interface TrustBadgeProps {
  level: TrustLevel;
  size?: "s" | "m";
  /** Texto del tooltip explicativo. */
  description?: string;
  className?: string;
}

export function TrustBadge({ level, size = "m", description, className }: TrustBadgeProps) {
  const c = CFG[level];
  const badge = (
    <span
      tabIndex={description ? 0 : undefined}
      className={cn(
        "inline-flex items-center rounded-full font-bold",
        size === "m" ? "gap-1 px-2.5 py-1 text-[11px]" : "gap-1 px-2 py-0.5 text-[10px]",
        c.cls,
        className,
      )}
    >
      <Icon name={c.icon} size={size === "m" ? 14 : 12} filled={level === "verified"} />
      {c.label}
    </span>
  );
  if (!description) return badge;
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{badge}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={8}
            className="z-[70] max-w-64 animate-fade-in rounded-xl bg-inverse-surface px-space-sm py-space-xs font-body-sm text-body-sm text-inverse-on-surface shadow-overlay"
          >
            {description}
            <Tooltip.Arrow className="fill-inverse-surface" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
