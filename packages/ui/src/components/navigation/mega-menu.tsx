import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { Button } from "../button";
import { AppLink } from "./link";

export interface MegaMenuItem {
  title: string;
  description: string;
  icon: string;
  href: string;
  /** Etiqueta corta junto al título: "Tiempo real", "IA Sanitaria". */
  tag?: string;
}

export interface MegaMenuCallout {
  icon?: string;
  title: string;
  description?: string;
  actionLabel: string;
  href?: string;
  onAction?: () => void;
}

export interface MegaMenuProps {
  /** Encabezado del panel. */
  title?: string;
  description?: string;
  /** Etiqueta de versión/institución a la derecha del encabezado. */
  badge?: string;
  /** Tarjetas de servicio (se diseñó para 4, en rejilla 2×2). */
  items: MegaMenuItem[];
  /** Llamada a la ayuda al pie del panel. */
  callout?: MegaMenuCallout;
  /** Se invoca al elegir un enlace (para cerrar el menú contenedor). */
  onNavigate?: () => void;
  linkComponent?: ElementType;
  className?: string;
  children?: ReactNode;
}

/** Panel de servicios del portal: 4 tarjetas + callout de ayuda. Úsalo dentro de un Popover o del PortalHeader. */
export function MegaMenu({
  title = "Servicios públicos farmacéuticos",
  description,
  badge,
  items,
  callout,
  onNavigate,
  linkComponent,
  className,
}: MegaMenuProps) {
  return (
    <div
      className={cn(
        "w-[min(56rem,calc(100vw-2rem))] overflow-hidden rounded-3xl bg-surface-container-lowest shadow-overlay",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-space-md bg-surface-container-low px-space-lg py-space-md">
        <div className="flex items-start gap-space-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-btn">
            <Icon name="medical_services" size={22} />
          </span>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary">{title}</h3>
            {description && (
              <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                {description}
              </p>
            )}
          </div>
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-secondary-container px-2.5 py-1 font-label-sm text-label-sm text-on-secondary-container">
            {badge}
          </span>
        )}
      </div>

      <ul className="grid gap-space-xs p-space-md sm:grid-cols-2">
        {items.map((it) => (
          <li key={it.href}>
            <AppLink
              href={it.href}
              linkComponent={linkComponent}
              onClick={onNavigate}
              className="group flex h-full gap-space-sm rounded-2xl p-space-sm transition-colors hover:bg-surface-container-low"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary-container transition-colors group-hover:bg-secondary-container group-hover:text-on-secondary-container">
                <Icon name={it.icon} size={24} />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-label-md text-label-md text-on-surface group-hover:text-primary">
                    {it.title}
                  </span>
                  {it.tag && (
                    <span className="rounded-full bg-info-container px-2 py-0.5 font-label-sm text-[10px] uppercase tracking-wide text-primary">
                      {it.tag}
                    </span>
                  )}
                </span>
                <span className="mt-1 line-clamp-3 block font-body-sm text-body-sm text-on-surface-variant">
                  {it.description}
                </span>
              </span>
            </AppLink>
          </li>
        ))}
      </ul>

      {callout && (
        <div className="flex flex-col gap-space-sm bg-avail-container px-space-lg py-space-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-space-sm">
            <Icon
              name={callout.icon ?? "support_agent"}
              size={24}
              className="mt-0.5 text-secondary"
            />
            <div>
              <p className="font-label-md text-label-md text-on-surface">{callout.title}</p>
              {callout.description && (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {callout.description}
                </p>
              )}
            </div>
          </div>
          {callout.href ? (
            <Button asChild variant="clinical" size="sm">
              <AppLink href={callout.href} linkComponent={linkComponent} onClick={onNavigate}>
                {callout.actionLabel}
              </AppLink>
            </Button>
          ) : (
            <Button
              variant="clinical"
              size="sm"
              onClick={() => {
                callout.onAction?.();
                onNavigate?.();
              }}
            >
              {callout.actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
