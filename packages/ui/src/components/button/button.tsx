import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export const buttonVariants = cva(
  [
    "group/btn relative inline-flex select-none items-center justify-center whitespace-nowrap",
    "transition-all duration-200 cursor-pointer",
    "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    "aria-busy:cursor-wait aria-busy:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        /** Acción principal (navy). */
        primary:
          "bg-gradient-primary text-on-primary shadow-card hover:-translate-y-0.5 hover:shadow-raised active:translate-y-0 active:scale-[0.98]",
        /** Acento clínico validado (teal). */
        clinical:
          "bg-gradient-clinical text-on-secondary shadow-card hover:-translate-y-0.5 hover:shadow-raised active:translate-y-0 active:scale-[0.98]",
        /** Secundario "vidrio". */
        secondary:
          "bg-surface-container-lowest/80 text-primary shadow-card-sm backdrop-blur-md hover:-translate-y-0.5 hover:bg-surface-container hover:shadow-card active:translate-y-0 active:scale-[0.98]",
        /** Fantasma con subrayado animado. */
        ghost:
          "bg-transparent text-primary hover:text-secondary after:absolute after:inset-x-[inherit] after:bottom-1 after:h-0.5 after:w-0 after:rounded-full after:bg-secondary after:transition-all after:duration-300 hover:after:w-[calc(100%-2rem)]",
        /** Destructivo sólido. */
        danger:
          "bg-error text-on-error shadow-card-sm hover:bg-on-error-container hover:shadow-card active:scale-[0.98]",
        /** Destructivo suave (desactivar, descartar). */
        "danger-soft":
          "bg-error-container/40 text-error hover:bg-error-container active:scale-[0.98]",
        /** Confirmación / guardar y expedir. */
        success:
          "bg-success text-on-error shadow-card-sm hover:brightness-95 hover:shadow-card active:scale-[0.98]",
        /** Reportar / advertencia. */
        warning:
          "bg-warning-container text-on-warning-container shadow-ring-primary hover:brightness-95 active:scale-[0.98]",
        /** Terciario tonal (neutro). */
        tonal:
          "bg-surface-container text-primary hover:bg-surface-container-high active:scale-[0.98]",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-lg px-space-sm font-label-sm text-label-sm",
        md: "h-[42px] gap-2 rounded-xl px-space-md font-label-md text-label-md",
        lg: "h-[50px] gap-2.5 rounded-xl px-space-lg font-headline-sm text-headline-sm",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", fullWidth: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  ref?: Ref<HTMLButtonElement>;
  /** Nombre de Material Symbol a la izquierda. */
  leadingIcon?: string;
  /** Nombre de Material Symbol a la derecha. */
  trailingIcon?: string;
  /** Flecha deslizante a la derecha al hacer hover ("Continuar"). */
  arrow?: boolean;
  /** Muestra spinner, deshabilita y marca aria-busy. */
  loading?: boolean;
  /** Texto accesible mientras carga (p. ej. "Verificando MINSAP…"). */
  loadingText?: ReactNode;
  /** Renderiza el hijo (p. ej. <Link>) con los estilos del botón. */
  asChild?: boolean;
}

const ICON_PX = { sm: 16, md: 18, lg: 20 } as const;

export function Button({
  className,
  variant,
  size,
  fullWidth,
  leadingIcon,
  trailingIcon,
  arrow,
  loading,
  loadingText,
  asChild,
  disabled,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  const px = ICON_PX[size ?? "md"];
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);

  if (asChild) {
    return (
      <Slot.Root ref={ref as Ref<HTMLElement>} className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden
          className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ width: px - 2, height: px - 2 }}
        />
      ) : leadingIcon ? (
        <Icon name={leadingIcon} size={px} />
      ) : null}
      <span>{loading && loadingText ? loadingText : children}</span>
      {!loading && trailingIcon ? <Icon name={trailingIcon} size={px} /> : null}
      {!loading && arrow ? (
        <Icon
          name="arrow_forward"
          size={px}
          className="transition-transform duration-200 group-hover/btn:translate-x-1"
        />
      ) : null}
    </button>
  );
}
