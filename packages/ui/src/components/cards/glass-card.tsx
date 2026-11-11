import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";

export interface GlassBackdropProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/** Fondo degradado navy con halos para que el vidrio tenga qué desenfocar. */
export function GlassBackdrop({ className, children, ref, ...props }: GlassBackdropProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative isolate overflow-hidden rounded-3xl bg-gradient-hero p-space-lg",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-secondary/40 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 -z-10 h-56 w-56 rounded-full bg-primary-fixed-dim/30 blur-3xl"
      />
      {children}
    </div>
  );
}

export interface GlassCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  eyebrow?: string;
  /** Pie con acciones. */
  footer?: ReactNode;
  ref?: Ref<HTMLElement>;
}

/** Tarjeta glassmorphism; colocar sobre un fondo `bg-gradient-hero` o <GlassBackdrop>. */
export function GlassCard({
  title,
  eyebrow,
  footer,
  className,
  children,
  ref,
  ...props
}: GlassCardProps) {
  return (
    <section
      ref={ref}
      className={cn(
        "flex flex-col gap-space-sm rounded-2xl bg-white/10 p-space-md text-on-primary shadow-overlay ring-1 ring-inset ring-white/20 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {(eyebrow || title) && (
        <header className="flex flex-col gap-0.5">
          {eyebrow && (
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container">
              {eyebrow}
            </span>
          )}
          {title && <h3 className="font-headline-md text-headline-md">{title}</h3>}
        </header>
      )}
      {children && <div className="font-body-md text-body-md text-on-primary/85">{children}</div>}
      {footer && (
        <footer className="mt-space-xs flex flex-wrap items-center gap-space-xs border-t border-white/15 pt-space-sm">
          {footer}
        </footer>
      )}
    </section>
  );
}
