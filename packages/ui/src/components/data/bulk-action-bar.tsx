import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface BulkActionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Número de elementos marcados. La barra no se muestra si es 0. */
  count: number;
  /** Texto junto al contador (por defecto "Marcado(s)"). */
  label?: string;
  /** Botones de acción (usa Button con className de color claro). */
  children?: ReactNode;
  onClear?: () => void;
  /** sticky (móvil, sobre la barra inferior) o fixed centrado (escritorio). */
  position?: "sticky" | "floating";
}

/** Barra flotante de acciones por lote (z-40). */
export function BulkActionBar({
  count,
  label,
  children,
  onClear,
  position = "floating",
  className,
  ...props
}: BulkActionBarProps) {
  if (count <= 0) return null;
  return (
    <div
      role="region"
      aria-label="Acciones por lote"
      className={cn(
        "z-40 flex items-center justify-between gap-space-sm rounded-2xl bg-primary p-space-sm text-on-primary shadow-bulk animate-fade-in",
        position === "sticky"
          ? "sticky bottom-20 w-full"
          : "fixed bottom-6 left-1/2 w-[min(92vw,640px)] -translate-x-1/2",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 pl-2">
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-1.5 font-label-sm text-[12px] font-bold text-on-secondary">
          {count}
        </span>
        <span className="font-label-sm text-label-sm font-medium">
          {label ?? (count === 1 ? "Marcado" : "Marcados")}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {children}
        {onClear && (
          <button
            type="button"
            aria-label="Limpiar selección"
            title="Limpiar selección"
            onClick={onClear}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest/10 transition-transform hover:bg-surface-container-lowest/20 active:scale-95"
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

/** Botón de acción para usar dentro de BulkActionBar (fondo navy-container). */
export function BulkAction({
  icon,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 items-center gap-1 rounded-xl bg-primary-container px-3 font-label-sm text-[12px] font-semibold transition-transform active:scale-95 hover:brightness-110",
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}
