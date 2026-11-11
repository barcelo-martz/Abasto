import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface CountBadgeProps {
  count: number;
  tone?: "primary" | "warning" | "error";
  max?: number;
  className?: string;
}

export function CountBadge({ count, tone = "primary", max = 99, className }: CountBadgeProps) {
  const tones = {
    primary: "bg-primary text-on-primary",
    warning: "bg-warning text-white",
    error: "bg-error text-on-error",
  } as const;
  return (
    <span
      className={cn(
        "tabular inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-numeric-data text-[12px] font-bold",
        tones[tone],
        className,
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}

export interface FreshnessChipProps {
  /** Texto, p. ej. "Actualizado 14:20". */
  children: ReactNode;
  tone?: "fresh" | "stale";
  className?: string;
}

export function FreshnessChip({ children, tone = "fresh", className }: FreshnessChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] text-on-surface-variant",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-2 w-2 rounded-full", tone === "fresh" ? "bg-avail-dot" : "bg-low-dot")}
      />
      {children}
    </span>
  );
}

export interface LivePulseProps {
  label?: string;
  tone?: "online" | "warning" | "offline";
  className?: string;
}

export function LivePulse({ label = "En línea", tone = "online", className }: LivePulseProps) {
  const dot = { online: "bg-secondary", warning: "bg-low-dot", offline: "bg-outline" }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-headline-sm text-[13px] text-primary",
        className,
      )}
    >
      <span className="relative flex h-3 w-3">
        {tone !== "offline" && (
          <span
            aria-hidden
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dot,
            )}
          />
        )}
        <span aria-hidden className={cn("relative inline-flex h-3 w-3 rounded-full", dot)} />
      </span>
      {label}
    </span>
  );
}

export type SyncState = "pending" | "synced" | "syncing" | "conflict";

const SYNC: Record<SyncState, { label: string; icon: string; cls: string }> = {
  pending: {
    label: "Pendiente de sincronizar",
    icon: "cloud_off",
    cls: "bg-warning-container text-on-warning-container",
  },
  synced: {
    label: "Sincronizado",
    icon: "cloud_done",
    cls: "bg-secondary-container/50 text-secondary",
  },
  syncing: { label: "Sincronizando…", icon: "sync", cls: "bg-info-container text-primary" },
  conflict: {
    label: "Conflicto",
    icon: "error",
    cls: "bg-error-container text-on-error-container",
  },
};

export interface SyncChipProps {
  state: SyncState;
  label?: string;
  className?: string;
}

export function SyncChip({ state, label, className }: SyncChipProps) {
  const c = SYNC[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label-sm text-label-sm",
        c.cls,
        className,
      )}
    >
      <Icon name={c.icon} size={14} className={state === "syncing" ? "animate-spin" : undefined} />
      {label ?? c.label}
    </span>
  );
}
