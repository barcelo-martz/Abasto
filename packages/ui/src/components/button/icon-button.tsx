import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export const iconButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary shadow-card-sm hover:bg-primary-container",
        clinical: "bg-secondary text-on-secondary shadow-card hover:bg-on-secondary-container",
        soft: "bg-surface-container-lowest text-primary shadow-card-sm hover:bg-surface-container",
        tonal: "bg-surface-container text-primary hover:bg-surface-container-high",
        ghost:
          "bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-primary",
        danger: "bg-error-container/40 text-error hover:bg-error-container",
      },
      /** sm 32px · md 40px · lg 48px (área táctil recomendada en móvil). */
      size: { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" },
      shape: { round: "rounded-full", square: "rounded-xl" },
    },
    defaultVariants: { variant: "primary", size: "md", shape: "round" },
  },
);

const ICON_PX = { sm: 18, md: 20, lg: 22 } as const;

export interface IconButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof iconButtonVariants> {
  ref?: Ref<HTMLButtonElement>;
  /** Nombre de Material Symbol. */
  icon: string;
  /** Obligatorio: nombre accesible del botón. */
  "aria-label": string;
  filled?: boolean;
}

export function IconButton({
  icon,
  variant,
  size,
  shape,
  filled,
  className,
  type = "button",
  ref,
  ...props
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      title={props.title ?? props["aria-label"]}
      className={cn(iconButtonVariants({ variant, size, shape }), className)}
      {...props}
    >
      <Icon name={icon} size={ICON_PX[size ?? "md"]} filled={filled} />
    </button>
  );
}
