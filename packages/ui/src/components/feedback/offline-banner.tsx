import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface OfflineBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** "bar": barra superior persistente · "pill": píldora compacta para móvil. */
  variant?: "bar" | "pill";
  /** Operaciones guardadas localmente pendientes de enviar. */
  pendingCount?: number;
  message?: ReactNode;
  onSync?: () => void;
  onViewQueue?: () => void;
}

export function OfflineBanner({
  variant = "bar",
  pendingCount = 0,
  message,
  onSync,
  onViewQueue,
  className,
  ...props
}: OfflineBannerProps) {
  if (variant === "pill") {
    return (
      <div
        role="status"
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-full bg-warning-container px-3 font-label-sm text-label-sm text-on-warning-container",
          className,
        )}
        {...props}
      >
        <Icon name="cloud_off" size={14} />
        Sin conexión
        {pendingCount > 0 && <span className="tabular">· {pendingCount} pendientes</span>}
      </div>
    );
  }
  return (
    <div
      role="status"
      className={cn(
        "flex flex-wrap items-center gap-space-sm bg-inverse-surface px-margin-mobile py-space-xs text-inverse-on-surface sm:px-margin",
        className,
      )}
      {...props}
    >
      <Icon name="cloud_off" size={20} className="text-warning" />
      <p className="min-w-0 flex-1 font-label-md text-label-md">
        {message ??
          "Trabajas sin conexión. Los cambios se guardan en este dispositivo y se enviarán al reconectar."}
        {pendingCount > 0 && (
          <span className="tabular ml-2 rounded-full bg-warning px-2 py-0.5 font-label-sm text-label-sm text-primary">
            {pendingCount} en cola
          </span>
        )}
      </p>
      {onViewQueue && (
        <button
          type="button"
          onClick={onViewQueue}
          className="cursor-pointer font-label-md text-label-md underline-offset-4 hover:underline"
        >
          Ver cola
        </button>
      )}
      {onSync && (
        <button
          type="button"
          onClick={onSync}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-3 font-label-sm text-label-sm hover:bg-white/20"
        >
          <Icon name="sync" size={16} /> Reintentar
        </button>
      )}
    </div>
  );
}
