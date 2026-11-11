import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  /** Sobre-título (etiqueta de módulo, versión…). */
  eyebrow?: ReactNode;
  /** Botones de acción principales. */
  actions?: ReactNode;
  /** Pestañas / filtros bajo el título (<Tabs/>). */
  tabs?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  tabs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-space-md", className)}>
      <div className="flex flex-col gap-space-md lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-3xl flex-col gap-space-xs">
          {eyebrow && <div className="flex flex-wrap items-center gap-space-xs">{eyebrow}</div>}
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile tracking-tight text-primary lg:font-headline-xl lg:text-headline-xl">
            {title}
          </h1>
          {description && (
            <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-space-xs">{actions}</div>}
      </div>
      {tabs}
    </div>
  );
}
