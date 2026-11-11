import type { ElementType } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { AppLink } from "./link";

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  linkComponent?: ElementType;
  className?: string;
}

export function Breadcrumbs({ items, linkComponent, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Ruta de navegación" className={className}>
      <ol className="flex flex-wrap items-center gap-1 font-label-sm text-label-sm">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1">
              {c.href && !last ? (
                <AppLink
                  href={c.href}
                  linkComponent={linkComponent}
                  className="rounded text-on-surface-variant transition-colors hover:text-primary"
                >
                  {c.label}
                </AppLink>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(last ? "font-bold text-primary" : "text-on-surface-variant")}
                >
                  {c.label}
                </span>
              )}
              {!last && <Icon name="chevron_right" size={16} className="text-outline" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
