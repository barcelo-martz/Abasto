import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { IconButton } from "../button";
import { SyncChip } from "../badge/sync-chip";
import type { SyncChipProps } from "../badge/indicators";
import { Breadcrumbs, type Crumb } from "../navigation/breadcrumbs";

export interface TopbarProps {
  breadcrumbs?: Crumb[];
  /** Selector de contexto/territorio (p. ej. <TerritorySelector/>). */
  context?: ReactNode;
  /** Texto del trigger de búsqueda. */
  searchPlaceholder?: string;
  onSearchClick?: () => void;
  sync?: SyncChipProps;
  /** Campana (p. ej. <NotificationsMenu/>). */
  notifications?: ReactNode;
  /** Acciones rápidas a la derecha (usuario, etc.). */
  actions?: ReactNode;
  onMenuClick?: () => void;
  linkComponent?: ElementType;
  className?: string;
}

/** Barra superior institucional con efecto vidrio. */
export function Topbar({
  breadcrumbs,
  context,
  searchPlaceholder = "Buscar fármaco, lote, receta…",
  onSearchClick,
  sync,
  notifications,
  actions,
  onMenuClick,
  linkComponent,
  className,
}: TopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-nav)] flex h-16 items-center gap-space-md bg-surface/80 px-margin-mobile shadow-bar backdrop-blur-xl lg:px-gutter-lg",
        className,
      )}
    >
      {onMenuClick && (
        <IconButton
          icon="menu"
          aria-label="Abrir menú"
          variant="ghost"
          onClick={onMenuClick}
          className="lg:hidden"
        />
      )}
      <div className="flex min-w-0 items-center gap-space-md">
        {breadcrumbs && (
          <Breadcrumbs
            items={breadcrumbs}
            linkComponent={linkComponent}
            className="hidden md:flex"
          />
        )}
        {context}
      </div>
      <button
        type="button"
        onClick={onSearchClick}
        className="mx-auto hidden h-10 w-full max-w-md items-center gap-2 rounded-xl bg-surface-container-lowest px-space-sm text-outline shadow-card-sm transition-colors hover:text-on-surface-variant md:flex"
      >
        <Icon name="search" size={20} />
        <span className="flex-1 truncate text-left font-body-sm text-body-sm">
          {searchPlaceholder}
        </span>
        <kbd className="rounded-md bg-surface-container px-1.5 py-0.5 font-label-sm text-[11px] text-on-surface-variant">
          ⌘K
        </kbd>
      </button>
      <div className="ml-auto flex items-center gap-space-xs">
        {sync && <SyncChip {...sync} />}
        {notifications}
        {actions}
      </div>
    </header>
  );
}
