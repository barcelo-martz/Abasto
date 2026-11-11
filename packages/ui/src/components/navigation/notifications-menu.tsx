"use client";
import type { ReactNode } from "react";
import { Popover } from "radix-ui";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { CountBadge } from "../badge/count-badge";

export type NotificationTone = "info" | "warning" | "error" | "success";
export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  tone?: NotificationTone;
  icon?: string;
  unread?: boolean;
}

const TONE: Record<NotificationTone, string> = {
  info: "bg-info-container text-primary",
  warning: "bg-warning-container text-on-warning-container",
  error: "bg-error-container text-on-error-container",
  success: "bg-success-container text-on-success-container",
};
const DEFAULT_ICON: Record<NotificationTone, string> = {
  info: "info",
  warning: "warning",
  error: "emergency",
  success: "check_circle",
};

export interface NotificationsMenuProps {
  items: NotificationItem[];
  unreadCount?: number;
  onItemClick?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
  tone?: "light" | "dark";
  trigger?: ReactNode;
}

export function NotificationsMenu({
  items,
  unreadCount,
  onItemClick,
  onMarkAllRead,
  tone = "light",
  trigger,
}: NotificationsMenuProps) {
  const count = unreadCount ?? items.filter((i) => i.unread).length;
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={count ? `Notificaciones: ${count} sin leer` : "Notificaciones"}
        className={cn(
          "relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors",
          tone === "dark"
            ? "text-on-primary hover:bg-white/10"
            : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary",
        )}
      >
        {trigger ?? <Icon name="notifications" size={22} />}
        {count > 0 && (
          <CountBadge count={count} tone="error" className="absolute -right-0.5 -top-0.5" />
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-[70] w-80 max-w-[calc(100vw-2rem)] animate-modal-in rounded-2xl bg-surface-container-lowest shadow-overlay"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <p className="font-headline-sm text-headline-sm text-primary">Notificaciones</p>
            {onMarkAllRead && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="cursor-pointer font-label-sm text-label-sm text-secondary hover:underline"
              >
                Marcar como leídas
              </button>
            )}
          </div>
          <ul className="no-scrollbar max-h-80 overflow-y-auto px-2 pb-2">
            {items.length === 0 && (
              <li className="px-3 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
                No tienes notificaciones.
              </li>
            )}
            {items.map((n) => {
              const t = n.tone ?? "info";
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => onItemClick?.(n)}
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-surface-container-low",
                      n.unread && "bg-surface-container-low/60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        TONE[t],
                      )}
                    >
                      <Icon name={n.icon ?? DEFAULT_ICON[t]} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-label-md text-label-md text-on-surface">
                          {n.title}
                        </span>
                        {n.time && (
                          <span className="shrink-0 font-label-sm text-[11px] text-outline">
                            {n.time}
                          </span>
                        )}
                      </span>
                      {n.description && (
                        <span className="mt-0.5 line-clamp-2 block font-body-sm text-body-sm text-on-surface-variant">
                          {n.description}
                        </span>
                      )}
                    </span>
                    {n.unread && (
                      <span
                        aria-label="Sin leer"
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
