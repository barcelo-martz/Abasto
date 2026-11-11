import { cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export type FeedbackTone = "success" | "error" | "warning" | "info";

export const TONE_ICON: Record<FeedbackTone, string> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
  info: "info",
};

export const alertVariants = cva("relative flex items-start gap-space-sm rounded-xl p-space-md", {
  variants: {
    tone: {
      success: "bg-success-container text-on-success-container",
      error: "bg-error-container/60 text-on-error-container",
      warning: "bg-warning-container text-on-warning-container",
      info: "bg-info-container text-on-info-container",
    },
  },
  defaultVariants: { tone: "info" },
});

export const toneIconColor: Record<FeedbackTone, string> = {
  success: "text-success",
  error: "text-error",
  warning: "text-warning",
  info: "text-primary-container",
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: FeedbackTone;
  title?: ReactNode;
  description?: ReactNode;
  /** Botones / enlaces de acción bajo el texto. */
  actions?: ReactNode;
  /** Icono personalizado (nombre de Material Symbol). */
  icon?: string;
  onDismiss?: () => void;
}

export function Alert({
  tone = "info",
  title,
  description,
  actions,
  icon,
  onDismiss,
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      <Icon
        name={icon ?? TONE_ICON[tone]}
        size={22}
        filled
        className={cn("mt-0.5", toneIconColor[tone])}
      />
      <div className="min-w-0 flex-1 space-y-1">
        {title && <p className="font-headline-sm text-headline-sm">{title}</p>}
        {description && <p className="font-body-sm text-body-sm opacity-90">{description}</p>}
        {children}
        {actions && <div className="flex flex-wrap items-center gap-space-sm pt-1">{actions}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={onDismiss}
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg opacity-70 transition hover:bg-black/5 hover:opacity-100"
        >
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  );
}
