import { cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

const alert = cva(
  "relative flex gap-space-sm overflow-hidden rounded-xl p-space-md shadow-card-sm",
  {
    variants: {
      variant: {
        critical: "bg-error-container text-on-error-container",
        logistics: "bg-warning-container text-on-warning-container",
        notice: "bg-info-container text-on-info-container",
      },
    },
    defaultVariants: { variant: "notice" },
  },
);

const ICON = { critical: "error", logistics: "local_shipping", notice: "info" } as const;
const BADGE = { critical: "Crítica", logistics: "Logística", notice: "Aviso" } as const;
const ICON_BG = {
  critical: "bg-error text-on-error",
  logistics: "bg-warning text-white",
  notice: "bg-primary text-on-primary",
} as const;

export interface AlertCardProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  variant: "critical" | "logistics" | "notice";
  title: ReactNode;
  description?: ReactNode;
  /** Texto de tiempo, p. ej. "Hace 5 min". */
  time?: string;
  icon?: string;
  /** Botones de acción. */
  actions?: ReactNode;
  onDismiss?: () => void;
  ref?: Ref<HTMLElement>;
}

export function AlertCard({
  variant,
  title,
  description,
  time,
  icon,
  actions,
  onDismiss,
  className,
  ref,
  ...props
}: AlertCardProps) {
  return (
    <article
      ref={ref}
      role={variant === "critical" ? "alert" : "status"}
      className={cn(alert({ variant }), className)}
      {...props}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          ICON_BG[variant],
        )}
      >
        <Icon name={icon ?? ICON[variant]} size={22} filled={variant === "critical"} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-space-xs font-label-sm text-label-sm">
          <span className="font-bold uppercase tracking-wider">{BADGE[variant]}</span>
          {time && <span className="opacity-70">{time}</span>}
        </div>
        <h3 className="font-headline-sm text-headline-sm">{title}</h3>
        {description && <p className="font-body-sm text-body-sm opacity-90">{description}</p>}
        {actions && <div className="mt-space-xs flex flex-wrap gap-space-xs">{actions}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Descartar alerta"
          className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
        >
          <Icon name="close" size={20} />
        </button>
      )}
    </article>
  );
}
