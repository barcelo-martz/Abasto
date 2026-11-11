import { cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { Isotype, type LogoVariant } from "./isotype";

const word = cva("font-headline-md text-headline-md tracking-tight font-extrabold", {
  variants: {
    variant: { color: "text-primary", inverse: "text-on-primary", glass: "text-on-primary" },
  },
});

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  /** color: fondo claro · inverse: fondo navy · glass: sobre degradado/hero translúcido. */
  variant?: LogoVariant;
  /** Tamaño del isotipo en px. */
  size?: number;
  withWordmark?: boolean;
}

export function Logo({
  variant = "color",
  size = 36,
  withWordmark = true,
  className,
  ...props
}: LogoProps) {
  const inner = (
    <>
      <Isotype variant={variant} size={size} />
      {withWordmark && <span className={word({ variant })}>Abasto</span>}
    </>
  );
  return (
    <div
      role="img"
      aria-label="Abasto"
      className={cn(
        "inline-flex items-center gap-space-xs",
        variant === "glass" &&
          "rounded-xl bg-white/10 px-3 py-2 backdrop-blur-md ring-1 ring-white/20",
        className,
      )}
      {...props}
    >
      {inner}
    </div>
  );
}
