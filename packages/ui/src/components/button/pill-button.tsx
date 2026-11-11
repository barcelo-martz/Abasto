import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

const pillButton = cva(
  "group/pill inline-flex cursor-pointer items-center gap-space-sm rounded-full py-1.5 pl-1.5 pr-space-lg font-label-md text-label-md shadow-card-sm transition-all duration-200 hover:shadow-card active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-container",
        tonal: "bg-surface-container text-primary hover:bg-surface-container-high",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

const chip = cva("flex h-9 w-9 items-center justify-center rounded-full", {
  variants: {
    variant: {
      primary: "bg-primary-container text-on-primary",
      tonal: "bg-surface-container-lowest text-primary",
    },
  },
  defaultVariants: { variant: "primary" },
});

export interface PillButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof pillButton> {
  ref?: Ref<HTMLButtonElement>;
  /** Material Symbol dentro del chip circular. */
  icon: string;
}

export function PillButton({
  icon,
  variant,
  className,
  children,
  type = "button",
  ref,
  ...props
}: PillButtonProps) {
  return (
    <button ref={ref} type={type} className={cn(pillButton({ variant }), className)} {...props}>
      <span className={chip({ variant })}>
        <Icon name={icon} size={18} />
      </span>
      <span>{children}</span>
    </button>
  );
}
