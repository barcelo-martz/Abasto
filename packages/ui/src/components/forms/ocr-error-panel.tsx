import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface OcrErrorPanelProps {
  title?: ReactNode;
  /** Código mostrado en el badge, p. ej. "E-409" (se antepone "Error OCR #"). */
  code?: string;
  /** Texto introductorio sobre la lista de causas. */
  description?: ReactNode;
  causes?: ReactNode[];
  retryLabel?: string;
  manualLabel?: string;
  onRetry?: () => void;
  onManual?: () => void;
  className?: string;
}

export function OcrErrorPanel({
  title = "No pudimos reconocer los datos de la receta médica",
  code,
  description = "El sistema de validación no pudo certificar los sellos de seguridad oficiales debido a anomalías en el archivo:",
  causes = [],
  retryLabel = "Reintentar captura asistida",
  manualLabel = "Ingresar datos manualmente si la receta está dañada",
  onRetry,
  onManual,
  className,
}: OcrErrorPanelProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-space-md rounded-xl border border-error/20 bg-error-container/40 p-space-lg shadow-card-sm md:flex-row",
        className,
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
        <Icon name="document_scanner" size={28} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-space-xs">
        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="font-headline-sm text-headline-sm text-error">{title}</span>
          {code && (
            <span className="rounded-full bg-error px-2 py-0.5 font-label-sm text-label-sm text-on-error">
              Error OCR #{code}
            </span>
          )}
        </div>
        {description && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>
        )}
        {causes.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1 font-body-sm text-body-sm text-on-surface">
            {causes.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden className="font-bold text-error">
                  •
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        )}
        {(onRetry || onManual) && (
          <div className="mt-space-sm flex flex-wrap items-center gap-space-sm border-t border-error/15 pt-space-xs">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-error px-space-md py-space-xs font-label-md text-label-md text-on-error shadow-card-sm transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
              >
                <Icon name="refresh" size={18} />
                {retryLabel}
              </button>
            )}
            {onManual && (
              <button
                type="button"
                onClick={onManual}
                className="cursor-pointer font-label-md text-label-md text-primary underline underline-offset-4 transition-colors hover:text-secondary"
              >
                {manualLabel} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
