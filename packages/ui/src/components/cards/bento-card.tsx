import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

const bento = cva(
  "group relative flex overflow-hidden rounded-3xl p-space-lg shadow-card transition-shadow hover:shadow-raised",
  {
    variants: {
      tone: {
        light: "bg-surface-container-lowest text-on-surface",
        navy: "bg-gradient-hero text-on-primary",
        teal: "bg-gradient-clinical text-on-secondary",
      },
      layout: {
        /** Texto arriba, ilustración debajo. */
        stacked: "flex-col gap-space-md",
        /** Texto a la izquierda, ilustración a la derecha. */
        split: "flex-col gap-space-md sm:flex-row sm:items-center sm:justify-between",
      },
    },
    defaultVariants: { tone: "light", layout: "split" },
  },
);

export interface BentoCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "title">, VariantProps<typeof bento> {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Slot de ilustración (SVG, imagen o componente de brand/illustrations). */
  illustration?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  ref?: Ref<HTMLElement>;
}

export function BentoCard({
  tone = "light",
  layout = "split",
  eyebrow,
  title,
  description,
  illustration,
  actionLabel,
  onAction,
  className,
  children,
  ref,
  ...props
}: BentoCardProps) {
  const dark = tone !== "light";
  return (
    <article ref={ref} className={cn(bento({ tone, layout }), className)} {...props}>
      <div className="relative z-10 flex min-w-0 flex-1 flex-col items-start gap-space-xs">
        {eyebrow && (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-label-sm text-label-sm uppercase tracking-wider",
              dark
                ? "bg-white/15 text-on-primary"
                : "bg-secondary-container text-on-secondary-container",
            )}
          >
            {eyebrow}
          </span>
        )}
        <h3 className="font-headline-lg text-headline-lg">{title}</h3>
        {description && (
          <p
            className={cn(
              "max-w-prose font-body-md text-body-md",
              dark ? "text-on-primary/80" : "text-on-surface-variant",
            )}
          >
            {description}
          </p>
        )}
        {children}
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className={cn(
              "mt-space-xs inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-xl px-space-md font-label-md text-label-md transition-all active:scale-[0.98]",
              dark
                ? "bg-surface-container-lowest text-primary hover:bg-surface-container-low"
                : "bg-gradient-primary text-on-primary shadow-btn hover:-translate-y-0.5",
            )}
          >
            {actionLabel}
            <Icon
              name="arrow_forward"
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        )}
      </div>
      {illustration && (
        <div
          aria-hidden
          className={cn(
            "relative z-0 flex shrink-0 items-center justify-center",
            layout === "split" ? "sm:w-2/5" : "w-full",
          )}
        >
          {illustration}
        </div>
      )}
    </article>
  );
}
