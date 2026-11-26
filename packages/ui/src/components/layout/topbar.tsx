import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn";
import type { SyncChipProps } from "../badge/indicators";
import { SyncChip } from "../badge/sync-chip";
import { IconButton } from "../button";
import { Icon } from "../icon";
import { Breadcrumbs, type Crumb } from "../navigation/breadcrumbs";

interface Enlace {
  href: string;
  texto: string;
}

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

  /** Componente utilizado para renderizar los enlaces. */
  linkComponent?: ElementType;

  /** Enlaces de navegación. */
  enlaces?: Enlace[];

  className?: string;
}

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
  enlaces,
  className,
}: TopbarProps) {
  const LinkComponent = linkComponent ?? "a";

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

      {enlaces && enlaces.length > 0 && (
        <nav className="hidden items-center gap-4 md:flex">
          {enlaces.map((enlace) => (
            <LinkComponent
              key={enlace.href}
              href={enlace.href}
              className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
            >
              {enlace.texto}
            </LinkComponent>
          ))}
        </nav>
      )}

      <button
        type="button"
        onClick={onSearchClick}
        className="mx-auto hidden h-10 w-full max-w-md items-center gap-2 rounded-xl bg-surface-container-lowest px-space-sm text-outline shadow-card-sm transition-colors hover:text-on-surface-variant md:flex"
      >
        <Icon name="search" size={20} />
        <span className="flex-1 truncate text-left font-body-sm text-body-sm">
          {searchPlaceholder}
        </span>
      </button>

      <div className="ml-auto flex items-center gap-space-xs">
        {sync && <SyncChip {...sync} />}
        {notifications}
        {actions}
      </div>
    </header>
  );
}
