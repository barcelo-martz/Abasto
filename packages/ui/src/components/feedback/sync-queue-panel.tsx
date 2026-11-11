import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../button";
import { Icon } from "../icon";

export type SyncStatus = "pending" | "syncing" | "synced" | "conflict";

export interface SyncQueueItem {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  status: SyncStatus;
}

const META: Record<SyncStatus, { label: string; icon: string; chip: string }> = {
  pending: {
    label: "Pendiente",
    icon: "schedule",
    chip: "bg-warning-container text-on-warning-container",
  },
  syncing: {
    label: "Sincronizando",
    icon: "sync",
    chip: "bg-info-container text-on-info-container",
  },
  synced: {
    label: "Sincronizado",
    icon: "cloud_done",
    chip: "bg-avail-container text-on-avail-container",
  },
  conflict: {
    label: "Conflicto",
    icon: "error",
    chip: "bg-error-container text-on-error-container",
  },
};

/** Chip de estado de sincronización (reutilizable fuera del panel). */
export function SyncStatusChip({ status, className }: { status: SyncStatus; className?: string }) {
  const m = META[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full px-2.5 font-label-sm text-label-sm",
        m.chip,
        className,
      )}
    >
      <Icon name={m.icon} size={14} className={status === "syncing" ? "animate-spin" : undefined} />
      {m.label}
    </span>
  );
}

export interface SyncQueuePanelProps {
  items: SyncQueueItem[];
  title?: ReactNode;
  onRetry?: (item: SyncQueueItem) => void;
  onResolve?: (item: SyncQueueItem) => void;
  onDiscard?: (item: SyncQueueItem) => void;
  onSyncAll?: () => void;
  className?: string;
}

export function SyncQueuePanel({
  items,
  title = "Cola de sincronización",
  onRetry,
  onResolve,
  onDiscard,
  onSyncAll,
  className,
}: SyncQueuePanelProps) {
  const open = items.filter((i) => i.status !== "synced").length;
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl bg-surface-container-lowest shadow-card",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-space-sm px-space-md py-space-sm">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-primary">{title}</h3>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {open} operaciones por enviar
          </p>
        </div>
        {onSyncAll && open > 0 && (
          <Button size="sm" leadingIcon="sync" onClick={onSyncAll}>
            Sincronizar todo
          </Button>
        )}
      </header>
      <ul className="divide-y divide-surface-container">
        {items.map((it) => (
          <li
            key={it.id}
            className={cn(
              "flex flex-wrap items-center gap-space-sm px-space-md py-space-sm",
              it.status === "conflict" && "bg-error-container/30",
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-label-md text-label-md text-on-surface">{it.title}</p>
              {it.meta && (
                <p className="truncate font-numeric-data text-numeric-data text-on-surface-variant">
                  {it.meta}
                </p>
              )}
            </div>
            <SyncStatusChip status={it.status} />
            {it.status === "conflict" && (
              <div className="flex gap-1">
                {onResolve && (
                  <Button size="sm" variant="danger" onClick={() => onResolve(it)}>
                    Resolver
                  </Button>
                )}
                {onDiscard && (
                  <Button size="sm" variant="tonal" onClick={() => onDiscard(it)}>
                    Descartar
                  </Button>
                )}
              </div>
            )}
            {it.status === "pending" && onRetry && (
              <Button size="sm" variant="tonal" onClick={() => onRetry(it)}>
                Reintentar
              </Button>
            )}
          </li>
        ))}
        {items.length === 0 && (
          <li className="p-space-lg text-center font-body-sm text-body-sm text-on-surface-variant">
            No hay operaciones en cola.
          </li>
        )}
      </ul>
    </section>
  );
}
