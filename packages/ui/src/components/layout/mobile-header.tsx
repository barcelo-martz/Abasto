import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  /** Muestra la pastilla MINSAP junto al título. */
  badge?: ReactNode;
  onBack?: () => void;
  /** Acciones a la derecha (filtro, avatar). */
  actions?: ReactNode;
  /** fixed (por defecto) o static para previsualizar. */
  position?: "fixed" | "static";
  className?: string;
}

/** Cabecera compacta de 64px para móvil con safe-area. */
export function MobileHeader({
  title,
  subtitle,
  badge,
  onBack,
  actions,
  position = "fixed",
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        "pt-safe z-[var(--z-nav)] w-full bg-surface/80 shadow-bar backdrop-blur-xl",
        position === "fixed" && "fixed top-0",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between gap-space-sm px-gutter-sm">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container"
          >
            <Icon name="arrow_back" size={22} />
          </button>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-space-xs">
            <h1 className="truncate font-headline-sm text-headline-sm text-on-surface">{title}</h1>
            {badge}
          </div>
          {subtitle && (
            <span className="truncate font-label-sm text-label-sm text-on-surface-variant">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-space-xs">{actions}</div>
      </div>
    </header>
  );
}
