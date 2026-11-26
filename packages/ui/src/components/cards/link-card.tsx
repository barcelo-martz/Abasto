import type { ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { AppLink } from "../navigation/link";

export interface LinkCardProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  icon?: string;
  href: string;
  linkLabel: ReactNode;
  linkComponent?: ElementType;
  ref?: Ref<HTMLElement>;
}

export function LinkCard({
  eyebrow,
  title,
  description,
  icon,
  href,
  linkLabel,
  linkComponent,
  className,
  ref,
  ...props
}: LinkCardProps) {
  return (
    <article
      ref={ref}
      className={cn(
        "flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-lg shadow-card-sm transition-all hover:shadow-card",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-space-md">
        <div>
          {eyebrow && (
            <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-secondary">
              {eyebrow}
            </span>
          )}
          <h3 className="mt-1 font-headline-sm text-headline-sm font-bold text-primary">{title}</h3>
          {description && (
            <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary"
          >
            <Icon name={icon} size={24} />
          </div>
        )}
      </div>
      <div className="mt-space-md pt-space-xs">
        <AppLink
          href={href}
          linkComponent={linkComponent}
          className="inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-secondary hover:text-primary"
        >
          <span>{linkLabel}</span>
          <Icon name="chevron_right" size={16} />
        </AppLink>
      </div>
    </article>
  );
}
