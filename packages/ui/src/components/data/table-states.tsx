import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../button";
import { Icon } from "../icon";

export interface TableStateProps {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Estado vacío de la matriz de datos. */
export function TableEmpty({
  title = "Sin fármacos en este filtro",
  description = "No se encontraron registros para el criterio seleccionado.",
  action,
  className,
}: TableStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center px-space-lg py-space-2xl text-center", className)}
    >
      <div className="mb-space-sm flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container/40 text-secondary">
        <Icon name="inventory" size={32} />
      </div>
      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</h3>
      <p className="mt-1 max-w-sm font-body-sm text-body-sm text-on-surface-variant">
        {description}
      </p>
      {action && <div className="mt-space-md">{action}</div>}
    </div>
  );
}

/** Error de conexión con el nodo territorial. */
export function TableError({
  title = "No se pudo conectar con el nodo territorial",
  description = "Revisa tu conexión. Los datos locales siguen disponibles sin conexión.",
  onRetry,
  className,
}: TableStateProps & { onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center px-space-lg py-space-2xl text-center", className)}
    >
      <div className="mb-space-sm flex h-16 w-16 items-center justify-center rounded-full bg-error-container text-error">
        <Icon name="cloud_off" size={32} />
      </div>
      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</h3>
      <p className="mt-1 max-w-sm font-body-sm text-body-sm text-on-surface-variant">
        {description}
      </p>
      {onRetry && (
        <Button className="mt-space-md" variant="primary" leadingIcon="refresh" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

/** Filas esqueleto con shimmer (CLS = 0: misma altura que las filas reales). */
export function TableSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando"
      className={cn("divide-y divide-surface-container-high", className)}
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex h-[var(--row-height)] items-center gap-space-md px-space-lg">
          <div className="skeleton h-4 w-4 rounded" />
          <div className="skeleton h-10 w-10 rounded-xl" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="skeleton h-3.5 w-1/3 rounded" />
            <div className="skeleton h-2.5 w-1/5 rounded" />
          </div>
          <div className="skeleton hidden h-3 w-24 rounded md:block" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
